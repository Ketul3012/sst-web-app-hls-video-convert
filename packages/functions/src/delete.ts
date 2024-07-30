import AWS from "aws-sdk";
import { Table } from "sst/node/table";
import { Bucket } from "sst/node/bucket";

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3({
  region: "us-east-1",
});

import { APIGatewayProxyHandlerV2 } from "aws-lambda";

export const main: APIGatewayProxyHandlerV2 = async (event) => {
  const params = {
    TableName: Table.VideosTable.tableName,
    Key: {
      id: event?.pathParameters?.id,
    },
  };
  const data = await dynamoDb.get(params).promise();

  if (data.Item) {
    await s3
      .deleteObject({
        Bucket: Bucket.VideosBucket.bucketName,
        Key: data.Item["key"],
      })
      .promise();
  }
  await dynamoDb.delete(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({ status: true }),
  };
};
