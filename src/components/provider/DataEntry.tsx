import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Save, Search, FileText, Activity } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Patient {
  id: string;
  patient_number: string;
  profiles: {
    full_name: string | null;
    email: string;
  };
}

export const DataEntry = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [patientSearch, setPatientSearch] = useState('');
  const [visitDate, setVisitDate] = useState<Date>(new Date());
  const [visitData, setVisitData] = useState({
    visit_type: '',
    reason_code: '',
    diagnosis: '',
    treatment_notes: '',
    blood_pressure_systolic: '',
    blood_pressure_diastolic: '',
    heart_rate: '',
    temperature: '',
    weight: '',
    height: '',
    oxygen_saturation: ''
  });
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (patientSearch.length > 2) {
      searchPatients();
    } else {
      setSearchResults([]);
    }
  }, [patientSearch]);

  const searchPatients = async () => {
    try {
      const { data: patients, error } = await supabase
        .from('patients')
        .select('id, patient_number, user_id')
        .or(`patient_number.ilike.%${patientSearch}%`)
        .limit(10);

      if (error) throw error;

      // Get profiles for matched patients
      const patientsWithProfiles = await Promise.all(
        (patients || []).map(async (patient) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, email')
            .eq('user_id', patient.user_id)
            .maybeSingle();

          return {
            id: patient.id,
            patient_number: patient.patient_number,
            profiles: profile
          };
        })
      );

      // Also search by profile name/email
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('user_id, full_name, email')
        .or(`full_name.ilike.%${patientSearch}%,email.ilike.%${patientSearch}%`)
        .limit(10);

      if (!profilesError && profiles) {
        const profilePatients = await Promise.all(
          profiles.map(async (profile) => {
            const { data: patient } = await supabase
              .from('patients')
              .select('id, patient_number')
              .eq('user_id', profile.user_id)
              .maybeSingle();

            return patient ? {
              id: patient.id,
              patient_number: patient.patient_number,
              profiles: {
                full_name: profile.full_name,
                email: profile.email
              }
            } : null;
          })
        );

        // Combine and deduplicate results
        const allResults = [...patientsWithProfiles, ...profilePatients.filter(p => p !== null)];
        const uniqueResults = allResults.filter((item, index, array) => 
          array.findIndex(i => i?.id === item?.id) === index
        );

        setSearchResults(uniqueResults.slice(0, 10) as Patient[]);
      } else {
        setSearchResults(patientsWithProfiles as Patient[]);
      }
    } catch (error) {
      console.error('Error searching patients:', error);
    }
  };

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setPatientSearch(patient.profiles?.full_name || patient.profiles?.email || '');
    setSearchResults([]);
  };

  const resetForm = () => {
    setVisitData({
      visit_type: '',
      reason_code: '',
      diagnosis: '',
      treatment_notes: '',
      blood_pressure_systolic: '',
      blood_pressure_diastolic: '',
      heart_rate: '',
      temperature: '',
      weight: '',
      height: '',
      oxygen_saturation: ''
    });
    setSelectedPatient(null);
    setPatientSearch('');
    setVisitDate(new Date());
  };

  const handleSaveVisit = async () => {
    if (!selectedPatient) {
      toast({
        title: "Error",
        description: "Please select a patient",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Prepare vitals data
      const vitals: any = {};
      if (visitData.blood_pressure_systolic && visitData.blood_pressure_diastolic) {
        vitals.blood_pressure = `${visitData.blood_pressure_systolic}/${visitData.blood_pressure_diastolic}`;
      }
      if (visitData.heart_rate) vitals.heart_rate = parseInt(visitData.heart_rate);
      if (visitData.temperature) vitals.temperature = parseFloat(visitData.temperature);
      if (visitData.weight) vitals.weight = parseFloat(visitData.weight);
      if (visitData.height) vitals.height = parseFloat(visitData.height);
      if (visitData.oxygen_saturation) vitals.oxygen_saturation = parseInt(visitData.oxygen_saturation);

      const { error } = await supabase
        .from('medical_visits')
        .insert({
          patient_id: selectedPatient.id,
          visit_date: format(visitDate, 'yyyy-MM-dd'),
          visit_type: visitData.visit_type,
          reason_code: visitData.reason_code || null,
          diagnosis: visitData.diagnosis || null,
          treatment_notes: visitData.treatment_notes || null,
          vitals: Object.keys(vitals).length > 0 ? vitals : null
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Visit data saved successfully",
      });

      resetForm();
    } catch (error) {
      console.error('Error saving visit:', error);
      toast({
        title: "Error",
        description: "Failed to save visit data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Medical Data Entry</h2>
        <p className="text-muted-foreground">Enter patient visit data and vitals</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Patient Selection
          </CardTitle>
          <CardDescription>Search and select a patient to enter data for</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Input
              placeholder="Search by patient name, email, or patient number..."
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
            />
            
            {searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-48 overflow-y-auto">
                {searchResults.map((patient) => (
                  <div
                    key={patient.id}
                    className="p-2 hover:bg-muted cursor-pointer"
                    onClick={() => handlePatientSelect(patient)}
                  >
                    <div className="font-medium">
                      {patient.profiles?.full_name || 'Unknown Name'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {patient.profiles?.email} • #{patient.patient_number}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {selectedPatient && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">
                    {selectedPatient.profiles?.full_name || 'Unknown Name'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedPatient.profiles?.email} • #{selectedPatient.patient_number}
                  </p>
                </div>
                <Badge variant="secondary">Selected</Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedPatient && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Visit Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="visit-details" className="space-y-6">
              <TabsList>
                <TabsTrigger value="visit-details">Visit Details</TabsTrigger>
                <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
              </TabsList>

              <TabsContent value="visit-details" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="visit-date">Visit Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {format(visitDate, 'PPP')}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={visitDate}
                          onSelect={(date) => date && setVisitDate(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="visit-type">Visit Type</Label>
                    <Select value={visitData.visit_type} onValueChange={(value) => setVisitData({...visitData, visit_type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select visit type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="routine">Routine Checkup</SelectItem>
                        <SelectItem value="follow-up">Follow-up</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                        <SelectItem value="consultation">Consultation</SelectItem>
                        <SelectItem value="procedure">Procedure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason for Visit</Label>
                    <Input
                      id="reason"
                      placeholder="Chief complaint or reason"
                      value={visitData.reason_code}
                      onChange={(e) => setVisitData({...visitData, reason_code: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="diagnosis">Diagnosis</Label>
                    <Input
                      id="diagnosis"
                      placeholder="Primary diagnosis"
                      value={visitData.diagnosis}
                      onChange={(e) => setVisitData({...visitData, diagnosis: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="treatment-notes">Treatment Notes</Label>
                  <Textarea
                    id="treatment-notes"
                    placeholder="Treatment plan, medications, recommendations..."
                    rows={4}
                    value={visitData.treatment_notes}
                    onChange={(e) => setVisitData({...visitData, treatment_notes: e.target.value})}
                  />
                </div>
              </TabsContent>

              <TabsContent value="vitals" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Blood Pressure (mmHg)</Label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Systolic"
                        value={visitData.blood_pressure_systolic}
                        onChange={(e) => setVisitData({...visitData, blood_pressure_systolic: e.target.value})}
                      />
                      <span className="flex items-center">/</span>
                      <Input
                        placeholder="Diastolic"
                        value={visitData.blood_pressure_diastolic}
                        onChange={(e) => setVisitData({...visitData, blood_pressure_diastolic: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="heart-rate">Heart Rate (bpm)</Label>
                    <Input
                      id="heart-rate"
                      type="number"
                      placeholder="80"
                      value={visitData.heart_rate}
                      onChange={(e) => setVisitData({...visitData, heart_rate: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature (°F)</Label>
                    <Input
                      id="temperature"
                      type="number"
                      step="0.1"
                      placeholder="98.6"
                      value={visitData.temperature}
                      onChange={(e) => setVisitData({...visitData, temperature: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (lbs)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      placeholder="150"
                      value={visitData.weight}
                      onChange={(e) => setVisitData({...visitData, weight: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="height">Height (inches)</Label>
                    <Input
                      id="height"
                      type="number"
                      step="0.1"
                      placeholder="68"
                      value={visitData.height}
                      onChange={(e) => setVisitData({...visitData, height: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="oxygen">Oxygen Saturation (%)</Label>
                    <Input
                      id="oxygen"
                      type="number"
                      placeholder="98"
                      value={visitData.oxygen_saturation}
                      onChange={(e) => setVisitData({...visitData, oxygen_saturation: e.target.value})}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2 pt-6 border-t">
              <Button variant="outline" onClick={resetForm}>
                Clear Form
              </Button>
              <Button onClick={handleSaveVisit} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Visit Data'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};