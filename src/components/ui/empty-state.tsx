import { ReactNode } from "react";
import { Button } from "./button";
import { Card, CardContent } from "./card";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export const EmptyState = ({ 
  icon, 
  title, 
  description, 
  action, 
  className 
}: EmptyStateProps) => {
  return (
    <Card className={className}>
      <CardContent className="text-center py-12 space-y-4">
        {icon && (
          <div className="text-6xl mb-4">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          {description}
        </p>
        {action && (
          <Button 
            onClick={action.onClick}
            variant="outline"
            className="mt-6"
          >
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};