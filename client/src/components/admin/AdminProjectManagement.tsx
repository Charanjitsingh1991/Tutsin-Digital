import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiRequest } from '@/lib/queryClient';
import { 
  FolderOpen, 
  Calendar, 
  DollarSign, 
  User, 
  Clock,
  CheckCircle,
  AlertCircle,
  Pause,
  X,
  TrendingUp,
  Users
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  description: string;
  clientId: string;
  status: string;
  priority: string;
  budget?: number;
  startDate?: string;
  endDate?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export function AdminProjectManagement() {
  const { token } = useAdminAuth();
  
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
    queryFn: () => apiRequest('GET', '/api/projects', undefined, {
      Authorization: `Bearer ${token}`
    }),
    enabled: !!token,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'medium': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'low': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'paused': return <Pause className="h-4 w-4" />;
      case 'cancelled': return <X className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'Not set';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100); // Convert from cents
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Project Management</h2>
            <p className="text-muted-foreground">Manage client projects and deliverables</p>
          </div>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  const activeProjects = projects?.filter(p => p.status === 'active') || [];
  const completedProjects = projects?.filter(p => p.status === 'completed') || [];
  const pausedProjects = projects?.filter(p => p.status === 'paused') || [];
  const cancelledProjects = projects?.filter(p => p.status === 'cancelled') || [];

  const totalBudget = projects?.reduce((sum, p) => sum + (p.budget || 0), 0) || 0;
  const completedBudget = completedProjects.reduce((sum, p) => sum + (p.budget || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Project Management</h2>
          <p className="text-muted-foreground">
            Manage client projects and track progress
          </p>
        </div>
        <Button className="gradient-bg text-white">
          <FolderOpen className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* Project Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              All time projects
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects.length}</div>
            <p className="text-xs text-muted-foreground">
              Currently in progress
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedProjects.length}</div>
            <p className="text-xs text-muted-foreground">
              Successfully delivered
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(completedBudget)}</div>
            <p className="text-xs text-muted-foreground">
              From completed projects
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Projects by Status */}
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active">Active ({activeProjects.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedProjects.length})</TabsTrigger>
          <TabsTrigger value="paused">Paused ({pausedProjects.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({cancelledProjects.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <ProjectList projects={activeProjects} />
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          <ProjectList projects={completedProjects} />
        </TabsContent>
        
        <TabsContent value="paused" className="space-y-4">
          <ProjectList projects={pausedProjects} />
        </TabsContent>
        
        <TabsContent value="cancelled" className="space-y-4">
          <ProjectList projects={cancelledProjects} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProjectList({ projects }: { projects: Project[] }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      case 'medium': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'low': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Clock className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'paused': return <Pause className="h-4 w-4" />;
      case 'cancelled': return <X className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'Not set';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100);
  };

  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">
            No projects found in this category.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <Card key={project.id} className="transition-all duration-200 hover:shadow-md">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <Badge className={getStatusColor(project.status)}>
                    <div className="flex items-center space-x-1">
                      {getStatusIcon(project.status)}
                      <span>{project.status.toUpperCase()}</span>
                    </div>
                  </Badge>
                  <Badge className={getPriorityColor(project.priority)}>
                    {project.priority.toUpperCase()}
                  </Badge>
                </div>
                <CardDescription className="max-w-2xl">
                  {project.description || 'No description provided'}
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Client ID</p>
                  <p className="text-xs text-muted-foreground">{project.clientId}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Budget</p>
                  <p className="text-xs text-muted-foreground">{formatCurrency(project.budget)}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Start Date</p>
                  <p className="text-xs text-muted-foreground">
                    {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not set'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    {project.status === 'completed' ? 'Completed' : 'Due Date'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {project.status === 'completed' && project.completedAt
                      ? new Date(project.completedAt).toLocaleDateString()
                      : project.endDate
                      ? new Date(project.endDate).toLocaleDateString()
                      : 'Not set'
                    }
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
                <span>Updated: {new Date(project.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

