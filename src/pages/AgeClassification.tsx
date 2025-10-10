import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TermsAndConditions } from '@/components/legal/TermsAndConditions';
import nixLogo from '@/assets/nix-ai-logo.png';

const AGE_GROUPS = [
  { id: '0-12', label: 'Child (0-12 years)', icon: '👶' },
  { id: '13-19', label: 'Teenager (13-19 years)', icon: '🧒' },
  { id: '20-39', label: 'Young Adult (20-39 years)', icon: '👨' },
  { id: '40-59', label: 'Middle Aged (40-59 years)', icon: '👴' },
  { id: '60+', label: 'Senior (60+ years)', icon: '👵' },
];

const AgeClassification = () => {
  const navigate = useNavigate();
  const [selectedAge, setSelectedAge] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleAgeSelection = () => {
    if (!selectedAge) return;
    setShowTerms(true);
  };

  const handleTermsAccept = () => {
    setIsProcessing(true);
    
    // Store age classification and terms acceptance
    localStorage.setItem('user_age_group', selectedAge);
    localStorage.setItem('terms_accepted', 'true');
    localStorage.setItem('terms_accepted_date', new Date().toISOString());
    
    // Navigate to auth
    setTimeout(() => {
      navigate('/auth');
    }, 1000);
  };

  const handleTermsDecline = () => {
    setShowTerms(false);
    setTermsAccepted(false);
    setSelectedAge('');
  };

  if (showTerms) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-6">
        <TermsAndConditions
          onAccept={handleTermsAccept}
          onDecline={handleTermsDecline}
          accepted={termsAccepted}
          onCheckChange={setTermsAccepted}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-6">
      <Card className="max-w-2xl w-full border-0 shadow-dialog bg-card/50 backdrop-blur-sm">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <img 
              src={nixLogo} 
              alt="Nix AI Healthcare logo" 
              className="w-16 h-16"
            />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Welcome to Nix AI Healthcare
          </CardTitle>
          <CardDescription className="text-lg">
            Help us serve you better by selecting your age group
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AGE_GROUPS.map((group) => (
              <button
                key={group.id}
                onClick={() => setSelectedAge(group.id)}
                className={`p-6 rounded-lg border-2 transition-all hover:scale-105 hover:shadow-lg ${
                  selectedAge === group.id
                    ? 'border-primary bg-primary/10 shadow-primary'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="text-4xl mb-2">{group.icon}</div>
                <div className="font-semibold text-foreground">{group.label}</div>
              </button>
            ))}
          </div>
          
          <Button
            onClick={handleAgeSelection}
            disabled={!selectedAge}
            variant="medical"
            size="lg"
            className="w-full text-lg"
          >
            Continue to Terms & Conditions
          </Button>
          
          <p className="text-xs text-center text-muted-foreground">
            This information helps us provide personalized healthcare recommendations
            and contribute to global health data analysis.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgeClassification;
