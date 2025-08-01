import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { formatUserRole } from '@/lib/format';
import { APP_NAME, APP_DESCRIPTION } from '@/lib/constants';
import nixLogo from '@/assets/nix-ai-logo.png';

export const DashboardHeader = () => {
  const { user, userRole, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border/20 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary p-2 shadow-primary">
            <img src={nixLogo} alt="Nix AI" className="w-full h-full filter brightness-0 invert" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              {APP_NAME}
            </h1>
            <p className="text-xs text-muted-foreground">{APP_DESCRIPTION}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium">{user?.email}</p>
            <p className="text-xs text-muted-foreground capitalize">
              {userRole ? formatUserRole(userRole) : 'Loading...'}
            </p>
          </div>
          <Button variant="outline" onClick={signOut} className="shadow-sm">
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
};