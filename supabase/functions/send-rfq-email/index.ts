
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { Resend } from "npm:resend@1.0.0";

interface EmailRequest {
  recipientEmail: string;
  pdfBase64: string;
  rfqReference: string;
  subject?: string;
  testMode?: boolean;
  emailService?: string; // Optional parameter to specify which email service to use
}

// Initialize Resend with API key from environment
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Email request received");
    
    const requestBody = await req.json();
    console.log("Request body received:", JSON.stringify(requestBody));
    
    const { 
      recipientEmail, 
      pdfBase64, 
      rfqReference, 
      subject, 
      testMode 
    } = requestBody as EmailRequest;

    // Validate required parameters
    if (!recipientEmail || !pdfBase64 || !rfqReference) {
      console.error("Missing required parameters in request:", { 
        hasRecipient: !!recipientEmail, 
        hasPDF: !!pdfBase64, 
        hasReference: !!rfqReference 
      });
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Missing required parameters: recipientEmail, pdfBase64, or rfqReference" 
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    }

    // Log details for debugging
    console.log(`Email request details:`);
    console.log(`- Recipient: ${recipientEmail}`);
    console.log(`- PDF size: ${pdfBase64.length} characters`);
    console.log(`- RFQ Reference: ${rfqReference}`);
    console.log(`- Test mode: ${testMode ? 'Yes' : 'No'}`);

    // Create email content
    const emailSubject = subject || `Request for Quotation: ${rfqReference}`;
    
    const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #00334e; border-bottom: 2px solid #00334e; padding-bottom: 10px;">
            Request for Quotation: ${rfqReference}
          </h1>
          <p>Please find attached the Request for Quotation document.</p>
          <p>This document contains important specifications and requirements for the requested products or services.</p>
          <div style="margin: 30px 0; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #00334e;">
            <p style="margin: 0; font-style: italic;">Kindly review the attached document and provide your quotation at your earliest convenience.</p>
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 40px; border-top: 1px solid #eee; padding-top: 10px;">
            This is an automated message from DeepCAL Operations Center. Please do not reply directly to this email.
          </p>
        </body>
      </html>
    `;

    // Skip actual sending in test mode
    if (!testMode) {
      try {
        const data = await resend.emails.send({
          from: "DeepCAL Operations <onboarding@resend.dev>",
          to: [recipientEmail],
          subject: emailSubject,
          html: htmlContent,
          attachments: [
            {
              filename: `RFQ-${rfqReference}.pdf`,
              content: pdfBase64
            },
          ],
        });
        
        console.log("Email sent successfully via Resend:", data);
      } catch (sendError: any) {
        console.error("Error from Resend API:", sendError);
        throw new Error(`Failed to send email: ${sendError.message || JSON.stringify(sendError)}`);
      }
    } else {
      console.log("Test mode: Email would be sent to:", recipientEmail);
    }

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Email with RFQ ${rfqReference} ${testMode ? 'would be sent' : 'sent'} to ${recipientEmail}`,
        testMode: testMode || false
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error sending RFQ email:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to send email" 
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  }
};

serve(handler);
