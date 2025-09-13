import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Brain, AlertTriangle, BookOpen, Stethoscope, FileText, Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface DiagnosisSuggestion {
  condition: string;
  probability: number;
  reasoning: string;
  guidelines: string[];
  redFlags: string[];
}

export const SmartConsultationAssistant = () => {
  const [patientSymptoms, setPatientSymptoms] = useState('');
  const [patientHistory, setPatientHistory] = useState('');
  const [suggestions, setSuggestions] = useState<DiagnosisSuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const analyzeSymptomsAndHistory = async () => {
    if (!patientSymptoms.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter patient symptoms to analyze",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI analysis - in production, this would call an AI service
    setTimeout(() => {
      const mockSuggestions: DiagnosisSuggestion[] = [
        {
          condition: "Hypertensive Crisis",
          probability: 85,
          reasoning: "Severe headache, chest pain, and elevated BP readings suggest urgent hypertensive emergency",
          guidelines: [
            "Immediate IV antihypertensive therapy",
            "Monitor for end-organ damage",
            "CT head to rule out hemorrhage"
          ],
          redFlags: [
            "Blood pressure >180/120 mmHg",
            "Signs of end-organ damage",
            "Altered mental status"
          ]
        },
        {
          condition: "Migraine with Aura",
          probability: 60,
          reasoning: "Unilateral headache with visual disturbances, but elevated BP is concerning",
          guidelines: [
            "Rule out secondary causes first",
            "Consider triptans if BP normalizes",
            "Prophylactic therapy evaluation"
          ],
          redFlags: [
            "First severe headache",
            "Fever with headache",
            "Neurological deficits"
          ]
        }
      ];
      
      setSuggestions(mockSuggestions);
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis Complete",
        description: "AI suggestions generated based on clinical data",
      });
    }, 2000);
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return 'text-destructive';
    if (probability >= 60) return 'text-warning';
    return 'text-accent';
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Smart Consultation Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Patient Symptoms</label>
              <Textarea
                placeholder="Describe the patient's presenting symptoms..."
                value={patientSymptoms}
                onChange={(e) => setPatientSymptoms(e.target.value)}
                className="min-h-24"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Relevant Medical History</label>
              <Textarea
                placeholder="Enter relevant medical history, medications, allergies..."
                value={patientHistory}
                onChange={(e) => setPatientHistory(e.target.value)}
                className="min-h-24"
              />
            </div>
          </div>
          
          <Button 
            onClick={analyzeSymptomsAndHistory}
            disabled={isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Brain className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Clinical Data...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Generate AI Recommendations
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {suggestions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">AI Diagnostic Suggestions</h3>
          
          {suggestions.map((suggestion, index) => (
            <Card key={index} className="shadow-card border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Stethoscope className="h-5 w-5 text-primary" />
                    {suggestion.condition}
                  </CardTitle>
                  <Badge 
                    variant="outline" 
                    className={`${getProbabilityColor(suggestion.probability)} border-current`}
                  >
                    {suggestion.probability}% likelihood
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Clinical Reasoning</h4>
                  <p className="text-sm text-muted-foreground">{suggestion.reasoning}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                      <BookOpen className="h-4 w-4 text-accent" />
                      Evidence-Based Guidelines
                    </h4>
                    <ul className="space-y-1">
                      {suggestion.guidelines.map((guideline, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="w-1 h-1 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                          {guideline}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4 text-warning" />
                      Red Flag Symptoms
                    </h4>
                    <ul className="space-y-1">
                      {suggestion.redFlags.map((redFlag, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="w-1 h-1 bg-warning rounded-full mt-2 flex-shrink-0"></span>
                          {redFlag}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Card className="bg-muted/50 border-accent/20">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                AI suggestions are for clinical decision support only. Always use your professional judgment and follow institutional protocols.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};