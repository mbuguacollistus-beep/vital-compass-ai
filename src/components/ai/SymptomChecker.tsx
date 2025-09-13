import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, AlertTriangle, Clock, Phone, Hospital, CheckCircle, Info } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface SymptomAssessment {
  urgency: 'emergency' | 'urgent' | 'routine' | 'self-care';
  title: string;
  description: string;
  recommendation: string;
  possibleCauses: string[];
  redFlags: string[];
  selfCareOptions: string[];
}

export const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState('');
  const [age, setAge] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [assessment, setAssessment] = useState<SymptomAssessment | null>(null);
  const { toast } = useToast();

  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) {
      toast({
        title: "Symptoms Required",
        description: "Please describe your symptoms to get an assessment",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI symptom analysis
    setTimeout(() => {
      const mockAssessment: SymptomAssessment = {
        urgency: symptoms.toLowerCase().includes('chest pain') ? 'emergency' : 
                symptoms.toLowerCase().includes('fever') ? 'urgent' : 'routine',
        title: symptoms.toLowerCase().includes('chest pain') 
          ? 'Chest Pain Assessment' 
          : symptoms.toLowerCase().includes('fever')
            ? 'Fever and Associated Symptoms'
            : 'General Health Assessment',
        description: symptoms.toLowerCase().includes('chest pain')
          ? 'Chest pain can indicate serious conditions requiring immediate medical attention.'
          : symptoms.toLowerCase().includes('fever')
            ? 'Fever with additional symptoms may indicate an infection requiring medical evaluation.'
            : 'Your symptoms suggest a condition that may benefit from medical consultation.',
        recommendation: symptoms.toLowerCase().includes('chest pain')
          ? 'Seek emergency medical attention immediately. Call 911 or go to the nearest emergency room.'
          : symptoms.toLowerCase().includes('fever')
            ? 'Schedule an urgent appointment with your healthcare provider within 24 hours.'
            : 'Consider scheduling a routine appointment with your healthcare provider.',
        possibleCauses: symptoms.toLowerCase().includes('chest pain')
          ? ['Heart attack', 'Pulmonary embolism', 'Aortic dissection', 'Pneumonia', 'Gastroesophageal reflux']
          : symptoms.toLowerCase().includes('fever')
            ? ['Viral infection', 'Bacterial infection', 'Flu', 'COVID-19', 'Urinary tract infection']
            : ['Viral illness', 'Stress', 'Dehydration', 'Allergic reaction', 'Minor infection'],
        redFlags: symptoms.toLowerCase().includes('chest pain')
          ? ['Severe crushing chest pain', 'Pain radiating to arm or jaw', 'Shortness of breath', 'Sweating', 'Nausea']
          : ['High fever >103°F', 'Difficulty breathing', 'Severe headache', 'Confusion', 'Persistent vomiting'],
        selfCareOptions: symptoms.toLowerCase().includes('chest pain')
          ? [] // No self-care for chest pain
          : ['Rest and hydration', 'Over-the-counter pain relievers', 'Monitor symptoms', 'Avoid strenuous activity']
      };
      
      setAssessment(mockAssessment);
      setIsAnalyzing(false);
      
      toast({
        title: "Assessment Complete",
        description: "AI symptom analysis generated based on your input",
      });
    }, 2000);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return 'text-destructive bg-destructive/10 border-destructive';
      case 'urgent': return 'text-warning bg-warning/10 border-warning';
      case 'routine': return 'text-accent bg-accent/10 border-accent';
      case 'self-care': return 'text-primary bg-primary/10 border-primary';
      default: return 'text-muted-foreground';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return <Phone className="h-4 w-4" />;
      case 'urgent': return <Clock className="h-4 w-4" />;
      case 'routine': return <Hospital className="h-4 w-4" />;
      case 'self-care': return <CheckCircle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-primary" />
            AI Symptom Checker & Triage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3 space-y-2">
              <label className="text-sm font-medium">Describe Your Symptoms</label>
              <Textarea
                placeholder="Please describe what you're experiencing in plain language. For example: 'I have a headache, feel nauseous, and have been running a fever for 2 days'"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="min-h-24"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Age (optional)</label>
              <Input
                type="number"
                placeholder="Age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </div>
          </div>
          
          <Button 
            onClick={analyzeSymptoms}
            disabled={isAnalyzing}
            className="w-full"
          >
            {isAnalyzing ? (
              <>
                <Search className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Symptoms...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Check My Symptoms
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {assessment && (
        <div className="space-y-4">
          <Card className={`shadow-card border-l-4 ${getUrgencyColor(assessment.urgency).replace('text-', 'border-l-').split(' ')[0]}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  {getUrgencyIcon(assessment.urgency)}
                  {assessment.title}
                </CardTitle>
                <Badge className={getUrgencyColor(assessment.urgency)}>
                  {assessment.urgency.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{assessment.description}</p>
              
              <Alert className={`${getUrgencyColor(assessment.urgency)} border`}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="font-medium">
                  {assessment.recommendation}
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm mb-2">Possible Causes</h4>
                  <ul className="space-y-1">
                    {assessment.possibleCauses.map((cause, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></span>
                        {cause}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    Watch for These Warning Signs
                  </h4>
                  <ul className="space-y-1">
                    {assessment.redFlags.map((flag, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="w-1 h-1 bg-warning rounded-full mt-2 flex-shrink-0"></span>
                        {flag}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {assessment.selfCareOptions.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-accent" />
                    Self-Care Options
                  </h4>
                  <ul className="space-y-1">
                    {assessment.selfCareOptions.map((option, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="w-1 h-1 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                        {option}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-muted/50 border-accent/20">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                This AI assessment is for informational purposes only and does not replace professional medical advice. Always consult healthcare professionals for accurate diagnosis and treatment.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};