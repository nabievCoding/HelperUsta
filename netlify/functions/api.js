import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export const handler = async (event, context) => {
  const { httpMethod, path, body, queryStringParameters } = event;

  // CORS headers
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };

  // Handle OPTIONS for CORS
  if (httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Example: Get data from Supabase
    if (httpMethod === 'GET') {
      const { data, error } = await supabase
        .from('your_table_name')
        .select('*')
        .limit(10);

      if (error) {
        throw error;
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data,
        }),
      };
    }

    // Example: Create new record
    if (httpMethod === 'POST') {
      const requestData = JSON.parse(body);

      const { data, error } = await supabase
        .from('your_table_name')
        .insert([requestData])
        .select();

      if (error) {
        throw error;
      }

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          success: true,
          data,
        }),
      };
    }

    // Example: Update record
    if (httpMethod === 'PUT') {
      const requestData = JSON.parse(body);
      const { id, ...updateData } = requestData;

      const { data, error } = await supabase
        .from('your_table_name')
        .update(updateData)
        .eq('id', id)
        .select();

      if (error) {
        throw error;
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data,
        }),
      };
    }

    // Example: Delete record
    if (httpMethod === 'DELETE') {
      const { id } = queryStringParameters;

      const { error } = await supabase
        .from('your_table_name')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Record deleted successfully',
        }),
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };

  } catch (error) {
    console.error('Function error:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message,
      }),
    };
  }
};
