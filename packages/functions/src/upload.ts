import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import AWS from "aws-sdk";
import { Bucket } from "sst/node/bucket";

const s3 = new AWS.S3({
  region: "us-east-1",
});

export const main: APIGatewayProxyHandlerV2 = async (event) => {
  const { filename, contentType } = JSON.parse(event.body || "");

  const params = {
    Bucket: Bucket.VideosBucket.bucketName,
    Key: `${filename}`,
    ContentType: contentType,
    Expires: 3600, // URL expiration time in seconds
  };

  const uploadUrl = await s3.getSignedUrlPromise("putObject", params);

  return {
    statusCode: 200,
    body: JSON.stringify({
      url: uploadUrl,
      msg: "Generated pre-signed URL successfully",
    }),
  };
};
