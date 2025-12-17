import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // GET - Fetch data
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('your_table_name')
        .select('*')
        .limit(10);

      if (error) throw error;

      return res.status(200).json({
        success: true,
        data,
      });
    }

    // POST - Create new record
    if (req.method === 'POST') {
      const requestData = req.body;

      const { data, error } = await supabase
        .from('your_table_name')
        .insert([requestData])
        .select();

      if (error) throw error;

      return res.status(201).json({
        success: true,
        data,
      });
    }

    // PUT - Update record
    if (req.method === 'PUT') {
      const { id, ...updateData } = req.body;

      const { data, error } = await supabase
        .from('your_table_name')
        .update(updateData)
        .eq('id', id)
        .select();

      if (error) throw error;

      return res.status(200).json({
        success: true,
        data,
      });
    }

    // DELETE - Delete record
    if (req.method === 'DELETE') {
      const { id } = req.query;

      const { error } = await supabase
        .from('your_table_name')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return res.status(200).json({
        success: true,
        message: 'Record deleted successfully',
      });
    }

    res.status(405).json({ error: 'Method not allowed' });

  } catch (error) {
    console.error('Function error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
