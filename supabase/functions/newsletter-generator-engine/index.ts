import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { GoogleGenerativeAI } from 'https://esm.sh/@google/generative-ai'

// Initialize the Gemini client
const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY')!)
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })

serve(async (req) => {
  // Create a Supabase client for service role access
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    {
      auth: { persistSession: false },
    }
  )

  try {
    // Fetch all active newsletter subscriptions
    const { data: subscriptions, error: fetchError } = await supabase
      .from('newsletter_subscriptions')
      .select('*')
      .eq('is_active', true)

    if (fetchError) {
      throw fetchError
    }

    if (!subscriptions || subscriptions.length === 0) {
      return new Response(JSON.stringify({ message: 'No active subscriptions found.' }), { status: 200, headers: { 'Content-Type': 'application/json' } })
    }

    // Process each subscription
    for (const subscription of subscriptions) {
      const { id: subscription_id, api_query, summarization_prompt } = subscription

      // --- Step 1: Fetch articles from News API ---
      const newsApiKey = Deno.env.get('NEWS_API_KEY')
      if (!newsApiKey) {
        console.error('NEWS_API_KEY is not set.')
        continue // Skip to the next subscription
      }

      let articles = []
      try {
        const newsApiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(api_query)}&apiKey=${newsApiKey}&pageSize=5&sortBy=publishedAt`
        const newsResponse = await fetch(newsApiUrl)
        if (!newsResponse.ok) {
          throw new Error(`News API request failed with status ${newsResponse.status}`)
        }
        const newsData = await newsResponse.json()
        articles = newsData.articles || []
      } catch (apiError) {
        console.error(`Failed to fetch articles for subscription ${subscription_id}:`, apiError)
        continue // Skip to the next subscription
      }

      if (articles.length === 0) {
        console.log(`No articles found for query: "${api_query}". Skipping subscription ${subscription_id}.`)
        continue
      }

      // Combine article content for summarization
      const combinedContent = articles.map(a => `Title: ${a.title}\nURL: ${a.url}\nContent: ${a.content || a.description || ''}`).join('\n\n---\n\n')

      // --- Step 2: Summarize with Gemini ---
      const summaryPrompt = `
        Based on the following articles, generate a newsletter summary. Adhere to these summarization instructions:
        "${summarization_prompt || 'Summarize the key points concisely.'}"

        Articles:
        ${combinedContent}

        Please also include a list of the original sources (Title and URL) at the end of the summary in a JSON array format, like this:
        [
          {
            "title": "Article Title 1",
            "url": "https://article1.com"
          },
          {
            "title": "Article Title 2",
            "url": "https://article2.com"
          }
        ]
      `

      const summaryResult = await model.generateContent(summaryPrompt)
      const summaryResponse = await summaryResult.response
      const summaryText = await summaryResponse.text()

      // Extract summary and sources from Gemini's response
      const sourcesMatch = summaryText.match(/```json\n(.*)\n```/s)
      let summaryContent = summaryText
      let sources = []

      if (sourcesMatch && sourcesMatch[1]) {
        try {
          sources = JSON.parse(sourcesMatch[1])
          summaryContent = summaryText.replace(sourcesMatch[0], '').trim() // Remove the JSON part from the summary
        } catch (parseError) {
          console.error('Failed to parse sources JSON:', parseError)
          // Fallback: use fetched articles as sources if parsing fails
          sources = articles.map(a => ({ title: a.title, url: a.url }))
        }
      } else {
        // Fallback: use fetched articles as sources if no JSON is found
        sources = articles.map(a => ({ title: a.title, url: a.url }))
      }

      // --- Step 3: Save to generated_newsletters table ---
      const { error: insertError } = await supabase
        .from('generated_newsletters')
        .insert({
          subscription_id,
          content: summaryContent,
          sources,
        })

      if (insertError) {
        console.error(`Failed to insert newsletter for subscription ${subscription_id}:`, insertError)
      }
    }

    return new Response(JSON.stringify({ message: 'Newsletter generation process completed.' }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error('Error in newsletter-generator-engine:', error)
    return new Response(JSON.stringify({ error: 'Failed to generate newsletters' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
})
