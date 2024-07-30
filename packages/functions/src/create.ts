import AWS from "aws-sdk";
import * as uuid from "uuid";
import { Table } from "sst/node/table";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

import { APIGatewayProxyHandlerV2 } from "aws-lambda";

export const main: APIGatewayProxyHandlerV2 = async (event) => {
  const data = JSON.parse(event.body || "");

  const params = {
    TableName: Table.VideosTable.tableName,
    Item: {
      id: uuid.v1(), // A unique uuid
      name: data.name,
      url: data.url,
      key: data.key,
      createdAt: Date.now(),
    },
  };
  await dynamoDb.put(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify(params.Item),
  };
};
