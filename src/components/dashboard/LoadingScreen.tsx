import nixLogo from '@/assets/nix-ai-logo.png';

export const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
      <div className="text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-primary p-4 shadow-primary animate-pulse">
          <img src={nixLogo} alt="Nix AI" className="w-full h-full filter brightness-0 invert" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold bg-gradient-primary bg-clip-text text-transparent">
            Nix AI Healthcare
          </h3>
          <p className="text-muted-foreground">Loading your personalized dashboard...</p>
        </div>
        <div className="flex justify-center">
          <div className="w-8 h-1 bg-gradient-primary rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};