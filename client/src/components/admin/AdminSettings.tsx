import { useState } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings, 
  User, 
  Shield, 
  Database,
  Mail,
  Globe,
  Palette,
  Bell,
  Lock,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';

export function AdminSettings() {
  const { admin, token } = useAdminAuth();
  const { toast } = useToast();
  
  const [profileData, setProfileData] = useState({
    firstName: admin?.firstName || '',
    lastName: admin?.lastName || '',
    email: admin?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [systemSettings, setSystemSettings] = useState({
    siteName: 'Tutsin Digital',
    siteDescription: 'Professional web design and digital marketing services',
    maintenanceMode: false,
    allowRegistration: true,
    emailNotifications: true,
    analyticsEnabled: true
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (profileData.newPassword && profileData.newPassword !== profileData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    // Here you would make an API call to update the profile
    toast({
      title: "Success",
      description: "Profile updated successfully",
    });
  };

  const handleSystemSettingsUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would make an API call to update system settings
    toast({
      title: "Success",
      description: "System settings updated successfully",
    });
  };

  const handleBackupDatabase = () => {
    toast({
      title: "Backup Started",
      description: "Database backup has been initiated",
    });
  };

  const handleClearCache = () => {
    toast({
      title: "Cache Cleared",
      description: "System cache has been cleared successfully",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage system configuration and preferences
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          Admin Level: {admin?.role?.replace('_', ' ').toUpperCase()}
        </Badge>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile Information</span>
              </CardTitle>
              <CardDescription>
                Update your personal information and account settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  />
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-4">Change Password</h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={profileData.currentPassword}
                        onChange={(e) => setProfileData({...profileData, currentPassword: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={profileData.newPassword}
                          onChange={(e) => setProfileData({...profileData, newPassword: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={profileData.confirmPassword}
                          onChange={(e) => setProfileData({...profileData, confirmPassword: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button type="submit" className="gradient-bg text-white">
                  Update Profile
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>Website Settings</span>
              </CardTitle>
              <CardDescription>
                Configure general website settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSystemSettingsUpdate} className="space-y-4">
                <div>
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={systemSettings.siteName}
                    onChange={(e) => setSystemSettings({...systemSettings, siteName: e.target.value})}
                  />
                </div>
                
                <div>
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Textarea
                    id="siteDescription"
                    rows={3}
                    value={systemSettings.siteDescription}
                    onChange={(e) => setSystemSettings({...systemSettings, siteDescription: e.target.value})}
                  />
                </div>
                
                <div className="space-y-4 border-t pt-4">
                  <h4 className="font-medium">System Preferences</h4>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable maintenance mode to prevent public access
                      </p>
                    </div>
                    <Switch
                      id="maintenanceMode"
                      checked={systemSettings.maintenanceMode}
                      onCheckedChange={(checked) => setSystemSettings({...systemSettings, maintenanceMode: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="allowRegistration">Allow User Registration</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow new users to register accounts
                      </p>
                    </div>
                    <Switch
                      id="allowRegistration"
                      checked={systemSettings.allowRegistration}
                      onCheckedChange={(checked) => setSystemSettings({...systemSettings, allowRegistration: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Send email notifications for important events
                      </p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={systemSettings.emailNotifications}
                      onCheckedChange={(checked) => setSystemSettings({...systemSettings, emailNotifications: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="analyticsEnabled">Analytics Tracking</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable website analytics and tracking
                      </p>
                    </div>
                    <Switch
                      id="analyticsEnabled"
                      checked={systemSettings.analyticsEnabled}
                      onCheckedChange={(checked) => setSystemSettings({...systemSettings, analyticsEnabled: checked})}
                    />
                  </div>
                </div>
                
                <Button type="submit" className="gradient-bg text-white">
                  Save Settings
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security Settings</span>
              </CardTitle>
              <CardDescription>
                Manage security policies and access controls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Session Security</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Session Timeout</span>
                        <Badge variant="outline">8 hours</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Two-Factor Auth</span>
                        <Badge variant="secondary">Disabled</Badge>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        Configure Security
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Access Control</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">IP Restrictions</span>
                        <Badge variant="secondary">None</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Login Attempts</span>
                        <Badge variant="outline">5 max</Badge>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        Manage Access
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-4">Security Logs</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                      <span>Last login: {admin?.lastLoginAt ? new Date(admin.lastLoginAt).toLocaleString() : 'Never'}</span>
                      <Badge variant="outline">Success</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                      <span>Password changed: Never</span>
                      <Badge variant="secondary">N/A</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Maintenance */}
        <TabsContent value="maintenance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>System Maintenance</span>
              </CardTitle>
              <CardDescription>
                Database management and system maintenance tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <Download className="h-4 w-4" />
                        <span>Database Backup</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Create a backup of the entire database
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Last backup</span>
                        <Badge variant="outline">Never</Badge>
                      </div>
                      <Button onClick={handleBackupDatabase} variant="outline" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Create Backup
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <RefreshCw className="h-4 w-4" />
                        <span>Cache Management</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Clear system cache to improve performance
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Cache size</span>
                        <Badge variant="outline">~2.4 MB</Badge>
                      </div>
                      <Button onClick={handleClearCache} variant="outline" className="w-full">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Clear Cache
                      </Button>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">System Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Version</span>
                          <span className="text-sm text-muted-foreground">1.0.0</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Environment</span>
                          <span className="text-sm text-muted-foreground">Production</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Database</span>
                          <span className="text-sm text-muted-foreground">PostgreSQL</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Uptime</span>
                          <span className="text-sm text-muted-foreground">7 days, 3 hours</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Memory Usage</span>
                          <span className="text-sm text-muted-foreground">245 MB</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Storage</span>
                          <span className="text-sm text-muted-foreground">1.2 GB used</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

