import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, ArrowLeft } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="text-6xl mb-4">🔍</div>
          <CardTitle className="text-3xl font-bold text-primary">404</CardTitle>
          <CardDescription className="text-lg">
            Page Not Found
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved. Let's get you back to {APP_NAME}.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={() => navigate(-1)}
              variant="outline"
              className="flex-1"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            <Button 
              onClick={() => navigate('/')}
              variant="medical"
              className="flex-1"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
