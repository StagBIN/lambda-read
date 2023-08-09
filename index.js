const AWS = require("aws-sdk");

const documentClient = new AWS.DynamoDB.DocumentClient();

const tableName = "content";

exports.handler = async(event) => {
    const params = {
        TableName: tableName,
        KeyConditionExpression: 'id = :hashKey',
        //ProjectionExpression: "#id, #data, #url",
        ExpressionAttributeValues: {
            ':hashKey': event.pathParameters.id,
        },
        // ExpressionAttributeNames: {
        //     "#data": "data",
        //     "#id": "id",
        //     "#url": "url"
        // },
    };

    var data = await documentClient.query(params).promise();

    if (!data.Items.length) {
        return {
            statusCode: 404,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ error: "Not found" })
        };
    }
    
    if (event.headers.buid == data.Items[0].buid) {
        data.Items[0].edit = true;
    } else {
        data.Items[0].edit = false;
    }
    
    delete data.Items[0].buid;
    
    // if(!data.Items[0].isEncrypted){
        data.Items[0].isEncrypted = data.Items[0].isEncrypted || false;
    // }
    
    const response = {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, buid'
        },
        body: JSON.stringify(data.Items),
    };
    return response;
};
