import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { Shield, Plus, Edit, Trash2, Users } from 'lucide-react';

interface AdminRole {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

const AVAILABLE_PERMISSIONS = [
  { id: 'manage_admins', label: 'Manage Admins', description: 'Create, edit, and delete admin users' },
  { id: 'manage_roles', label: 'Manage Roles', description: 'Create and modify admin roles and permissions' },
  { id: 'manage_clients', label: 'Manage Clients', description: 'View and manage client accounts' },
  { id: 'manage_content', label: 'Manage Content', description: 'Create, edit, and publish blog posts and content' },
  { id: 'manage_projects', label: 'Manage Projects', description: 'Create and manage client projects' },
  { id: 'view_analytics', label: 'View Analytics', description: 'Access analytics and reporting data' },
  { id: 'system_settings', label: 'System Settings', description: 'Access system configuration and settings' },
];

export function AdminRoleManagement() {
  const { token } = useAdminAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<AdminRole | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  });

  // Queries
  const { data: roles, isLoading } = useQuery<AdminRole[]>({
    queryKey: ['/api/admin/roles'],
    queryFn: () => apiRequest('GET', '/api/admin/roles', undefined, {
      Authorization: `Bearer ${token}`
    }),
    enabled: !!token,
  });

  // Mutations
  const createRoleMutation = useMutation({
    mutationFn: (data: typeof formData) => 
      apiRequest('POST', '/api/admin/roles', data, {
        Authorization: `Bearer ${token}`
      }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Role created successfully",
      });
      setIsCreateDialogOpen(false);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['/api/admin/roles'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create role",
        variant: "destructive",
      });
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<typeof formData> }) =>
      apiRequest('PUT', `/api/admin/roles/${id}`, data, {
        Authorization: `Bearer ${token}`
      }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Role updated successfully",
      });
      setIsEditDialogOpen(false);
      setEditingRole(null);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['/api/admin/roles'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update role",
        variant: "destructive",
      });
    },
  });

  const deleteRoleMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest('DELETE', `/api/admin/roles/${id}`, undefined, {
        Authorization: `Bearer ${token}`
      }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Role deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/roles'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete role",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      permissions: []
    });
  };

  const handleEdit = (role: AdminRole) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions || []
    });
    setIsEditDialogOpen(true);
  };

  const handleCreate = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (editingRole) {
      updateRoleMutation.mutate({ id: editingRole.id, data: formData });
    } else {
      createRoleMutation.mutate(formData);
    }
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        permissions: [...formData.permissions, permissionId]
      });
    } else {
      setFormData({
        ...formData,
        permissions: formData.permissions.filter(p => p !== permissionId)
      });
    }
  };

  const getRoleColor = (roleName: string) => {
    switch (roleName) {
      case 'super_admin': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'admin': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'moderator': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Role Management</h2>
            <p className="text-muted-foreground">Manage admin roles and permissions</p>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Role Management</h2>
          <p className="text-muted-foreground">
            Manage admin roles and their permissions
          </p>
        </div>
        <Button onClick={handleCreate} className="gradient-bg text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create Role
        </Button>
      </div>

      {/* Roles Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {roles?.map((role) => (
          <Card key={role.id} className="transition-all duration-200 hover:shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">
                    <Badge className={getRoleColor(role.name)}>
                      {role.name.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </CardTitle>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(role)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteRoleMutation.mutate(role.id)}
                    disabled={deleteRoleMutation.isPending || role.name === 'super_admin'}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardDescription>{role.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{role.permissions?.length || 0} permissions</span>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Permissions:</h4>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions?.slice(0, 3).map((permission) => {
                      const permissionInfo = AVAILABLE_PERMISSIONS.find(p => p.id === permission);
                      return (
                        <Badge key={permission} variant="outline" className="text-xs">
                          {permissionInfo?.label || permission}
                        </Badge>
                      );
                    })}
                    {role.permissions && role.permissions.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{role.permissions.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Created: {new Date(role.createdAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Role Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
            <DialogDescription>
              Create a new admin role with specific permissions
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Role Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="e.g., content_manager"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Describe what this role is for..."
                required
              />
            </div>
            
            <div>
              <Label>Permissions</Label>
              <div className="mt-2 space-y-3 max-h-60 overflow-y-auto border rounded-md p-3">
                {AVAILABLE_PERMISSIONS.map((permission) => (
                  <div key={permission.id} className="flex items-start space-x-3">
                    <Checkbox
                      id={permission.id}
                      checked={formData.permissions.includes(permission.id)}
                      onCheckedChange={(checked) => 
                        handlePermissionChange(permission.id, checked as boolean)
                      }
                    />
                    <div className="flex-1">
                      <Label htmlFor={permission.id} className="text-sm font-medium cursor-pointer">
                        {permission.label}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {permission.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createRoleMutation.isPending}>
                {createRoleMutation.isPending ? 'Creating...' : 'Create Role'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Update role information and permissions
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="editName">Role Name *</Label>
              <Input
                id="editName"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                disabled={editingRole?.name === 'super_admin'}
              />
            </div>
            
            <div>
              <Label htmlFor="editDescription">Description *</Label>
              <Textarea
                id="editDescription"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
            </div>
            
            <div>
              <Label>Permissions</Label>
              <div className="mt-2 space-y-3 max-h-60 overflow-y-auto border rounded-md p-3">
                {AVAILABLE_PERMISSIONS.map((permission) => (
                  <div key={permission.id} className="flex items-start space-x-3">
                    <Checkbox
                      id={`edit-${permission.id}`}
                      checked={formData.permissions.includes(permission.id)}
                      onCheckedChange={(checked) => 
                        handlePermissionChange(permission.id, checked as boolean)
                      }
                      disabled={editingRole?.name === 'super_admin'}
                    />
                    <div className="flex-1">
                      <Label htmlFor={`edit-${permission.id}`} className="text-sm font-medium cursor-pointer">
                        {permission.label}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {permission.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {editingRole?.name === 'super_admin' && (
                <p className="text-xs text-muted-foreground mt-2">
                  Super admin role permissions cannot be modified
                </p>
              )}
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateRoleMutation.isPending}>
                {updateRoleMutation.isPending ? 'Updating...' : 'Update Role'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

