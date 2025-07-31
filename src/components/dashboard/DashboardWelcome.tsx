import { useAuth } from '@/hooks/useAuth';

interface DashboardWelcomeProps {
  patientProfile?: any;
}

export const DashboardWelcome = ({ patientProfile }: DashboardWelcomeProps) => {
  const { user, userRole } = useAuth();
  
  const getWelcomeMessage = () => {
    if (userRole === 'patient' && patientProfile?.first_name) {
      return `Welcome back, ${patientProfile.first_name}!`;
    }
    return `Welcome back, ${user?.email?.split('@')[0]}!`;
  };

  const getSubtitle = () => {
    switch (userRole) {
      case 'patient':
        return "Here's your personalized health overview and recommendations.";
      case 'doctor':
        return "Manage your patients and appointments efficiently.";
      case 'nurse':
        return "Access patient care information and updates.";
      case 'hospital_admin':
        return "Monitor hospital operations and analytics.";
      case 'caregiver':
        return "Support your loved ones' health journey.";
      default:
        return "Welcome to your healthcare dashboard.";
    }
  };

  return (
    <div className="mb-8 space-y-2">
      <h2 className="text-3xl font-bold tracking-tight">
        {getWelcomeMessage()}
      </h2>
      <p className="text-muted-foreground text-lg">
        {getSubtitle()}
      </p>
    </div>
  );
};