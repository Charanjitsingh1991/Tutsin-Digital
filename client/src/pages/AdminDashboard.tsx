import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { apiRequest } from '@/lib/queryClient';
import { 
  Users, 
  FileText, 
  FolderOpen, 
  BarChart3, 
  Settings, 
  Shield,
  Bell,
  Upload,
  LogOut,
  UserPlus,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { AdminStats } from '@/components/admin/AdminStats';
import { AdminUserManagement } from '@/components/admin/AdminUserManagement';
import { AdminRoleManagement } from '@/components/admin/AdminRoleManagement';
import { AdminContentManagement } from '@/components/admin/AdminContentManagement';
import { AdminProjectManagement } from '@/components/admin/AdminProjectManagement';
import { AdminAnalytics } from '@/components/admin/AdminAnalytics';
import { AdminSettings } from '@/components/admin/AdminSettings';

export default function AdminDashboard() {
  const { admin, logout, isAuthenticated, isLoading, hasPermission } = useAdminAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, permission: null },
    { id: 'users', label: 'User Management', icon: Users, permission: 'manage_admins' },
    { id: 'roles', label: 'Role Management', icon: Shield, permission: 'manage_roles' },
    { id: 'content', label: 'Content Management', icon: FileText, permission: 'manage_content' },
    { id: 'projects', label: 'Project Management', icon: FolderOpen, permission: 'manage_projects' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, permission: 'view_analytics' },
    { id: 'settings', label: 'Settings', icon: Settings, permission: 'system_settings' },
  ];

  const availableItems = navigationItems.filter(item => 
    !item.permission || hasPermission(item.permission)
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center px-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gradient">Admin Dashboard</h1>
            <Badge variant="secondary" className="text-xs">
              {admin?.role?.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>
          
          <div className="ml-auto flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Welcome, {admin?.firstName} {admin?.lastName}</span>
            </div>
            
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-card min-h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-2">
            {availableItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab(item.id)}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === 'dashboard' && <AdminStats />}
          {activeTab === 'users' && hasPermission('manage_admins') && <AdminUserManagement />}
          {activeTab === 'roles' && hasPermission('manage_roles') && <AdminRoleManagement />}
          {activeTab === 'content' && hasPermission('manage_content') && <AdminContentManagement />}
          {activeTab === 'projects' && hasPermission('manage_projects') && <AdminProjectManagement />}
          {activeTab === 'analytics' && hasPermission('view_analytics') && <AdminAnalytics />}
          {activeTab === 'settings' && hasPermission('system_settings') && <AdminSettings />}
        </main>
      </div>
    </div>
  );
}

