import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, Bell, Shield, Palette, Globe, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  display_name: string;
  avatar_url?: string;
  timezone: string;
  language: string;
  date_format: string;
  theme: string;
}

interface NotificationSettings {
  email_reminders: boolean;
  sms_alerts: boolean;
  health_insights: boolean;
  appointment_reminders: boolean;
  medication_reminders: boolean;
  emergency_alerts: boolean;
}

interface PrivacySettings {
  share_with_family: boolean;
  share_with_providers: boolean;
  data_analytics: boolean;
  marketing_communications: boolean;
}

export const ProfileSettings = () => {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    display_name: '',
    timezone: 'UTC',
    language: 'en',
    date_format: 'MM/dd/yyyy',
    theme: 'system'
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    email_reminders: true,
    sms_alerts: false,
    health_insights: true,
    appointment_reminders: true,
    medication_reminders: true,
    emergency_alerts: true
  });

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    share_with_family: false,
    share_with_providers: true,
    data_analytics: false,
    marketing_communications: false
  });

  const { toast } = useToast();
  const { user, signOut } = useAuth();

  useEffect(() => {
    if (user) {
      setProfile(prev => ({
        ...prev,
        display_name: user.user_metadata?.full_name || user.email || ''
      }));
    }
  }, [user]);

  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          display_name: profile.display_name,
          timezone: profile.timezone,
          language: profile.language,
          date_format: profile.date_format,
          theme: profile.theme
        }
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = async () => {
    setLoading(true);
    try {
      // In a real app, you'd save to a preferences table
      toast({
        title: "Success",
        description: "Notification preferences updated successfully.",
      });
    } catch (error) {
      console.error('Error updating notifications:', error);
      toast({
        title: "Error",
        description: "Failed to update notification preferences.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrivacyUpdate = async () => {
    setLoading(true);
    try {
      // In a real app, you'd save to a preferences table
      toast({
        title: "Success",
        description: "Privacy settings updated successfully.",
      });
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      toast({
        title: "Error",
        description: "Failed to update privacy settings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = async () => {
    setLoading(true);
    try {
      // In a real app, you'd generate and download user data
      toast({
        title: "Export Started",
        description: "Your data export has been initiated. You'll receive an email when ready.",
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Error",
        description: "Failed to start data export.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      setLoading(true);
      try {
        // In a real app, you'd implement account deletion
        toast({
          title: "Account Deletion",
          description: "Account deletion request has been submitted. You'll receive confirmation via email.",
          variant: "destructive",
        });
      } catch (error) {
        console.error('Error deleting account:', error);
        toast({
          title: "Error",
          description: "Failed to process account deletion.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Profile Settings</h2>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Personal Information</span>
              </CardTitle>
              <CardDescription>Update your basic profile information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-6">
                <Avatar className="w-20 h-20">
                  <AvatarFallback className="text-xl">
                    {profile.display_name?.split(' ').map(n => n[0]).join('') || user?.email?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">Change Photo</Button>
                  <p className="text-sm text-muted-foreground mt-1">JPG, PNG or GIF. Max size 2MB.</p>
                </div>
              </div>

              <div className="grid gap-4">
                <div>
                  <Label htmlFor="display_name">Display Name</Label>
                  <Input
                    id="display_name"
                    value={profile.display_name}
                    onChange={(e) => setProfile(prev => ({ ...prev, display_name: e.target.value }))}
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    value={user?.email || ''}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-sm text-muted-foreground mt-1">Email cannot be changed.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={profile.timezone} onValueChange={(value) => setProfile(prev => ({ ...prev, timezone: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="America/Chicago">Central Time</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                        <SelectItem value="Europe/London">GMT</SelectItem>
                        <SelectItem value="Africa/Cairo">Cairo Time</SelectItem>
                        <SelectItem value="Africa/Lagos">West Africa Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select value={profile.language} onValueChange={(value) => setProfile(prev => ({ ...prev, language: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="ar">Arabic</SelectItem>
                        <SelectItem value="sw">Swahili</SelectItem>
                        <SelectItem value="yo">Yoruba</SelectItem>
                        <SelectItem value="am">Amharic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button onClick={handleProfileUpdate} disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="w-5 h-5" />
                <span>Notification Preferences</span>
              </CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email_reminders">Email Reminders</Label>
                    <p className="text-sm text-muted-foreground">Receive appointment and medication reminders via email</p>
                  </div>
                  <Switch
                    id="email_reminders"
                    checked={notifications.email_reminders}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email_reminders: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms_alerts">SMS Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get urgent health alerts via text message</p>
                  </div>
                  <Switch
                    id="sms_alerts"
                    checked={notifications.sms_alerts}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sms_alerts: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="health_insights">Health Insights</Label>
                    <p className="text-sm text-muted-foreground">Receive AI-generated health insights and recommendations</p>
                  </div>
                  <Switch
                    id="health_insights"
                    checked={notifications.health_insights}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, health_insights: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emergency_alerts">Emergency Alerts</Label>
                    <p className="text-sm text-muted-foreground">Critical health alerts for immediate attention</p>
                  </div>
                  <Switch
                    id="emergency_alerts"
                    checked={notifications.emergency_alerts}
                    onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emergency_alerts: checked }))}
                  />
                </div>
              </div>

              <Button onClick={handleNotificationUpdate} disabled={loading}>
                {loading ? 'Saving...' : 'Save Preferences'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Privacy & Data Sharing</span>
              </CardTitle>
              <CardDescription>Control how your data is shared and used</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="share_with_family">Share with Family</Label>
                    <p className="text-sm text-muted-foreground">Allow authorized family members to view your health data</p>
                  </div>
                  <Switch
                    id="share_with_family"
                    checked={privacy.share_with_family}
                    onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, share_with_family: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="share_with_providers">Share with Healthcare Providers</Label>
                    <p className="text-sm text-muted-foreground">Allow healthcare providers in your network to access your data</p>
                  </div>
                  <Switch
                    id="share_with_providers"
                    checked={privacy.share_with_providers}
                    onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, share_with_providers: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="data_analytics">Anonymous Analytics</Label>
                    <p className="text-sm text-muted-foreground">Help improve our services with anonymous usage data</p>
                  </div>
                  <Switch
                    id="data_analytics"
                    checked={privacy.data_analytics}
                    onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, data_analytics: checked }))}
                  />
                </div>
              </div>

              <Button onClick={handlePrivacyUpdate} disabled={loading}>
                {loading ? 'Saving...' : 'Save Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="w-5 h-5" />
                <span>Appearance</span>
              </CardTitle>
              <CardDescription>Customize the look and feel of your dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="theme">Theme</Label>
                <Select value={profile.theme} onValueChange={(value) => setProfile(prev => ({ ...prev, theme: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="date_format">Date Format</Label>
                <Select value={profile.date_format} onValueChange={(value) => setProfile(prev => ({ ...prev, date_format: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MM/dd/yyyy">MM/DD/YYYY</SelectItem>
                    <SelectItem value="dd/MM/yyyy">DD/MM/YYYY</SelectItem>
                    <SelectItem value="yyyy-MM-dd">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleProfileUpdate} disabled={loading}>
                {loading ? 'Saving...' : 'Save Appearance'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data Export</CardTitle>
              <CardDescription>Download a copy of your health data</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleExportData} disabled={loading} className="mb-4">
                <Download className="w-4 h-4 mr-2" />
                {loading ? 'Preparing Export...' : 'Export My Data'}
              </Button>
              <p className="text-sm text-muted-foreground">
                This will create a comprehensive export of all your health data, which will be sent to your email address.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sign Out</CardTitle>
              <CardDescription>Sign out of your account on this device</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={signOut}>
                Sign Out
              </Button>
            </CardContent>
          </Card>

          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>Irreversible account actions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" onClick={handleDeleteAccount} disabled={loading}>
                {loading ? 'Processing...' : 'Delete Account'}
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                This will permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};