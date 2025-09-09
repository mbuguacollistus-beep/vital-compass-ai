import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Send, Mic, MicOff, Brain, Heart, Activity } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'insight' | 'recommendation' | 'alert';
}

interface HealthInsight {
  id: string;
  title: string;
  description: string;
  type: 'positive' | 'warning' | 'info';
  confidence: number;
  actionable: boolean;
}

export const AIHealthCompanion = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI Health Companion. I've been analyzing your health data and I'm here to provide personalized insights. How are you feeling today?",
      sender: 'ai',
      timestamp: new Date(),
      type: 'insight'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [healthInsights, setHealthInsights] = useState<HealthInsight[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Mock health insights based on user data
  useEffect(() => {
    const mockInsights: HealthInsight[] = [
      {
        id: '1',
        title: 'Sleep Pattern Improvement',
        description: 'Your sleep quality has improved 15% over the past week. Keep maintaining your bedtime routine.',
        type: 'positive',
        confidence: 0.92,
        actionable: true
      },
      {
        id: '2',
        title: 'Blood Pressure Trend',
        description: 'I notice your blood pressure readings are slightly elevated in the mornings. Consider morning meditation.',
        type: 'warning',
        confidence: 0.78,
        actionable: true
      },
      {
        id: '3',
        title: 'Activity Goal Achievement',
        description: 'You\'ve exceeded your daily step goal 6 out of 7 days this week. Excellent progress!',
        type: 'positive',
        confidence: 0.98,
        actionable: false
      }
    ];
    setHealthInsights(mockInsights);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mock AI responses based on user input
  const getAIResponse = (userMessage: string): string => {
    const responses = {
      'tired': "I understand you're feeling tired. Based on your recent sleep data, you've averaged 6.2 hours of sleep this week. I recommend aiming for 7-8 hours and maintaining consistent sleep times.",
      'stressed': "Stress can significantly impact your health. I've noticed your heart rate variability has been lower lately. Would you like me to guide you through a 5-minute breathing exercise?",
      'pain': "I'm sorry to hear about your discomfort. Can you describe the pain scale (1-10) and location? I'll help track this and suggest when to consult your healthcare provider.",
      'exercise': "Great question! Based on your current fitness level and health goals, I recommend starting with 20-minute walks 3 times a week. Your smartwatch data shows you respond well to moderate activity.",
      'diet': "Your nutrition log shows you're doing well with protein intake but could increase fiber. Based on your preferences and restrictions, I suggest adding more leafy greens and berries."
    };

    const lowercaseMessage = userMessage.toLowerCase();
    
    for (const [key, response] of Object.entries(responses)) {
      if (lowercaseMessage.includes(key)) {
        return response;
      }
    }

    return "Thank you for sharing that with me. I'm constantly learning from your health patterns to provide better insights. Is there anything specific about your health you'd like to discuss today?";
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(inputMessage),
        sender: 'ai',
        timestamp: new Date(),
        type: 'recommendation'
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const startVoiceRecording = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
        toast({
          title: "Voice Recognition Error",
          description: "Unable to process voice input. Please try again.",
          variant: "destructive"
        });
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } else {
      toast({
        title: "Voice Recognition Unavailable",
        description: "Your browser doesn't support voice recognition.",
        variant: "destructive"
      });
    }
  };

  const getMessageIcon = (type?: string) => {
    switch (type) {
      case 'insight': return <Brain className="h-4 w-4 text-primary" />;
      case 'recommendation': return <Heart className="h-4 w-4 text-green-500" />;
      case 'alert': return <Activity className="h-4 w-4 text-yellow-500" />;
      default: return <Bot className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Health Insights Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Health Insights
          </CardTitle>
          <CardDescription>
            Personalized insights generated from your health data patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {healthInsights.map((insight) => (
              <div key={insight.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium">{insight.title}</h4>
                  <Badge variant={insight.type === 'positive' ? 'default' : insight.type === 'warning' ? 'destructive' : 'secondary'}>
                    {Math.round(insight.confidence * 100)}% confidence
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                {insight.actionable && (
                  <Button size="sm" variant="outline">
                    Take Action
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Chat Interface */}
      <Card className="h-[500px] flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Chat with Your AI Health Companion
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 px-6">
            <div className="space-y-4 pb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {message.sender === 'ai' ? <Bot className="h-4 w-4" /> : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {message.sender === 'ai' && getMessageIcon(message.type)}
                      <span className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg px-3 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask me about your health, symptoms, or get personalized advice..."
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={startVoiceRecording}
                disabled={isListening}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Button onClick={sendMessage} disabled={!inputMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Your AI companion uses your health data to provide personalized insights. Always consult healthcare professionals for medical decisions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};