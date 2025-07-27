import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-healthcare.jpg";
import nixLogo from "@/assets/nix-ai-logo.png";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-subtle">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Healthcare environment" 
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-primary opacity-5"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="flex items-center justify-center mb-8">
          <img 
            src={nixLogo} 
            alt="Nix AI" 
            className="w-16 h-16 mr-4"
          />
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Nix AI
          </h1>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6 max-w-4xl mx-auto">
          Intelligent Patient History & Care Coordinator
        </h2>
        
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
          Your personal health historian that tracks trends, detects patterns, and coordinates care across your entire healthcare journey. Secure, intelligent, and always by your side.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            variant="medical" 
            size="lg"
            className="text-lg px-8 py-3"
          >
            Start Your Health Journey
          </Button>
          <Button 
            variant="soft" 
            size="lg"
            className="text-lg px-8 py-3"
          >
            Learn More
          </Button>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">📊</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Trend Analysis</h3>
            <p className="text-muted-foreground">AI-powered pattern detection in your health data</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-healing rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">🤝</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Care Coordination</h3>
            <p className="text-muted-foreground">Connect with family, caregivers, and clinicians</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">🔒</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Secure & Private</h3>
            <p className="text-muted-foreground">Bank-level encryption with full data control</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;