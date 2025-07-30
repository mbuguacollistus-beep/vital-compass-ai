import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Heart, Activity, Weight, Thermometer } from "lucide-react";

interface VitalEntry {
  id: string;
  visit_date: string;
  vitals: any; // Changed from specific interface to any to handle Json type
  visit_type: string;
}

export const VitalsTracker = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState<VitalEntry[]>([]);
  const [patientId, setPatientId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    blood_pressure_systolic: "",
    blood_pressure_diastolic: "",
    heart_rate: "",
    temperature: "",
    weight: "",
    height: "",
    oxygen_saturation: "",
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchPatientProfile();
  }, []);

  useEffect(() => {
    if (patientId) {
      fetchVitalEntries();
    }
  }, [patientId]);

  const fetchPatientProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: patient } = await supabase
          .from('patients')
          .select('id')
          .eq('user_id', user.id)
          .single();
        
        if (patient) {
          setPatientId(patient.id);
        }
      }
    } catch (error) {
      console.error('Error fetching patient profile:', error);
    }
  };

  const fetchVitalEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('medical_visits')
        .select('id, visit_date, vitals, visit_type')
        .eq('patient_id', patientId)
        .not('vitals', 'is', null)
        .order('visit_date', { ascending: false })
        .limit(10);

      if (error) throw error;
      setEntries((data as VitalEntry[]) || []);
    } catch (error) {
      console.error('Error fetching vital entries:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId) return;

    setLoading(true);
    try {
      const vitals: any = {};
      
      if (formData.blood_pressure_systolic) vitals.blood_pressure_systolic = parseFloat(formData.blood_pressure_systolic);
      if (formData.blood_pressure_diastolic) vitals.blood_pressure_diastolic = parseFloat(formData.blood_pressure_diastolic);
      if (formData.heart_rate) vitals.heart_rate = parseFloat(formData.heart_rate);
      if (formData.temperature) vitals.temperature = parseFloat(formData.temperature);
      if (formData.weight) vitals.weight = parseFloat(formData.weight);
      if (formData.height) vitals.height = parseFloat(formData.height);
      if (formData.oxygen_saturation) vitals.oxygen_saturation = parseFloat(formData.oxygen_saturation);

      const { error } = await supabase
        .from('medical_visits')
        .insert({
          patient_id: patientId,
          visit_date: formData.date,
          visit_type: 'Self-Recorded Vitals',
          vitals: vitals,
        });

      if (error) throw error;

      toast({
        title: "Vitals recorded!",
        description: "Your vital signs have been saved successfully.",
      });

      setFormData({
        blood_pressure_systolic: "",
        blood_pressure_diastolic: "",
        heart_rate: "",
        temperature: "",
        weight: "",
        height: "",
        oxygen_saturation: "",
        date: new Date().toISOString().split('T')[0],
      });

      fetchVitalEntries();
    } catch (error) {
      console.error('Error saving vitals:', error);
      toast({
        title: "Error",
        description: "Failed to save vital signs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getBloodPressureStatus = (systolic?: number, diastolic?: number) => {
    if (!systolic || !diastolic) return { status: "N/A", color: "text-muted-foreground" };
    
    if (systolic < 120 && diastolic < 80) return { status: "Normal", color: "text-green-600" };
    if (systolic < 130 && diastolic < 80) return { status: "Elevated", color: "text-yellow-600" };
    if (systolic < 140 || diastolic < 90) return { status: "High Stage 1", color: "text-orange-600" };
    return { status: "High Stage 2", color: "text-red-600" };
  };

  return (
    <div className="space-y-6">
      {/* Record Vitals Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Record Vital Signs
          </CardTitle>
          <CardDescription>
            Track your vital signs for better health monitoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({...prev, date: e.target.value}))}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="systolic">Blood Pressure (Systolic)</Label>
                <Input
                  id="systolic"
                  type="number"
                  placeholder="120"
                  value={formData.blood_pressure_systolic}
                  onChange={(e) => setFormData(prev => ({...prev, blood_pressure_systolic: e.target.value}))}
                />
              </div>
              <div>
                <Label htmlFor="diastolic">Blood Pressure (Diastolic)</Label>
                <Input
                  id="diastolic"
                  type="number"
                  placeholder="80"
                  value={formData.blood_pressure_diastolic}
                  onChange={(e) => setFormData(prev => ({...prev, blood_pressure_diastolic: e.target.value}))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="heart_rate">Heart Rate (bpm)</Label>
                <Input
                  id="heart_rate"
                  type="number"
                  placeholder="72"
                  value={formData.heart_rate}
                  onChange={(e) => setFormData(prev => ({...prev, heart_rate: e.target.value}))}
                />
              </div>
              <div>
                <Label htmlFor="temperature">Temperature (°F)</Label>
                <Input
                  id="temperature"
                  type="number"
                  step="0.1"
                  placeholder="98.6"
                  value={formData.temperature}
                  onChange={(e) => setFormData(prev => ({...prev, temperature: e.target.value}))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weight">Weight (lbs)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="150"
                  value={formData.weight}
                  onChange={(e) => setFormData(prev => ({...prev, weight: e.target.value}))}
                />
              </div>
              <div>
                <Label htmlFor="oxygen_saturation">Oxygen Saturation (%)</Label>
                <Input
                  id="oxygen_saturation"
                  type="number"
                  placeholder="98"
                  value={formData.oxygen_saturation}
                  onChange={(e) => setFormData(prev => ({...prev, oxygen_saturation: e.target.value}))}
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Recording..." : "Record Vitals"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Recent Vitals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Recent Vital Signs
          </CardTitle>
          <CardDescription>
            Your recorded vital signs history
          </CardDescription>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No vital signs recorded yet. Start tracking above.
            </p>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => {
                const vitals = entry.vitals as any; // Type assertion for vitals
                const bpStatus = getBloodPressureStatus(
                  vitals?.blood_pressure_systolic,
                  vitals?.blood_pressure_diastolic
                );
                
                return (
                  <div key={entry.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium">
                        {new Date(entry.visit_date).toLocaleDateString()}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {entry.visit_type}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      {vitals?.blood_pressure_systolic && vitals?.blood_pressure_diastolic && (
                        <div>
                          <div className="text-muted-foreground">Blood Pressure</div>
                          <div className="font-medium">
                            {vitals.blood_pressure_systolic}/{vitals.blood_pressure_diastolic}
                          </div>
                          <div className={`text-xs ${bpStatus.color}`}>
                            {bpStatus.status}
                          </div>
                        </div>
                      )}
                      
                      {vitals?.heart_rate && (
                        <div>
                          <div className="text-muted-foreground">Heart Rate</div>
                          <div className="font-medium">{vitals.heart_rate} bpm</div>
                        </div>
                      )}
                      
                      {vitals?.temperature && (
                        <div>
                          <div className="text-muted-foreground">Temperature</div>
                          <div className="font-medium">{vitals.temperature}°F</div>
                        </div>
                      )}
                      
                      {vitals?.weight && (
                        <div>
                          <div className="text-muted-foreground">Weight</div>
                          <div className="font-medium">{vitals.weight} lbs</div>
                        </div>
                      )}
                      
                      {vitals?.oxygen_saturation && (
                        <div>
                          <div className="text-muted-foreground">O2 Saturation</div>
                          <div className="font-medium">{vitals.oxygen_saturation}%</div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};