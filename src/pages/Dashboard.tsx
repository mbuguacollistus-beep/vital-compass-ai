import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FoodRecommendations from '@/components/food/FoodRecommendations';
import NutritionLog from '@/components/food/NutritionLog';
import { WellbeingTracker } from '@/components/health/WellbeingTracker';
import { VitalsTracker } from '@/components/health/VitalsTracker';
import { MedicationTracker } from '@/components/health/MedicationTracker';
import { HealthGoals } from '@/components/health/HealthGoals';
import { PatientProfileSetup } from '@/components/onboarding/PatientProfileSetup';
import { supabase } from '@/integrations/supabase/client';
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 animate-pulse">
            <img src={nixLogo} alt="Nix AI" className="w-full h-full" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Show profile setup for patients who need to complete their profile
  if (userRole === 'patient' && needsSetup && patientProfile) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <div className="container mx-auto px-6 py-8">
          <div className="mb-8 text-center">
            <img src={nixLogo} alt="Nix AI" className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Welcome to Nix AI
            </h1>
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Well-being Score</CardTitle>
            <CardDescription>Today's wellness tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">8/10</div>
            <p className="text-sm text-muted-foreground">Feeling good today</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Visits</CardTitle>
            <CardDescription>Next appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">2</div>
            <p className="text-sm text-muted-foreground">This week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Health Trends</CardTitle>
            <CardDescription>Pattern analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-green-600">Improving</div>
            <p className="text-sm text-muted-foreground">Overall health trend</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderProviderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>My Patients</CardTitle>
            <CardDescription>Active patient count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">24</div>
            <p className="text-sm text-muted-foreground">Active patients</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>Appointments today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">8</div>
            <p className="text-sm text-muted-foreground">Scheduled visits</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Alerts</CardTitle>
            <CardDescription>Patient notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-amber-600">3</div>
            <p className="text-sm text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b border-border/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src={nixLogo} alt="Nix AI" className="w-8 h-8" />
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Nix AI
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium">{user.email}</p>
              <p className="text-xs text-muted-foreground capitalize">{userRole || 'Loading...'}</p>
            </div>
            <Button variant="outline" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Welcome back, {user.email?.split('@')[0]}!
          </h2>
          <p className="text-muted-foreground">
            {userRole === 'patient' && "Here's your health overview."}
            {userRole === 'doctor' && "Manage your patients and appointments."}
            {userRole === 'nurse' && "Access patient care information."}
            {userRole === 'hospital_admin' && "Monitor hospital operations."}
            {userRole === 'caregiver' && "Support your loved ones' health journey."}
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {userRole === 'patient' && (
              <>
                <TabsTrigger value="wellbeing">Well-being</TabsTrigger>
                <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
                <TabsTrigger value="medications">Medications</TabsTrigger>
                <TabsTrigger value="goals">Health Goals</TabsTrigger>
                <TabsTrigger value="visits">Medical Visits</TabsTrigger>
                <TabsTrigger value="food">Food & Nutrition</TabsTrigger>
                <TabsTrigger value="network">Care Network</TabsTrigger>
              </>
            )}
            {(userRole === 'doctor' || userRole === 'nurse' || userRole === 'hospital_admin') && (
              <>
                <TabsTrigger value="patients">Patients</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="data-entry">Data Entry</TabsTrigger>
              </>
            )}
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            {userRole === 'patient' ? renderPatientDashboard() : renderProviderDashboard()}
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
            <Tabs defaultValue="recommendations" className="space-y-4">
              <TabsList>
                <TabsTrigger value="recommendations">Food Recommendations</TabsTrigger>
                <TabsTrigger value="nutrition-log">Nutrition Log</TabsTrigger>
              </TabsList>
              
              <TabsContent value="recommendations">
                <FoodRecommendations />
              </TabsContent>
              
              <TabsContent value="nutrition-log">
                <NutritionLog />
              </TabsContent>
            </Tabs>
          </TabsContent>
          
          <TabsContent value="visits" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Medical Visits History</CardTitle>
                <CardDescription>
                  View your past and upcoming medical appointments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Medical visits interface coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="network" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Care Network</CardTitle>
                <CardDescription>
                  Manage your healthcare providers and family caregivers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Care network interface coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="patients" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Patient Management</CardTitle>
                <CardDescription>
                  View and manage your patients' health data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Patient management interface coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="data-entry" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Medical Data Entry</CardTitle>
                <CardDescription>
                  Enter visit data, vitals, and treatment notes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Data entry interface coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>
                  Manage your account and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Profile settings coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;