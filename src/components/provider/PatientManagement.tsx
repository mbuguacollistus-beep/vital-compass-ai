import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/ui/data-table';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Search, Eye, FileText, Calendar, Filter, Users, Phone, Mail, AlertTriangle, Activity } from 'lucide-react';
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
  current_medications: string[] | null;
  insurance_provider: string | null;
  insurance_policy_number: string | null;
  created_at: string;
  profiles?: {
    full_name: string | null;
    email: string;
    phone: string | null;
    date_of_birth: string | null;
    gender: string | null;
  };
}

type SortField = 'name' | 'patient_number' | 'created_at';
type SortOrder = 'asc' | 'desc';
type FilterType = 'all' | 'has_conditions' | 'has_allergies' | 'recent';

export const PatientManagement = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { toast } = useToast();

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    let filtered = patients.filter(patient => {
      const matchesSearch = 
        patient.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.profiles?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.patient_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.profiles?.phone?.includes(searchTerm);

      const matchesFilter = (() => {
        switch (filterType) {
          case 'has_conditions':
            return patient.medical_conditions && patient.medical_conditions.length > 0;
          case 'has_allergies':
            return patient.allergies && patient.allergies.length > 0;
          case 'recent':
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            return new Date(patient.created_at) > oneWeekAgo;
          default:
            return true;
        }
      })();

      return matchesSearch && matchesFilter;
    });

    // Sort patients
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case 'name':
          aValue = a.profiles?.full_name || '';
          bValue = b.profiles?.full_name || '';
          break;
        case 'patient_number':
          aValue = a.patient_number;
          bValue = b.patient_number;
          break;
        case 'created_at':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredPatients(filtered);
    setCurrentPage(1);
  }, [patients, searchTerm, sortField, sortOrder, filterType]);

  const fetchPatients = async () => {
    try {
      // First get patients
      const { data: patientsData, error: patientsError } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });

      if (patientsError) throw patientsError;

      // Then get profiles for each patient
      const patientsWithProfiles = await Promise.all(
        (patientsData || []).map(async (patient) => {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('full_name, email, phone, date_of_birth, gender')
            .eq('user_id', patient.user_id)
            .maybeSingle();

          if (profileError) {
            console.error('Error fetching profile for patient:', patient.id, profileError);
          }

          return {
            ...patient,
            profiles: profile || {
              full_name: null,
              email: '',
              phone: null,
              date_of_birth: null,
              gender: null
            }
          };
        })
      );
      
      setPatients(patientsWithProfiles);
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

  const getPatientAge = (dateOfBirth: string | null) => {
    if (!dateOfBirth) return 'Unknown';
    const today = new Date();
    const birth = new Date(dateOfBirth);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age.toString();
  };

  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <LoadingSpinner size="lg" />
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
        
        <div className="grid gap-6">
          {/* Patient Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">
                    {selectedPatient.profiles?.full_name?.split(' ').map(n => n[0]).join('') || 'P'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold">
                    {selectedPatient.profiles?.full_name || 'Unknown Patient'}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span>Patient #{selectedPatient.patient_number}</span>
                    <span>•</span>
                    <span>Age: {getPatientAge(selectedPatient.profiles?.date_of_birth)}</span>
                    <span>•</span>
                    <span>{selectedPatient.profiles?.gender || 'Not specified'}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Medical Records
                  </Button>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Patient Details Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="medical">Medical Info</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="insurance">Insurance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-sm font-medium">Medical Conditions</p>
                        <p className="text-2xl font-bold">{selectedPatient.medical_conditions?.length || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                      <div>
                        <p className="text-sm font-medium">Allergies</p>
                        <p className="text-2xl font-bold">{selectedPatient.allergies?.length || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium">Medications</p>
                        <p className="text-2xl font-bold">{selectedPatient.current_medications?.length || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="medical" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Medical Conditions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedPatient.medical_conditions?.length ? 
                        selectedPatient.medical_conditions.map((condition, index) => (
                          <Badge key={index} variant="secondary">{condition}</Badge>
                        )) : 
                        <span className="text-muted-foreground">None recorded</span>
                      }
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Allergies
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedPatient.allergies?.length ? 
                        selectedPatient.allergies.map((allergy, index) => (
                          <Badge key={index} variant="destructive">{allergy}</Badge>
                        )) : 
                        <span className="text-muted-foreground">None recorded</span>
                      }
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Current Medications
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {selectedPatient.current_medications?.length ? 
                        selectedPatient.current_medications.map((medication, index) => (
                          <Badge key={index} variant="outline">{medication}</Badge>
                        )) : 
                        <span className="text-muted-foreground">None recorded</span>
                      }
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="contact" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Patient Contact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedPatient.profiles?.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedPatient.profiles?.phone || 'Not provided'}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Emergency Contact
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="font-medium">{selectedPatient.emergency_contact_name || 'Not provided'}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedPatient.emergency_contact_phone || 'Not provided'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="insurance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Insurance Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Provider</label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedPatient.insurance_provider || 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Policy Number</label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedPatient.insurance_policy_number || 'Not provided'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Total Patients</p>
                <p className="text-2xl font-bold">{patients.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">With Conditions</p>
                <p className="text-2xl font-bold">
                  {patients.filter(p => p.medical_conditions && p.medical_conditions.length > 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium">With Allergies</p>
                <p className="text-2xl font-bold">
                  {patients.filter(p => p.allergies && p.allergies.length > 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium">New This Week</p>
                <p className="text-2xl font-bold">
                  {patients.filter(p => {
                    const oneWeekAgo = new Date();
                    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
                    return new Date(p.created_at) > oneWeekAgo;
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Patient Management
          </CardTitle>
          <CardDescription>
            View and manage all patients. Search, filter, and access detailed patient information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, phone, or patient number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={(value: FilterType) => setFilterType(value)}>
                <SelectTrigger className="w-[160px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Patients</SelectItem>
                  <SelectItem value="has_conditions">With Conditions</SelectItem>
                  <SelectItem value="has_allergies">With Allergies</SelectItem>
                  <SelectItem value="recent">New This Week</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortField} onValueChange={(value: SortField) => setSortField(value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Sort by Name</SelectItem>
                  <SelectItem value="patient_number">Patient Number</SelectItem>
                  <SelectItem value="created_at">Date Added</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </Button>
            </div>
          </div>

          {/* Results summary */}
          {searchTerm || filterType !== 'all' ? (
            <div className="mb-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm">
                Showing {filteredPatients.length} of {patients.length} patients
                {searchTerm && ` matching "${searchTerm}"`}
                {filterType !== 'all' && ` with filter: ${filterType.replace('_', ' ')}`}
              </p>
            </div>
          ) : null}
          
          {/* Patient list */}
          <div className="space-y-4">
            {filteredPatients.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium">No patients found</p>
                <p className="text-muted-foreground">
                  {searchTerm || filterType !== 'all' 
                    ? 'Try adjusting your search or filters' 
                    : 'No patients have been added yet'}
                </p>
              </div>
            ) : (
              <>
                {paginatedPatients.map((patient) => (
                  <Card key={patient.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="font-medium">
                              {patient.profiles?.full_name?.split(' ').map(n => n[0]).join('') || 'P'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-lg">
                                {patient.profiles?.full_name || 'Unknown Patient'}
                              </h4>
                              {patient.medical_conditions && patient.medical_conditions.length > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                  {patient.medical_conditions.length} condition{patient.medical_conditions.length !== 1 ? 's' : ''}
                                </Badge>
                              )}
                              {patient.allergies && patient.allergies.length > 0 && (
                                <Badge variant="destructive" className="text-xs">
                                  {patient.allergies.length} allerg{patient.allergies.length !== 1 ? 'ies' : 'y'}
                                </Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 mt-1 text-sm text-muted-foreground">
                              <span>Patient #{patient.patient_number}</span>
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {patient.profiles?.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {patient.profiles?.phone || 'No phone'}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Age: {getPatientAge(patient.profiles?.date_of_birth)} • 
                              Added: {new Date(patient.created_at).toLocaleDateString()}
                            </div>
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
                    </CardContent>
                  </Card>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4">
                    <p className="text-sm text-muted-foreground">
                      Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredPatients.length)} of {filteredPatients.length} patients
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      <span className="flex items-center px-3 text-sm">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};