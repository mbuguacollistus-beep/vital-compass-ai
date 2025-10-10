import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BarChart3, Download, TrendingUp, Users, Activity, AlertCircle } from 'lucide-react';

interface AggregatedStats {
  totalPatients: number;
  totalVisits: number;
  avgWellbeingScore: number;
  commonConditions: { condition: string; count: number }[];
  commonSymptoms: { symptom: string; count: number }[];
  ageDistribution: { ageGroup: string; count: number }[];
}

export const HospitalDataAnalytics = () => {
  const [stats, setStats] = useState<AggregatedStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAggregatedData();
  }, []);

  const fetchAggregatedData = async () => {
    try {
      setLoading(true);

      // Fetch total patients
      const { count: patientCount, error: patientError } = await supabase
        .from('patients')
        .select('*', { count: 'exact', head: true });

      if (patientError) throw patientError;

      // Fetch total visits
      const { count: visitCount, error: visitError } = await supabase
        .from('medical_visits')
        .select('*', { count: 'exact', head: true });

      if (visitError) throw visitError;

      // Fetch average wellbeing score
      const { data: wellbeingData, error: wellbeingError } = await supabase
        .from('wellbeing_entries')
        .select('score');

      if (wellbeingError) throw wellbeingError;

      const avgScore = wellbeingData && wellbeingData.length > 0
        ? wellbeingData.reduce((sum, entry) => sum + entry.score, 0) / wellbeingData.length
        : 0;

      // Fetch common conditions
      const { data: patientsData, error: conditionsError } = await supabase
        .from('patients')
        .select('medical_conditions');

      if (conditionsError) throw conditionsError;

      const conditionMap = new Map<string, number>();
      patientsData?.forEach(patient => {
        patient.medical_conditions?.forEach((condition: string) => {
          conditionMap.set(condition, (conditionMap.get(condition) || 0) + 1);
        });
      });

      const commonConditions = Array.from(conditionMap.entries())
        .map(([condition, count]) => ({ condition, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      // Fetch common symptoms from wellbeing entries
      const { data: symptomsData, error: symptomsError } = await supabase
        .from('wellbeing_entries')
        .select('symptoms')
        .not('symptoms', 'is', null);

      if (symptomsError) throw symptomsError;

      const symptomMap = new Map<string, number>();
      symptomsData?.forEach(entry => {
        if (entry.symptoms) {
          const symptoms = entry.symptoms.split(',').map(s => s.trim());
          symptoms.forEach(symptom => {
            symptomMap.set(symptom, (symptomMap.get(symptom) || 0) + 1);
          });
        }
      });

      const commonSymptoms = Array.from(symptomMap.entries())
        .map(([symptom, count]) => ({ symptom, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setStats({
        totalPatients: patientCount || 0,
        totalVisits: visitCount || 0,
        avgWellbeingScore: Math.round(avgScore * 10) / 10,
        commonConditions,
        commonSymptoms,
        ageDistribution: []
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Error loading analytics",
        description: "Failed to fetch aggregated data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    try {
      const dataToExport = {
        exportDate: new Date().toISOString(),
        stats,
        disclaimer: "This data is anonymized and aggregated for research purposes only"
      };

      const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `hospital-analytics-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Data exported successfully",
        description: "Anonymized analytics data has been downloaded"
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export data",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Aggregated Patient Analytics
              </CardTitle>
              <CardDescription>
                Anonymized data for healthcare improvement and research
              </CardDescription>
            </div>
            <Button onClick={handleExportData} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="p-4 border-l-4 border-l-primary">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Total Patients</span>
              </div>
              <div className="text-3xl font-bold text-primary">{stats?.totalPatients || 0}</div>
            </Card>

            <Card className="p-4 border-l-4 border-l-accent">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium">Medical Visits</span>
              </div>
              <div className="text-3xl font-bold text-accent">{stats?.totalVisits || 0}</div>
            </Card>

            <Card className="p-4 border-l-4 border-l-warning">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-warning" />
                <span className="text-sm font-medium">Avg Wellbeing Score</span>
              </div>
              <div className="text-3xl font-bold">{stats?.avgWellbeingScore || 0}/10</div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Most Common Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                {stats?.commonConditions && stats.commonConditions.length > 0 ? (
                  <DataTable
                    data={stats.commonConditions}
                    columns={[
                      { key: 'condition', header: 'Condition' },
                      { 
                        key: 'count', 
                        header: 'Patients',
                        render: (item) => <Badge variant="secondary">{item.count}</Badge>
                      }
                    ]}
                    emptyMessage="No condition data available"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">No data available</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Most Common Symptoms</CardTitle>
              </CardHeader>
              <CardContent>
                {stats?.commonSymptoms && stats.commonSymptoms.length > 0 ? (
                  <DataTable
                    data={stats.commonSymptoms}
                    columns={[
                      { key: 'symptom', header: 'Symptom' },
                      { 
                        key: 'count', 
                        header: 'Reports',
                        render: (item) => <Badge variant="secondary">{item.count}</Badge>
                      }
                    ]}
                    emptyMessage="No symptom data available"
                  />
                ) : (
                  <p className="text-sm text-muted-foreground">No data available</p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6 bg-secondary/50 border-warning">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold mb-1">Privacy Notice</p>
                  <p className="text-muted-foreground">
                    All data shown is anonymized and aggregated. No personally identifiable information is displayed. 
                    This data is used solely for healthcare improvement, research, and disease surveillance purposes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};