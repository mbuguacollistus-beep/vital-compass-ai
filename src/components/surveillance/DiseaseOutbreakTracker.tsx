import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertTriangle, Download, MapPin, TrendingUp, Users, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SurveillanceData {
  id: string;
  reported_symptoms: string[];
  severity_level: number;
  location_data: any;
  disease_suspected: string;
  confirmed_diagnosis: string;
  outbreak_alert_level: number;
  reported_at: string;
  status: string;
  patient_id: string;
}

interface OutbreakStats {
  total_reports: number;
  high_severity: number;
  suspected_diseases: { [key: string]: number };
  locations: { [key: string]: number };
  recent_trend: 'increasing' | 'stable' | 'decreasing';
}

export const DiseaseOutbreakTracker = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [surveillanceData, setSurveillanceData] = useState<SurveillanceData[]>([]);
  const [stats, setStats] = useState<OutbreakStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [exportLoading, setExportLoading] = useState(false);
  const [exportDialog, setExportDialog] = useState(false);
  const [isNixOwner, setIsNixOwner] = useState(false);
  const [exportForm, setExportForm] = useState({
    type: '',
    organization: '',
    startDate: '',
    endDate: '',
    reason: ''
  });

  // Check if user is Nix owner
  useEffect(() => {
    const checkNixOwner = async () => {
      if (!user?.email) return;
      
      // Check if user email is from @nixhealth.com domain
      const isOwner = user.email.endsWith('@nixhealth.com');
      setIsNixOwner(isOwner);
      
      if (isOwner) {
        fetchSurveillanceData();
      } else {
        setLoading(false);
      }
    };

    checkNixOwner();
  }, [user]);

  if (!isNixOwner && !loading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-destructive">Access Denied</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This surveillance data is only accessible to Nix Health authorized personnel (@nixhealth.com emails).</p>
        </CardContent>
      </Card>
    );
  }

  const fetchSurveillanceData = async () => {
    try {
      const { data, error } = await supabase
        .from('disease_surveillance')
        .select('*')
        .order('reported_at', { ascending: false });

      if (error) throw error;

      setSurveillanceData(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Error fetching surveillance data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch surveillance data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: SurveillanceData[]) => {
    const total_reports = data.length;
    const high_severity = data.filter(d => d.severity_level >= 4).length;
    
    const suspected_diseases: { [key: string]: number } = {};
    const locations: { [key: string]: number } = {};
    
    data.forEach(item => {
      if (item.disease_suspected) {
        suspected_diseases[item.disease_suspected] = (suspected_diseases[item.disease_suspected] || 0) + 1;
      }
      
      if (item.location_data?.region) {
        locations[item.location_data.region] = (locations[item.location_data.region] || 0) + 1;
      }
    });

    // Simple trend calculation (last 7 days vs previous 7 days)
    const now = new Date();
    const last7Days = data.filter(d => 
      new Date(d.reported_at) > new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    ).length;
    const prev7Days = data.filter(d => {
      const reportDate = new Date(d.reported_at);
      return reportDate > new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000) &&
             reportDate <= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }).length;

    const recent_trend = last7Days > prev7Days ? 'increasing' : 
                        last7Days < prev7Days ? 'decreasing' : 'stable';

    setStats({
      total_reports,
      high_severity,
      suspected_diseases,
      locations,
      recent_trend
    });
  };

  const handleExportData = async () => {
    setExportLoading(true);
    try {
      // Filter data by date range
      const filteredData = surveillanceData.filter(item => {
        const reportDate = new Date(item.reported_at);
        const start = new Date(exportForm.startDate);
        const end = new Date(exportForm.endDate);
        return reportDate >= start && reportDate <= end;
      });

      // Log the export
      await supabase.from('data_exports').insert({
        exported_by: user!.id,
        export_type: exportForm.type,
        recipient_organization: exportForm.organization,
        data_period_start: exportForm.startDate,
        data_period_end: exportForm.endDate,
        records_count: filteredData.length,
        export_reason: exportForm.reason
      });

      // Create and download CSV
      const csvContent = [
        ['Date Reported', 'Symptoms', 'Severity', 'Suspected Disease', 'Location', 'Status'].join(','),
        ...filteredData.map(item => [
          new Date(item.reported_at).toISOString().split('T')[0],
          `"${item.reported_symptoms.join('; ')}"`,
          item.severity_level,
          item.disease_suspected || 'Unknown',
          item.location_data?.region || 'Unknown',
          item.status
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `surveillance_data_${exportForm.startDate}_${exportForm.endDate}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: `${filteredData.length} records exported to ${exportForm.organization}`,
      });

      setExportDialog(false);
      setExportForm({ type: '', organization: '', startDate: '', endDate: '', reason: '' });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export surveillance data",
        variant: "destructive"
      });
    } finally {
      setExportLoading(false);
    }
  };

  const getSeverityBadge = (level: number) => {
    if (level >= 4) return <Badge variant="destructive">High</Badge>;
    if (level >= 3) return <Badge variant="secondary">Medium</Badge>;
    return <Badge variant="outline">Low</Badge>;
  };

  const getAlertBadge = (level: number) => {
    if (level >= 3) return <Badge variant="destructive">Critical Alert</Badge>;
    if (level >= 2) return <Badge variant="secondary">Warning</Badge>;
    if (level >= 1) return <Badge variant="outline">Watch</Badge>;
    return null;
  };

  if (loading) {
    return <div className="text-center p-8">Loading surveillance data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Disease Outbreak Surveillance</h2>
          <p className="text-muted-foreground">NIX Health - Authorized Personnel Only</p>
        </div>
        <Dialog open={exportDialog} onOpenChange={setExportDialog}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Export Surveillance Data</DialogTitle>
              <DialogDescription>
                Export data for sharing with government agencies and NGOs
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">Type</Label>
                <Select value={exportForm.type} onValueChange={(value) => setExportForm({...exportForm, type: value})}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select recipient type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="government">Government Agency</SelectItem>
                    <SelectItem value="ngo">NGO</SelectItem>
                    <SelectItem value="research">Research Institution</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="organization" className="text-right">Organization</Label>
                <Input
                  id="organization"
                  value={exportForm.organization}
                  onChange={(e) => setExportForm({...exportForm, organization: e.target.value})}
                  className="col-span-3"
                  placeholder="Organization name"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDate" className="text-right">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={exportForm.startDate}
                  onChange={(e) => setExportForm({...exportForm, startDate: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endDate" className="text-right">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={exportForm.endDate}
                  onChange={(e) => setExportForm({...exportForm, endDate: e.target.value})}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reason" className="text-right">Reason</Label>
                <Input
                  id="reason"
                  value={exportForm.reason}
                  onChange={(e) => setExportForm({...exportForm, reason: e.target.value})}
                  className="col-span-3"
                  placeholder="Export reason"
                />
              </div>
            </div>
            <Button 
              onClick={handleExportData} 
              disabled={!exportForm.type || !exportForm.organization || !exportForm.startDate || !exportForm.endDate || exportLoading}
            >
              {exportLoading ? 'Exporting...' : 'Export Data'}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_reports}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">High Severity</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{stats.high_severity}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Trend (7 days)</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold capitalize ${
                stats.recent_trend === 'increasing' ? 'text-destructive' :
                stats.recent_trend === 'decreasing' ? 'text-green-600' : ''
              }`}>
                {stats.recent_trend}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Top Disease</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold">
                {Object.entries(stats.suspected_diseases).sort(([,a], [,b]) => b - a)[0]?.[0] || 'None'}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="reports" className="space-y-4">
        <TabsList>
          <TabsTrigger value="reports">Active Reports</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="reports" className="space-y-4">
          {surveillanceData.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No surveillance data available</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {surveillanceData.slice(0, 50).map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          {item.disease_suspected || 'Unknown Disease'}
                        </CardTitle>
                        <CardDescription>
                          Reported: {new Date(item.reported_at).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {getSeverityBadge(item.severity_level)}
                        {getAlertBadge(item.outbreak_alert_level)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div>
                        <span className="font-medium">Symptoms: </span>
                        {item.reported_symptoms.join(', ')}
                      </div>
                      {item.location_data?.region && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{item.location_data.region}</span>
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Status: </span>
                        <Badge variant={item.status === 'verified' ? 'default' : 'secondary'}>
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          {stats && (
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Disease Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(stats.suspected_diseases)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 5)
                      .map(([disease, count]) => (
                        <div key={disease} className="flex justify-between">
                          <span>{disease}</span>
                          <Badge>{count}</Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Regional Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(stats.locations)
                      .sort(([,a], [,b]) => b - a)
                      .slice(0, 5)
                      .map(([location, count]) => (
                        <div key={location} className="flex justify-between">
                          <span>{location}</span>
                          <Badge>{count}</Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {stats?.recent_trend === 'increasing' && stats?.high_severity > 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Alert:</strong> Increasing trend detected with {stats.high_severity} high-severity cases. 
                Consider immediate investigation and potential outbreak protocols.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};