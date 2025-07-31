import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { GoogleGenerativeAI } from 'https://esm.sh/@google/generative-ai'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY')!)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })

serve(async (req) => {
  console.log("Request received");

  if (req.method === 'OPTIONS') {
    console.log("Handling preflight request");
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the user's access token
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      {
        global: { headers: { Authorization: req.headers.get('Authorization')! } },
      }
    )

    // Get the user's data
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      console.error("User not authenticated");
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }
    console.log("User authenticated:", user.id);

    // Get the request body
    const { topic, schedule, summarization_prompt } = await req.json()
    console.log("Request body:", { topic, schedule, summarization_prompt });

    // Use Gemini to generate the API query and cron schedule
    const prompt = `
      You are a helpful assistant that converts natural language into a machine-readable format.
      Given a topic and a schedule, generate a JSON object with two keys:
      1. "api_query": A search query for a news API.
      2. "cron_schedule": A cron expression for the schedule.

      Topic: ${topic}
      Schedule: ${schedule}
    `
    console.log("Prompt for Gemini:", prompt);

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = await response.text()
    console.log("Response from Gemini:", text);

    // Extract the JSON from the response
    const jsonString = text.match(/\`\`\`json\n(.*)\n\`\`\`/s)![1]
    const { api_query, cron_schedule } = JSON.parse(jsonString)
    console.log("Parsed JSON from Gemini:", { api_query, cron_schedule });

    // Save the new subscription to the database
    const insertData = {
      user_id: user.id,
      api_query,
      cron_schedule,
      summarization_prompt,
    };
    console.log("Inserting into database:", insertData);

    const { data, error } = await supabase
      .from('newsletter_subscriptions')
      .insert(insertData)
      .select()

    if (error) {
      console.error("Database insert error:", error);
      throw error
    }

    console.log("Database insert successful:", data);
    return new Response(JSON.stringify(data), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error("Unhandled error:", error)
    return new Response(JSON.stringify({ error: 'Failed to create subscription' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})