import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mic, MicOff, FileText, Download, Copy, Play, Square } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface SOAPNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export const VoiceTranscriptionAssistant = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [soapNote, setSoapNote] = useState<SOAPNote>({
    subjective: '',
    objective: '',
    assessment: '',
    plan: ''
  });
  const [noteType, setNoteType] = useState<string>('soap');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        }
      });
      
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });
      
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudioForTranscription(audioBlob);
        
        // Stop all tracks to release the microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start(1000); // Collect data every second
      setIsRecording(true);
      
      toast({
        title: "Recording Started",
        description: "Speak clearly for better transcription accuracy",
      });
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  const processAudioForTranscription = async (audioBlob: Blob) => {
    try {
      // Convert audio to base64
      const arrayBuffer = await audioBlob.arrayBuffer();
      const base64Audio = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
      
      // Mock transcription - in production, call OpenAI Whisper API
      setTimeout(() => {
        const mockTranscription = `
Patient presents with chief complaint of severe headache for the past 3 days. Pain is described as throbbing, rated 8 out of 10, located in the frontal and temporal regions bilaterally. Patient reports associated nausea and photophobia. No vomiting noted. Pain is worse in the morning and improves slightly with rest in a dark room.

Vital signs: Blood pressure 160 over 95, heart rate 88, temperature 98.6 degrees Fahrenheit, respiratory rate 18, oxygen saturation 98% on room air.

Physical examination reveals alert and oriented patient in mild distress due to pain. Neurological examination shows no focal deficits. Fundoscopic examination shows mild papilledema. Neck is supple without meningeal signs.

Assessment: Likely migraine with possible medication overuse headache. Hypertension noted and requires follow-up.

Plan: Prescribe sumatriptan 100 mg for acute migraine treatment. Start lisinopril 10 mg daily for blood pressure control. Patient education on migraine triggers and lifestyle modifications. Follow-up in 2 weeks to reassess blood pressure and headache frequency. Consider neurology referral if symptoms persist or worsen.
        `;
        
        setTranscription(mockTranscription.trim());
        generateStructuredNote(mockTranscription.trim());
        setIsProcessing(false);
        
        toast({
          title: "Transcription Complete",
          description: "Your consultation has been converted to structured notes",
        });
      }, 3000);
    } catch (error) {
      console.error('Error processing audio:', error);
      setIsProcessing(false);
      toast({
        title: "Processing Error",
        description: "Failed to process audio recording",
        variant: "destructive",
      });
    }
  };

  const generateStructuredNote = (transcriptionText: string) => {
    // Mock AI processing to convert transcription to SOAP format
    const mockSOAP: SOAPNote = {
      subjective: "Patient presents with severe headache for 3 days. Throbbing pain rated 8/10 in frontal and temporal regions bilaterally. Associated nausea and photophobia. No vomiting. Pain worse in morning, improves with rest in dark room.",
      objective: "VS: BP 160/95, HR 88, T 98.6°F, RR 18, O2 98% RA. Alert, oriented, mild distress. Neuro exam: no focal deficits. Fundoscopy: mild papilledema. Neck supple, no meningeal signs.",
      assessment: "1. Migraine with possible medication overuse headache\n2. Hypertension, newly diagnosed",
      plan: "1. Rx sumatriptan 100mg for acute migraine\n2. Start lisinopril 10mg daily for HTN\n3. Patient education on migraine triggers\n4. F/U in 2 weeks for BP and headache reassessment\n5. Consider neurology referral if persistent"
    };
    
    setSoapNote(mockSOAP);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "Text has been copied successfully",
    });
  };

  const downloadNote = () => {
    let content = '';
    if (noteType === 'soap') {
      content = `SOAP NOTE
      
SUBJECTIVE:
${soapNote.subjective}

OBJECTIVE:
${soapNote.objective}

ASSESSMENT:
${soapNote.assessment}

PLAN:
${soapNote.plan}`;
    } else {
      content = transcription;
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `consultation-note-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Voice-to-Note Transcription
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
              size="lg"
              className={`${isRecording ? 'bg-destructive hover:bg-destructive/90' : ''}`}
            >
              {isRecording ? (
                <>
                  <Square className="mr-2 h-4 w-4" />
                  Stop Recording
                </>
              ) : isProcessing ? (
                <>
                  <Mic className="mr-2 h-4 w-4 animate-pulse" />
                  Processing...
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-4 w-4" />
                  Start Recording
                </>
              )}
            </Button>
            
            <Select value={noteType} onValueChange={setNoteType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select note format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="soap">SOAP Note</SelectItem>
                <SelectItem value="transcription">Raw Transcription</SelectItem>
                <SelectItem value="prescription">Prescription</SelectItem>
              </SelectContent>
            </Select>
            
            {transcription && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(transcription)}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
                <Button variant="outline" size="sm" onClick={downloadNote}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            )}
          </div>
          
          {isRecording && (
            <div className="flex items-center gap-2 text-destructive">
              <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Recording in progress...</span>
            </div>
          )}
        </CardContent>
      </Card>

      {transcription && (
        <div className="space-y-4">
          {noteType === 'soap' && soapNote.subjective ? (
            <div className="grid gap-4">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="text-lg">SOAP Note</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Badge variant="outline" className="mb-2">Subjective</Badge>
                    <p className="text-sm leading-relaxed">{soapNote.subjective}</p>
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-2">Objective</Badge>
                    <p className="text-sm leading-relaxed">{soapNote.objective}</p>
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-2">Assessment</Badge>
                    <p className="text-sm leading-relaxed whitespace-pre-line">{soapNote.assessment}</p>
                  </div>
                  <div>
                    <Badge variant="outline" className="mb-2">Plan</Badge>
                    <p className="text-sm leading-relaxed whitespace-pre-line">{soapNote.plan}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg">Transcription</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={transcription}
                  onChange={(e) => setTranscription(e.target.value)}
                  className="min-h-32"
                  placeholder="Transcribed text will appear here..."
                />
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};