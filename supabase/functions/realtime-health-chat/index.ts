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

  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    console.error('OPENAI_API_KEY not found');
    return new Response('Server configuration error', { status: 500 });
  }

  console.log('Connecting to OpenAI Realtime API...');
  
  // Connect to OpenAI Realtime API
  const openAISocket = new WebSocket("wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01", {
    headers: {
      "Authorization": `Bearer ${openAIApiKey}`,
      "OpenAI-Beta": "realtime=v1"
    }
  });

  let sessionActive = false;

  openAISocket.onopen = () => {
    console.log('Connected to OpenAI Realtime API');
  };

  openAISocket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log('Received from OpenAI:', data.type);

      // Send session update after receiving session.created
      if (data.type === 'session.created' && !sessionActive) {
        sessionActive = true;
        console.log('Sending session update...');
        
        const sessionUpdate = {
          "type": "session.update",
          "session": {
            "modalities": ["text", "audio"],
            "instructions": `You are a compassionate AI health assistant for NIX Healthcare Platform. You help patients with:
            
            - General health questions and concerns
            - Medication reminders and information
            - Symptom assessment (but always recommend professional consultation)
            - Wellness tips and preventive care
            - Mental health support and stress management
            - Nutrition and lifestyle guidance
            
            Always be empathetic, provide helpful information, but remind users that you cannot replace professional medical advice. 
            For urgent symptoms or emergencies, always direct them to seek immediate medical attention.
            Keep responses concise but caring. Ask follow-up questions to better understand their needs.`,
            "voice": "alloy",
            "input_audio_format": "pcm16",
            "output_audio_format": "pcm16",
            "input_audio_transcription": {
              "model": "whisper-1"
            },
            "turn_detection": {
              "type": "server_vad",
              "threshold": 0.5,
              "prefix_padding_ms": 300,
              "silence_duration_ms": 1000
            },
            "tools": [
              {
                "type": "function",
                "name": "get_health_info",
                "description": "Get general health information about symptoms, conditions, or medications. Tell the user you are looking up the latest health information.",
                "parameters": {
                  "type": "object",
                  "properties": {
                    "query": { "type": "string" },
                    "category": { 
                      "type": "string", 
                      "enum": ["symptoms", "conditions", "medications", "prevention", "nutrition"]
                    }
                  },
                  "required": ["query"]
                }
              },
              {
                "type": "function", 
                "name": "schedule_reminder",
                "description": "Help schedule medication reminders or health checkup reminders. Tell the user you are setting up their reminder.",
                "parameters": {
                  "type": "object",
                  "properties": {
                    "reminder_type": {
                      "type": "string",
                      "enum": ["medication", "checkup", "exercise", "water"]
                    },
                    "time": { "type": "string" },
                    "frequency": { "type": "string" }
                  },
                  "required": ["reminder_type", "time"]
                }
              }
            ],
            "tool_choice": "auto",
            "temperature": 0.7,
            "max_response_output_tokens": "inf"
          }
        };
        
        openAISocket.send(JSON.stringify(sessionUpdate));
      }

      // Handle function calls
      if (data.type === 'response.function_call_arguments.done') {
        console.log('Function call:', data.call_id, data.arguments);
        
        // Simulate function execution and send result back
        const functionResult = {
          "type": "conversation.item.create",
          "item": {
            "type": "function_call_output",
            "call_id": data.call_id,
            "output": JSON.stringify({
              "success": true,
              "message": "I've processed your request. Based on the information available, I recommend consulting with your healthcare provider for personalized advice."
            })
          }
        };
        
        openAISocket.send(JSON.stringify(functionResult));
        openAISocket.send(JSON.stringify({"type": "response.create"}));
      }

      // Forward all messages to client
      socket.send(event.data);
      
    } catch (error) {
      console.error('Error processing OpenAI message:', error);
    }
  };

  openAISocket.onerror = (error) => {
    console.error('OpenAI WebSocket error:', error);
    socket.send(JSON.stringify({
      type: 'error',
      message: 'Connection to AI assistant lost'
    }));
  };

  openAISocket.onclose = () => {
    console.log('OpenAI WebSocket closed');
    socket.close();
  };

  // Forward messages from client to OpenAI
  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log('Received from client:', data.type);
      
      if (openAISocket.readyState === WebSocket.OPEN) {
        openAISocket.send(event.data);
      } else {
        console.error('OpenAI socket not ready, state:', openAISocket.readyState);
      }
    } catch (error) {
      console.error('Error forwarding client message:', error);
    }
  };

  socket.onerror = (error) => {
    console.error('Client WebSocket error:', error);
  };

  socket.onclose = () => {
    console.log('Client WebSocket closed');
    openAISocket.close();
  };

  return response;
});