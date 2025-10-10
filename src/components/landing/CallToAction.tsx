import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const CallToAction = () => {
  return (
    <section className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-6">
        <Card className="max-w-4xl mx-auto border-0 shadow-dialog bg-card/50 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Start Your Health Journey Today
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Join healthcare providers and patients worldwide using Nix AI.
            </p>
            
            <Button 
              variant="medical" 
              size="lg"
              className="text-lg px-10 py-4 mb-8"
              onClick={() => {
                const ageGroup = localStorage.getItem('user_age_group');
                window.location.href = ageGroup ? '/auth' : '/age-classification';
              }}
            >
              Get Started
            </Button>
            
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 pt-8 border-t border-border">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">100%</div>
                <div className="text-sm text-muted-foreground">HIPAA Compliant</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent mb-1">24/7</div>
                <div className="text-sm text-muted-foreground">AI Monitoring</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">256-bit</div>
                <div className="text-sm text-muted-foreground">Encryption</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CallToAction;