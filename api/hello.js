// Vercel Serverless Function
export default function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Handle GET request
  if (req.method === 'GET') {
    return res.status(200).json({
      message: 'Hello from Vercel Function!',
      timestamp: new Date().toISOString(),
      query: req.query,
    });
  }

  // Handle POST request
  if (req.method === 'POST') {
    const data = req.body;
    return res.status(200).json({
      message: 'Data received successfully',
      receivedData: data,
      timestamp: new Date().toISOString(),
    });
  }

  // Method not allowed
  res.status(405).json({ error: 'Method not allowed' });
}
