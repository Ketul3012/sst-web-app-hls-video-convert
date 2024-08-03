import {
  Api,
  Bucket,
  StackContext,
  StaticSite,
  Table,
  Function,
} from "sst/constructs";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as cloudfrontOrigins from "aws-cdk-lib/aws-cloudfront-origins";
import * as cdk from "aws-cdk-lib";
import {
  ManagedPolicy,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";
import { StorageClass } from "aws-cdk-lib/aws-s3";

export function ExampleStack({ stack }: StackContext) {
  const videoBucket = new Bucket(stack, "VideosBucket", {
    cdk: {
      bucket: {
        autoDeleteObjects: true,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        lifecycleRules: [
          {
            id: "delete-after-a-day",
            expiration: cdk.Duration.days(1),
            enabled: true,
          },
        ],
      },
    },
  });

  // Destination bucket for HLS output
  const hlsBucket = new Bucket(stack, "HLSBucket", {
    cdk: {
      bucket: {
        autoDeleteObjects: true,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        intelligentTieringConfigurations: [
          {
            name: "move-to-archive-after-90-days",
            archiveAccessTierTime: cdk.Duration.days(90),
            deepArchiveAccessTierTime: cdk.Duration.days(365),
          },
        ],
      },
    },
  });

  const mediaConvertRole = new Role(stack, "MediaConvertRole", {
    assumedBy: new ServicePrincipal("mediaconvert.amazonaws.com"),
    managedPolicies: [
      ManagedPolicy.fromAwsManagedPolicyName("AmazonS3FullAccess"),
      ManagedPolicy.fromAwsManagedPolicyName("AWSLambda_FullAccess"),
      ManagedPolicy.fromAwsManagedPolicyName(
        "AmazonAPIGatewayInvokeFullAccess"
      ),
    ],
  });

  const convertFunction = new Function(stack, "ConvertFunction", {
    handler: "packages/functions/src/convert.handler",
    environment: {
      VIDEO_BUCKET: videoBucket.bucketName,
      HLS_BUCKET: hlsBucket.bucketName,
      MEDIACONVERT_ROLE: mediaConvertRole.roleArn,
      MEDIACONVERT_ENDPOINT: "https://mediaconvert.us-east-1.amazonaws.com", // replace with your MediaConvert endpoint
    },
  });

  convertFunction.attachPermissions([
    new PolicyStatement({
      actions: ["iam:*", "mediaconvert:*"],
      resources: ["*"],
    }),
  ]);

  // Grant the Lambda function access to both buckets
  videoBucket.cdk.bucket.grantRead(convertFunction);
  hlsBucket.cdk.bucket.grantWrite(convertFunction);

  const distribution = new cloudfront.Distribution(stack, "Distribution", {
    defaultBehavior: {
      origin: new cloudfrontOrigins.S3Origin(hlsBucket.cdk.bucket),
    },
  });

  videoBucket.addNotifications(stack, {
    convertFunction: {
      function: convertFunction,
      events: ["object_created"],
      filters: [{ suffix: ".mp4" }],
    },
  });

  // Create the table
  const table = new Table(stack, "VideosTable", {
    fields: {
      id: "string",
    },
    primaryIndex: { partitionKey: "id" },
  });

  // Create the HTTP API
  const api = new Api(stack, "VideosApi", {
    defaults: {
      function: {
        // Bind the table name to our API
        bind: [table, videoBucket],
      },
    },
    routes: {
      "GET    /videos": "packages/functions/src/list.main",
      "POST   /videos": "packages/functions/src/create.main",
      "POST   /videos/upload": "packages/functions/src/upload.main",
      "GET    /videos/{id}": "packages/functions/src/get.main",
      "DELETE /videos/{id}": "packages/functions/src/delete.main",
    },
  });

  const web = new StaticSite(stack, "Website", {
    path: "packages/frontend",
    buildCommand: "pnpm run build",
    buildOutput: "dist",
    environment: {
      VITE_APP_API_URL: api.url,
      VITE_APP_VIDEO_BUCKET_NAME: hlsBucket.bucketName,
      VITE_APP_VIDEO_DOMAIN_NAME: distribution.domainName,
    },
  });

  // Show the API endpoint in the output
  stack.addOutputs({
    ApiEndpoint: api.url,
    VideoStreamUrl: distribution.domainName,
    VideoBucket: hlsBucket.bucketName,
    FrontendUrl: web.url,
  });
}
