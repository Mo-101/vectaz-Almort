
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the request data
    const { to, subject, content, queryType } = await req.json()

    // Validate input
    if (!to || !subject || !content) {
      throw new Error('Missing required fields: to, subject, or content')
    }

    if (!validateEmail(to)) {
      throw new Error('Invalid email address')
    }

    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Send email using Resend API
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    if (!RESEND_API_KEY) {
      throw new Error('Missing RESEND_API_KEY')
    }

    // Convert plain text to simple HTML if it's not already HTML
    const htmlContent = content.startsWith('<') 
      ? content 
      : `<pre style="font-family: sans-serif; white-space: pre-wrap;">${content}</pre>`;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Oracle Hut <oracle@logistics-oracle.com>',
        to: [to],
        subject: subject,
        html: htmlContent,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(`Failed to send email: ${data.message || 'Unknown error'}`)
    }

    // Log the email send for analytics - WRITE ONLY OPERATION
    await supabaseClient
      .from('email_logs')
      .insert({
        recipient: to,
        subject: subject,
        sent_at: new Date().toISOString(),
        status: 'sent',
        type: queryType || 'oracle_insight'
      })
      .select()

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email sent successfully',
        data: data,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error sending email:', error.message)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})

// Validate email format
function validateEmail(email: string) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}
