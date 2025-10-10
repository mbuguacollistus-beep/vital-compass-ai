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
          alt="Healthcare environment showcasing modern medical technology and patient care" 
          className="w-full h-full object-cover opacity-10"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-primary opacity-5"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="flex items-center justify-center mb-8 fade-in">
          <img 
            src={nixLogo} 
            alt="Nix AI Healthcare logo" 
            className="w-16 h-16 mr-4 hover-scale"
            loading="eager"
          />
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Nix AI
          </h1>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6 max-w-3xl mx-auto fade-in" style={{animationDelay: "0.2s"}}>
          Your AI-Powered Healthcare Companion
        </h2>
        
        <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto fade-in" style={{animationDelay: "0.4s"}}>
          Track your health, coordinate care, and get intelligent insights.
        </p>
        
        <div className="fade-in" style={{animationDelay: "0.6s"}}>
          <Button 
            variant="medical" 
            size="lg"
            className="text-lg px-10 py-4 hover-glow"
            onClick={() => {
              const ageGroup = localStorage.getItem('user_age_group');
              window.location.href = ageGroup ? '/auth' : '/age-classification';
            }}
            aria-label="Get started with Nix AI Healthcare platform"
          >
            Get Started
          </Button>
        </div>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center fade-in group">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 hover-scale group-hover:shadow-primary transition-all duration-300 ease-out">
              <span className="text-white text-2xl" aria-hidden="true">📊</span>
            </div>
            <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-all duration-300 ease-out">Trend Analysis</h3>
            <p className="text-muted-foreground">AI-powered pattern detection in your health data</p>
          </div>
          
          <div className="text-center fade-in group" style={{animationDelay: "0.2s"}}>
            <div className="w-12 h-12 bg-gradient-healing rounded-full flex items-center justify-center mx-auto mb-4 hover-scale group-hover:shadow-primary transition-all duration-300 ease-out">
              <span className="text-white text-2xl" aria-hidden="true">🤝</span>
            </div>
            <h3 className="font-semibold text-lg mb-2 group-hover:text-accent transition-all duration-300 ease-out">Care Coordination</h3>
            <p className="text-muted-foreground">Connect with family, caregivers, and clinicians</p>
          </div>
          
          <div className="text-center fade-in group" style={{animationDelay: "0.4s"}}>
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 hover-scale group-hover:shadow-primary transition-all duration-300 ease-out">
              <span className="text-white text-2xl" aria-hidden="true">🔒</span>
            </div>
            <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-all duration-300 ease-out">Secure & Private</h3>
            <p className="text-muted-foreground">Bank-level encryption with full data control</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;