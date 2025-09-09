import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FoodRecommendations from '@/components/food/FoodRecommendations';
import NutritionLog from '@/components/food/NutritionLog';
import { WellbeingTracker } from '@/components/health/WellbeingTracker';
import { VitalsTracker } from '@/components/health/VitalsTracker';
import { MedicationTracker } from '@/components/health/MedicationTracker';
import { HealthGoals } from '@/components/health/HealthGoals';
import { PatientProfileSetup } from '@/components/onboarding/PatientProfileSetup';
import { PatientManagement } from '@/components/provider/PatientManagement';
import { ScheduleManagement } from '@/components/provider/ScheduleManagement';
import { DataEntry } from '@/components/provider/DataEntry';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardWelcome } from '@/components/dashboard/DashboardWelcome';
import { PatientOverview } from '@/components/dashboard/PatientOverview';
import { ProviderOverview } from '@/components/dashboard/ProviderOverview';
import { LoadingScreen } from '@/components/dashboard/LoadingScreen';
import { supabase } from '@/integrations/supabase/client';
import { MedicalVisits } from '@/components/healthcare/MedicalVisits';
import { CareNetwork } from '@/components/healthcare/CareNetwork';
import { ProfileSettings } from '@/components/settings/ProfileSettings';
import { AIHealthCompanion } from '@/components/ai/AIHealthCompanion';
import { SmartDeviceIntegration } from '@/components/devices/SmartDeviceIntegration';
import { HealthChallenges } from '@/components/community/HealthChallenges';
import { EnvironmentalHealth } from '@/components/environmental/EnvironmentalHealth';
import nixLogo from '@/assets/nix-ai-logo.png';

const Dashboard = () => {
  const { user, userRole, signOut, loading } = useAuth();
  const [patientProfile, setPatientProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);

  useEffect(() => {
    if (user && userRole === 'patient') {
      fetchPatientProfile();
    } else {
      setProfileLoading(false);
    }
  }, [user, userRole]);

  const fetchPatientProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching patient profile:', error);
      } else if (data) {
        setPatientProfile(data);
        // Check if profile needs completion
        const needsCompletion = !data.emergency_contact_name || 
                               !data.emergency_contact_phone ||
                               !data.medical_conditions?.length;
        setNeedsSetup(needsCompletion);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleProfileSetupComplete = () => {
    setNeedsSetup(false);
    fetchPatientProfile();
  };

  if (loading || profileLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Show profile setup for patients who need to complete their profile
  if (userRole === 'patient' && needsSetup && patientProfile) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <DashboardHeader />
        <div className="container mx-auto px-6 py-8">
          <div className="mb-8 text-center space-y-4">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-primary p-4 shadow-primary">
              <img src={nixLogo} alt="Nix AI" className="w-full h-full filter brightness-0 invert" />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Welcome to Nix AI Healthcare
              </h1>
              <p className="text-muted-foreground">Let's complete your health profile to provide personalized care</p>
            </div>
          </div>
          <PatientProfileSetup 
            patientId={patientProfile.id} 
            onComplete={handleProfileSetupComplete}
          />
        </div>
      </div>
    );
  }

  const renderPatientDashboard = () => (
    <PatientOverview />
  );

  const renderProviderDashboard = () => (
    <ProviderOverview />
  );

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <DashboardHeader />

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <DashboardWelcome patientProfile={patientProfile} />

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 bg-card shadow-card">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ai-companion">AI Companion</TabsTrigger>
            <TabsTrigger value="devices">Smart Devices</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="environmental">Environment</TabsTrigger>
            {userRole === 'patient' && (
              <>
                <TabsTrigger value="wellbeing">Well-being</TabsTrigger>
                <TabsTrigger value="vitals">Vitals</TabsTrigger>
                <TabsTrigger value="medications">Medications</TabsTrigger>
                <TabsTrigger value="goals">Goals</TabsTrigger>
                <TabsTrigger value="visits">Visits</TabsTrigger>
                <TabsTrigger value="food">Nutrition</TabsTrigger>
                <TabsTrigger value="network">Network</TabsTrigger>
              </>
            )}
            {(userRole === 'doctor' || userRole === 'nurse' || userRole === 'hospital_admin') && (
              <>
                <TabsTrigger value="patients" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Patients
                </TabsTrigger>
                <TabsTrigger value="schedule" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Schedule
                </TabsTrigger>
                <TabsTrigger value="data-entry" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                  Data Entry
                </TabsTrigger>
              </>
            )}
            <TabsTrigger value="profile" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Profile
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            {userRole === 'patient' ? renderPatientDashboard() : renderProviderDashboard()}
          </TabsContent>
          
          <TabsContent value="ai-companion" className="space-y-6">
            <AIHealthCompanion />
          </TabsContent>
          
          <TabsContent value="devices" className="space-y-6">
            <SmartDeviceIntegration />
          </TabsContent>
          
          <TabsContent value="challenges" className="space-y-6">
            <HealthChallenges />
          </TabsContent>
          
          <TabsContent value="environmental" className="space-y-6">
            <EnvironmentalHealth />
          </TabsContent>
          
          <TabsContent value="wellbeing" className="space-y-6">
            <WellbeingTracker />
          </TabsContent>
          
          <TabsContent value="vitals" className="space-y-6">
            <VitalsTracker />
          </TabsContent>
          
          <TabsContent value="medications" className="space-y-6">
            <MedicationTracker />
          </TabsContent>
          
          <TabsContent value="goals" className="space-y-6">
            <HealthGoals />
          </TabsContent>
          
          <TabsContent value="food" className="space-y-6">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span>🍎</span>
                    <span>Food Recommendations</span>
                  </CardTitle>
                  <CardDescription>
                    AI-powered nutrition suggestions based on your health profile
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FoodRecommendations />
                </CardContent>
              </Card>
              
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <span>📊</span>
                    <span>Nutrition Log</span>
                  </CardTitle>
                  <CardDescription>
                    Track your daily nutrition intake and patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <NutritionLog />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="visits" className="space-y-6">
            <MedicalVisits />
          </TabsContent>
          
          <TabsContent value="network" className="space-y-6">
            <CareNetwork />
          </TabsContent>
          
          <TabsContent value="patients" className="space-y-6">
            <PatientManagement />
          </TabsContent>
          
          <TabsContent value="schedule" className="space-y-6">
            <ScheduleManagement />
          </TabsContent>
          
          <TabsContent value="data-entry" className="space-y-6">
            <DataEntry />
          </TabsContent>
          
          <TabsContent value="profile" className="space-y-6">
            <ProfileSettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;