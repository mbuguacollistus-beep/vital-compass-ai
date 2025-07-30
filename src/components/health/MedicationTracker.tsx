import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Pill, Clock, Calendar, CheckCircle, AlertCircle } from "lucide-react";

interface MedicationReminder {
  id: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  time_of_day: string[];
  taken_today: boolean;
  last_taken: string | null;
}

export const MedicationTracker = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [medications, setMedications] = useState<MedicationReminder[]>([]);
  const [patientProfile, setPatientProfile] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    medication_name: "",
    dosage: "",
    frequency: "daily",
    time_of_day: [] as string[],
  });

  useEffect(() => {
    fetchPatientProfile();
  }, []);

  const fetchPatientProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: patient } = await supabase
          .from('patients')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (patient) {
          setPatientProfile(patient);
          loadMedicationsFromProfile(patient);
        }
      }
    } catch (error) {
      console.error('Error fetching patient profile:', error);
    }
  };

  const loadMedicationsFromProfile = (patient: any) => {
    if (patient.current_medications && Array.isArray(patient.current_medications)) {
      const medicationList = patient.current_medications.map((med: string, index: number) => ({
        id: `med-${index}`,
        medication_name: med,
        dosage: "As prescribed",
        frequency: "daily",
        time_of_day: ["morning"],
        taken_today: false,
        last_taken: null,
      }));
      setMedications(medicationList);
    }
  };

  const handleAddMedication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientProfile) return;

    setLoading(true);
    try {
      const newMedication = {
        id: `med-${Date.now()}`,
        ...formData,
        taken_today: false,
        last_taken: null,
      };

      const updatedMedications = [...medications, newMedication];
      const medicationNames = updatedMedications.map(med => med.medication_name);

      // Update the patient's current_medications in the database
      const { error } = await supabase
        .from('patients')
        .update({ current_medications: medicationNames })
        .eq('id', patientProfile.id);

      if (error) throw error;

      setMedications(updatedMedications);
      setFormData({
        medication_name: "",
        dosage: "",
        frequency: "daily",
        time_of_day: [],
      });
      setShowAddForm(false);

      toast({
        title: "Medication added!",
        description: "Your medication has been added to your tracker.",
      });
    } catch (error) {
      console.error('Error adding medication:', error);
      toast({
        title: "Error",
        description: "Failed to add medication. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsTaken = (medicationId: string) => {
    setMedications(prev => prev.map(med => 
      med.id === medicationId 
        ? { ...med, taken_today: true, last_taken: new Date().toISOString() }
        : med
    ));

    toast({
      title: "Medication taken!",
      description: "Great job staying on track with your medication.",
    });
  };

  const handleTimeChange = (time: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      time_of_day: checked 
        ? [...prev.time_of_day, time]
        : prev.time_of_day.filter(t => t !== time)
    }));
  };

  const getTodaysStatus = () => {
    const taken = medications.filter(med => med.taken_today).length;
    const total = medications.length;
    return { taken, total };
  };

  const status = getTodaysStatus();

  return (
    <div className="space-y-6">
      {/* Medication Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="w-5 h-5" />
            Medication Tracker
          </CardTitle>
          <CardDescription>
            Keep track of your daily medications and stay on schedule
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {status.taken}/{status.total}
                </div>
                <div className="text-sm text-muted-foreground">Today</div>
              </div>
              <div className="flex items-center gap-2">
                {status.taken === status.total && status.total > 0 ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                )}
                <span className="text-sm">
                  {status.taken === status.total && status.total > 0
                    ? "All medications taken today!"
                    : `${status.total - status.taken} medications remaining`
                  }
                </span>
              </div>
            </div>
            <Button onClick={() => setShowAddForm(!showAddForm)}>
              Add Medication
            </Button>
          </div>

          {/* Add Medication Form */}
          {showAddForm && (
            <Card className="mb-4">
              <CardContent className="pt-6">
                <form onSubmit={handleAddMedication} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="medication_name">Medication Name</Label>
                      <Input
                        id="medication_name"
                        value={formData.medication_name}
                        onChange={(e) => setFormData(prev => ({...prev, medication_name: e.target.value}))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="dosage">Dosage</Label>
                      <Input
                        id="dosage"
                        placeholder="e.g., 50mg, 1 tablet"
                        value={formData.dosage}
                        onChange={(e) => setFormData(prev => ({...prev, dosage: e.target.value}))}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Frequency</Label>
                    <Select value={formData.frequency} onValueChange={(value) => setFormData(prev => ({...prev, frequency: value}))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="twice_daily">Twice Daily</SelectItem>
                        <SelectItem value="three_times_daily">Three Times Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="as_needed">As Needed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Time of Day</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                      {['morning', 'afternoon', 'evening', 'bedtime'].map((time) => (
                        <div key={time} className="flex items-center space-x-2">
                          <Checkbox
                            id={time}
                            checked={formData.time_of_day.includes(time)}
                            onCheckedChange={(checked) => handleTimeChange(time, checked as boolean)}
                          />
                          <Label htmlFor={time} className="text-sm capitalize">{time}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={loading}>
                      {loading ? "Adding..." : "Add Medication"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Medication List */}
          {medications.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No medications added yet. Add your medications to start tracking.
            </p>
          ) : (
            <div className="space-y-3">
              {medications.map((med) => (
                <div key={med.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${med.taken_today ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <div>
                      <div className="font-medium">{med.medication_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {med.dosage} • {med.frequency.replace('_', ' ')} • {med.time_of_day.join(', ')}
                      </div>
                      {med.last_taken && (
                        <div className="text-xs text-green-600">
                          Last taken: {new Date(med.last_taken).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {!med.taken_today && (
                    <Button 
                      size="sm" 
                      onClick={() => markAsTaken(med.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Mark as Taken
                    </Button>
                  )}
                  
                  {med.taken_today && (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Taken</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};