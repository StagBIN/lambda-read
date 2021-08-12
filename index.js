const AWS = require("aws-sdk");

const documentClient = new AWS.DynamoDB.DocumentClient();

const tableName = "content";

exports.handler = async(event) => {
    const params = {
        TableName: tableName,
        KeyConditionExpression: 'id = :hashKey',
        ExpressionAttributeValues: {
            ':hashKey': event.pathParameters.id,
        }
    };

    const data = await documentClient.query(params).promise();

    if (!data.Items.length) {
        return {
            statusCode: 404,
            body: JSON.stringify({ error: "Not found" })
        };
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify(data.Items),
    };
    return response;
};
