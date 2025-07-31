import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, Eye, FileText, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Patient {
  id: string;
  patient_number: string;
  user_id: string;
  medical_conditions: string[] | null;
  allergies: string[] | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  profiles?: {
    full_name: string | null;
    email: string;
    phone: string | null;
  };
}

export const PatientManagement = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    const filtered = patients.filter(patient => 
      patient.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.profiles?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patient_number.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(filtered);
  }, [patients, searchTerm]);

  const fetchPatients = async () => {
    try {
      // First get patients
      const { data: patients, error: patientsError } = await supabase
        .from('patients')
        .select('*');

      if (patientsError) throw patientsError;

      // Then get profiles for each patient
      const patientsWithProfiles = await Promise.all(
        (patients || []).map(async (patient) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, email, phone')
            .eq('user_id', patient.user_id)
            .single();

          return {
            ...patient,
            profiles: profile
          };
        })
      );
      
      setPatients(patientsWithProfiles as Patient[]);
      setFilteredPatients(patientsWithProfiles as Patient[]);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast({
        title: "Error",
        description: "Failed to load patients",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-muted-foreground">Loading patients...</div>
      </div>
    );
  }

  if (selectedPatient) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setSelectedPatient(null)}>
            ← Back to Patients
          </Button>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback>
                  {selectedPatient.profiles?.full_name?.split(' ').map(n => n[0]).join('') || 'P'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">
                  {selectedPatient.profiles?.full_name || 'Unknown Patient'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Patient #{selectedPatient.patient_number}
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Contact Information</h4>
                <p><strong>Email:</strong> {selectedPatient.profiles?.email}</p>
                <p><strong>Phone:</strong> {selectedPatient.profiles?.phone || 'Not provided'}</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Emergency Contact</h4>
                <p><strong>Name:</strong> {selectedPatient.emergency_contact_name || 'Not provided'}</p>
                <p><strong>Phone:</strong> {selectedPatient.emergency_contact_phone || 'Not provided'}</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Medical Conditions</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPatient.medical_conditions?.length ? 
                    selectedPatient.medical_conditions.map((condition, index) => (
                      <Badge key={index} variant="secondary">{condition}</Badge>
                    )) : 
                    <span className="text-muted-foreground">None recorded</span>
                  }
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Allergies</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPatient.allergies?.length ? 
                    selectedPatient.allergies.map((allergy, index) => (
                      <Badge key={index} variant="destructive">{allergy}</Badge>
                    )) : 
                    <span className="text-muted-foreground">None recorded</span>
                  }
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Patient Management</CardTitle>
          <CardDescription>View and manage your patients</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients by name, email, or patient number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
          
          <div className="space-y-4">
            {filteredPatients.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                {searchTerm ? 'No patients found matching your search.' : 'No patients found.'}
              </p>
            ) : (
              filteredPatients.map((patient) => (
                <Card key={patient.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>
                          {patient.profiles?.full_name?.split(' ').map(n => n[0]).join('') || 'P'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold">
                          {patient.profiles?.full_name || 'Unknown Patient'}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Patient #{patient.patient_number}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {patient.profiles?.email}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPatient(patient)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        Records
                      </Button>
                      <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        Schedule
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};