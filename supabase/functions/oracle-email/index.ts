
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@1.0.0";
import { createClient } from 'npm:@supabase/supabase-js';

// Initialize Resend with the API key from environment
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// CORS headers for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Create Supabase client to access database
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseKey);

interface EmailRequestBody {
  to: string;
  subject?: string;
  content: string;
  queryType?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body
    const { to, subject = "Oracle Logistics Insights", content, queryType = "logistics" } = await req.json() as EmailRequestBody;

    // Validate email format
    if (!to || !/^\S+@\S+\.\S+$/.test(to)) {
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Format the email content with a nice template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            color: #333;
            line-height: 1.6;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #00FFD1;
            border-radius: 5px;
          }
          .header {
            background-color: #1a202c;
            color: #00FFD1;
            padding: 15px;
            border-radius: 5px 5px 0 0;
            text-align: center;
          }
          .content {
            padding: 20px;
            background-color: #f9f9f9;
          }
          .insight {
            white-space: pre-wrap;
            background-color: #f1f1f1;
            padding: 15px;
            border-left: 4px solid #00FFD1;
            margin-bottom: 20px;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Oracle Hut: Logistics Insights</h1>
          </div>
          <div class="content">
            <p>Here are your requested insights on ${queryType}:</p>
            
            <div class="insight">
              ${content.replace(/\n/g, '<br>')}
            </div>
            
            <p>Use these insights to optimize your logistics operations and make data-driven decisions.</p>
          </div>
          <div class="footer">
            <p>This is an automated message from the Oracle Hut. Please do not reply directly to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Log the shipment insights for tracking
    console.log(`Sending logistics insights to ${to}`);

    // Send the email
    const emailResponse = await resend.emails.send({
      from: "Oracle Hut <oracle@resend-domains.com>",
      to: [to],
      subject: subject,
      html: htmlContent,
    });

    // Log the operation in Supabase
    const { error: logError } = await supabase
      .from('audit_logs')
      .insert([{
        action: 'EMAIL_SENT',
        table_name: 'oracle_emails',
        record_id: emailResponse.id,
        new_data: { to, subject, queryType }
      }]);

    if (logError) {
      console.error('Failed to log email operation:', logError);
    }

    return new Response(
      JSON.stringify({ success: true, id: emailResponse.id }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("Error in oracle-email function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Failed to send email" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
