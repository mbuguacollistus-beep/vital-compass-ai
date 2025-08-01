import { cn } from "@/lib/utils";

interface ProgressIndicatorProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export const ProgressIndicator = ({ 
  steps, 
  currentStep, 
  className 
}: ProgressIndicatorProps) => {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                index < currentStep
                  ? "bg-primary text-primary-foreground"
                  : index === currentStep
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-2 transition-colors",
                  index < currentStep
                    ? "bg-primary"
                    : "bg-muted"
                )}
              />
            )}
          </div>
        ))}
      </div>
      <div className="text-center">
        <p className="text-sm font-medium">{steps[currentStep]}</p>
        <p className="text-xs text-muted-foreground">
          Step {currentStep + 1} of {steps.length}
        </p>
      </div>
    </div>
  );
};