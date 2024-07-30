import { Api, Bucket, StackContext, StaticSite, Table } from "sst/constructs";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as cloudfrontOrigins from "aws-cdk-lib/aws-cloudfront-origins";
import * as cdk from "aws-cdk-lib";

export function ExampleStack({ stack }: StackContext) {
  const videoBucket = new Bucket(stack, "VideosBucket", {
    cdk: {
      bucket: {
        autoDeleteObjects: true,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      },
    },
  });

  const distribution = new cloudfront.Distribution(stack, "Distribution", {
    defaultBehavior: {
      origin: new cloudfrontOrigins.S3Origin(videoBucket.cdk.bucket),
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
      VITE_APP_VIDEO_BUCKET_NAME: videoBucket.bucketName,
      VITE_APP_VIDEO_DOMAIN_NAME: distribution.domainName,
    },
  });

  // Show the API endpoint in the output
  stack.addOutputs({
    ApiEndpoint: api.url,
    VideoStreamUrl: distribution.domainName,
    VideoBucket: videoBucket.bucketName,
    FrontendUrl: web.url,
  });
}
