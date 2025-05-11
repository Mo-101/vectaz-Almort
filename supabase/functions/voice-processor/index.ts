
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getDeepTalkResponse } from "../_shared/deepTalkUtils.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// This function processes voice queries and text queries,
// then returns an appropriate response from DeepTalk
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { audio, text, context } = await req.json();
    let queryText = text;
    
    // If audio is provided but no text, we need to transcribe it
    if (audio && !queryText) {
      console.log("Transcribing audio to text...");
      
      try {
        // Call our speech-to-text function
        // Note: In a real setup, we would directly call the function rather than making an HTTP request
        // But for this example, we'll make an HTTP request to our speech-to-text function
        const transcriptionResponse = await fetch('https://hpogoxrxcnyxiqjmqtaw.functions.supabase.co/speech-to-text', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ audio }),
        });
        
        if (!transcriptionResponse.ok) {
          throw new Error(`Transcription failed: ${await transcriptionResponse.text()}`);
        }
        
        const transcriptionResult = await transcriptionResponse.json();
        queryText = transcriptionResult.text;
        
        console.log("Transcribed text:", queryText);
      } catch (transcriptionError) {
        console.error("Error during transcription:", transcriptionError);
        throw new Error(`Failed to transcribe audio: ${transcriptionError.message}`);
      }
    }
    
    if (!queryText) {
      throw new Error("No query text or audio provided");
    }
    
    console.log("Processing query:", queryText);
    
    // Use the shared utility to get a response from DeepTalk
    const response = await getDeepTalkResponse(queryText, context);
    
    return new Response(JSON.stringify({ 
      response,
      query: queryText,
      timestamp: new Date().toISOString(),
      processed: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in voice-processor function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      processed: false,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
