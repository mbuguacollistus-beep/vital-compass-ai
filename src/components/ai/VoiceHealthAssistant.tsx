import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { AudioRecorder, encodeAudioForAPI, playAudioData, clearAudioQueue } from '@/utils/RealtimeAudio';
import { Mic, MicOff, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const VoiceHealthAssistant: React.FC = () => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [audioEnabled, setAudioEnabled] = useState(true);
  
  const wsRef = useRef<WebSocket | null>(null);
  const recorderRef = useRef<AudioRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  const addMessage = (content: string, type: 'user' | 'assistant') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleAudioData = (audioData: Float32Array) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const encoded = encodeAudioForAPI(audioData);
      wsRef.current.send(JSON.stringify({
        type: 'input_audio_buffer.append',
        audio: encoded
      }));
    }
  };

  const startConversation = async () => {
    setIsConnecting(true);
    
    try {
      // Initialize audio context
      audioContextRef.current = new AudioContext({ sampleRate: 24000 });
      
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Connect to WebSocket
      const wsUrl = 'wss://egjmyjxcizwecawsxnkn.functions.supabase.co/realtime-health-chat';
      wsRef.current = new WebSocket(wsUrl);
      
      wsRef.current.onopen = () => {
        console.log('Connected to voice assistant');
        setIsConnected(true);
        setIsConnecting(false);
        
        // Start audio recording
        recorderRef.current = new AudioRecorder(handleAudioData);
        recorderRef.current.start();
        
        toast({
          title: "Voice Assistant Ready",
          description: "You can now speak with your AI health companion",
        });
      };

      wsRef.current.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Received:', data.type);
          
          switch (data.type) {
            case 'session.created':
              console.log('Session created successfully');
              break;
              
            case 'session.updated':
              console.log('Session updated successfully');
              break;
              
            case 'input_audio_buffer.speech_started':
              setIsListening(true);
              break;
              
            case 'input_audio_buffer.speech_stopped':
              setIsListening(false);
              break;
              
            case 'response.audio.delta':
              if (audioEnabled && data.delta && audioContextRef.current) {
                setIsSpeaking(true);
                // Convert base64 to Uint8Array
                const binaryString = atob(data.delta);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                  bytes[i] = binaryString.charCodeAt(i);
                }
                await playAudioData(audioContextRef.current, bytes);
              }
              break;
              
            case 'response.audio.done':
              setIsSpeaking(false);
              break;
              
            case 'response.audio_transcript.delta':
              setCurrentTranscript(prev => prev + (data.delta || ''));
              break;
              
            case 'response.audio_transcript.done':
              if (currentTranscript.trim()) {
                addMessage(currentTranscript.trim(), 'assistant');
                setCurrentTranscript('');
              }
              break;
              
            case 'conversation.item.input_audio_transcription.completed':
              if (data.transcript) {
                addMessage(data.transcript, 'user');
              }
              break;
              
            case 'error':
              console.error('Assistant error:', data.message);
              toast({
                title: "Error",
                description: data.message || "An error occurred",
                variant: "destructive"
              });
              break;
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        toast({
          title: "Connection Error",
          description: "Failed to connect to voice assistant",
          variant: "destructive"
        });
        setIsConnecting(false);
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket connection closed');
        setIsConnected(false);
        setIsConnecting(false);
        setIsSpeaking(false);
        setIsListening(false);
      };
      
    } catch (error) {
      console.error('Error starting conversation:', error);
      setIsConnecting(false);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to start conversation',
        variant: "destructive",
      });
    }
  };

  const endConversation = () => {
    if (recorderRef.current) {
      recorderRef.current.stop();
      recorderRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    clearAudioQueue();
    setIsConnected(false);
    setIsSpeaking(false);
    setIsListening(false);
    setCurrentTranscript('');
    
    toast({
      title: "Conversation Ended",
      description: "Voice assistant disconnected",
    });
  };

  const toggleAudio = () => {
    setAudioEnabled(prev => {
      if (!prev) {
        clearAudioQueue();
      }
      return !prev;
    });
  };

  useEffect(() => {
    return () => {
      endConversation();
    };
  }, []);

  return (
    <Card className="h-full flex flex-col shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span>🎤</span>
            <span>AI Health Assistant</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {isConnected && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleAudio}
                  className="p-2"
                >
                  {audioEnabled ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                </Button>
                
                {isListening && (
                  <Badge variant="secondary" className="animate-pulse">
                    <Mic className="h-3 w-3 mr-1" />
                    Listening...
                  </Badge>
                )}
                
                {isSpeaking && (
                  <Badge variant="secondary" className="animate-pulse">
                    <Volume2 className="h-3 w-3 mr-1" />
                    Speaking...
                  </Badge>
                )}
              </>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col space-y-4">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3 min-h-0">
          {messages.length === 0 && !isConnected && (
            <div className="text-center py-8 text-muted-foreground">
              <div className="mb-4">
                <Mic className="h-12 w-12 mx-auto text-muted-foreground/50" />
              </div>
              <h3 className="font-semibold mb-2">Your AI Health Companion</h3>
              <p className="text-sm">
                Start a voice conversation for personalized health guidance, 
                symptom assessment, and wellness support.
              </p>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                  message.type === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          
          {currentTranscript && (
            <div className="flex justify-start">
              <div className="max-w-[80%] px-3 py-2 rounded-lg text-sm bg-muted opacity-70">
                {currentTranscript}
                <span className="animate-pulse">...</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Controls */}
        <div className="flex justify-center space-x-4">
          {!isConnected ? (
            <Button 
              onClick={startConversation}
              disabled={isConnecting}
              className="bg-gradient-primary text-white hover:opacity-90"
            >
              {isConnecting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Mic className="h-4 w-4 mr-2" />
              )}
              {isConnecting ? 'Connecting...' : 'Start Conversation'}
            </Button>
          ) : (
            <Button 
              onClick={endConversation}
              variant="secondary"
            >
              <MicOff className="h-4 w-4 mr-2" />
              End Conversation
            </Button>
          )}
        </div>
        
        {isConnected && (
          <div className="text-xs text-center text-muted-foreground">
            💡 Speak naturally about your health concerns. 
            For emergencies, contact your doctor or call emergency services.
          </div>
        )}
      </CardContent>
    </Card>
  );
};