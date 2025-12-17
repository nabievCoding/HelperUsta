// Netlify serverless function example
exports.handler = async (event, context) => {
  // Get request method
  const { httpMethod, body, queryStringParameters } = event;

  // Handle different HTTP methods
  if (httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: 'Hello from Netlify Function!',
        timestamp: new Date().toISOString(),
        queryParams: queryStringParameters,
      }),
    };
  }

  if (httpMethod === 'POST') {
    const data = JSON.parse(body);
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        message: 'Data received successfully',
        receivedData: data,
        timestamp: new Date().toISOString(),
      }),
    };
  }

  // Handle OPTIONS for CORS
  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      },
      body: '',
    };
  }

  // Method not allowed
  return {
    statusCode: 405,
    body: JSON.stringify({ error: 'Method not allowed' }),
  };
};
