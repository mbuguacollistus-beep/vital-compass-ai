import { LoadingSpinner } from '@/components/ui/loading-spinner';
import nixLogo from '@/assets/nix-ai-logo.png';

export const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
      <div className="text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-primary p-4 shadow-primary animate-pulse">
          <img src={nixLogo} alt="Nix AI" className="w-full h-full filter brightness-0 invert" />
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Loading Nix AI
          </h2>
          <p className="text-muted-foreground">Preparing your healthcare dashboard...</p>
          <LoadingSpinner size="lg" className="mx-auto" />
        </div>
      </div>
    </div>
  );
};