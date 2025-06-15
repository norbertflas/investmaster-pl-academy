
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { endpoint, params } = await req.json();
    const ALPHA_VANTAGE_KEY = Deno.env.get('ALPHA_VANTAGE_API_KEY');

    if (!ALPHA_VANTAGE_KEY) {
      throw new Error('Alpha Vantage API key not configured');
    }

    // Construct the Alpha Vantage API URL
    const url = new URL('https://www.alphavantage.co/query');
    url.searchParams.set('apikey', ALPHA_VANTAGE_KEY);
    
    // Add all parameters
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });

    console.log('Making request to Alpha Vantage:', url.toString());

    const response = await fetch(url.toString());
    const data = await response.json();

    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }

    if (data['Note']) {
      throw new Error('API limit reached. Please try again later.');
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in market-data function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
