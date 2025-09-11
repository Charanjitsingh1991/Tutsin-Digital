import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { BlogPost, ContactSubmission, InsertBlogPost } from "@shared/schema";
import { Switch } from "@/components/ui/switch";
import { BarChart3 } from "lucide-react";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    imageUrl: "",
    published: false
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check for password in URL params or localStorage
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlPassword = urlParams.get('password');
    const storedAuth = localStorage.getItem('tutsin-admin-auth');
    
    if (urlPassword === 'tutsin123' || storedAuth === 'authenticated') {
      setIsAuthenticated(true);
      localStorage.setItem('tutsin-admin-auth', 'authenticated');
    }
  }, []);

  const handleLogin = () => {
    if (password === 'tutsin123') {
      setIsAuthenticated(true);
      localStorage.setItem('tutsin-admin-auth', 'authenticated');
      setPassword("");
    } else {
      toast({
        title: "Error",
        description: "Invalid password",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('tutsin-admin-auth');
  };

  // Queries
  const { data: posts, isLoading: isLoadingPosts } = useQuery<BlogPost[]>({
    queryKey: ["/api/admin/blog/posts"],
    enabled: isAuthenticated,
  });

  const { data: contacts, isLoading: isLoadingContacts } = useQuery<ContactSubmission[]>({
    queryKey: ["/api/admin/contact"],
    enabled: isAuthenticated,
  });

  // Mutations
  const createPostMutation = useMutation({
    mutationFn: async (data: InsertBlogPost) => {
      return await apiRequest("POST", "/api/admin/blog/posts", data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Blog post created successfully",
      });
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog/posts"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create blog post",
        variant: "destructive",
      });
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertBlogPost> }) => {
      return await apiRequest("PUT", `/api/admin/blog/posts/${id}`, data);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Blog post updated successfully",
      });
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog/posts"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update blog post",
        variant: "destructive",
      });
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/admin/blog/posts/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog/posts"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete blog post",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      category: "",
      imageUrl: "",
      published: false
    });
    setEditingPost(null);
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      category: post.category,
      imageUrl: post.imageUrl || "",
      published: post.published || false
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content || !formData.excerpt || !formData.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (editingPost) {
      updatePostMutation.mutate({ id: editingPost.id, data: formData });
    } else {
      createPostMutation.mutate(formData);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-gradient">Admin Login</CardTitle>
            <CardDescription className="text-center">
              Enter password to access admin panel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                data-testid="input-admin-password"
              />
            </div>
            <Button 
              onClick={handleLogin} 
              className="w-full gradient-bg text-white"
              data-testid="button-admin-login"
            >
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gradient" data-testid="text-admin-title">Admin Panel</h1>
          <div className="flex items-center space-x-3">
            <Link href="/analytics" data-testid="link-analytics">
              <Button variant="outline" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
              </Button>
            </Link>
            <Button 
              onClick={handleLogout} 
              variant="outline"
              data-testid="button-admin-logout"
            >
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="posts" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="posts" data-testid="tab-posts">Blog Posts</TabsTrigger>
            <TabsTrigger value="contacts" data-testid="tab-contacts">Contact Submissions</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle data-testid="text-create-post-title">
                  {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6" data-testid="form-blog-post">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        data-testid="input-post-title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select 
                        value={formData.category} 
                        onValueChange={(value) => setFormData({...formData, category: value})}
                      >
                        <SelectTrigger data-testid="select-post-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Web Design">Web Design</SelectItem>
                          <SelectItem value="SEO">SEO</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Technology">Technology</SelectItem>
                          <SelectItem value="Business">Business</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                      placeholder="https://example.com/image.jpg"
                      data-testid="input-post-image"
                    />
                  </div>

                  <div>
                    <Label htmlFor="excerpt">Excerpt *</Label>
                    <Textarea
                      id="excerpt"
                      rows={3}
                      value={formData.excerpt}
                      onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                      data-testid="textarea-post-excerpt"
                    />
                  </div>

                  <div>
                    <Label htmlFor="content">Content *</Label>
                    <Textarea
                      id="content"
                      rows={8}
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      data-testid="textarea-post-content"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="published"
                      checked={formData.published}
                      onCheckedChange={(checked) => setFormData({...formData, published: checked})}
                      data-testid="switch-post-published"
                    />
                    <Label htmlFor="published">Published</Label>
                  </div>

                  <div className="flex gap-4">
                    <Button 
                      type="submit" 
                      className="gradient-bg text-white"
                      disabled={createPostMutation.isPending || updatePostMutation.isPending}
                      data-testid="button-save-post"
                    >
                      {editingPost ? 'Update Post' : 'Create Post'}
                    </Button>
                    {editingPost && (
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={resetForm}
                        data-testid="button-cancel-edit"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle data-testid="text-existing-posts-title">Existing Posts</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingPosts ? (
                  <div>Loading posts...</div>
                ) : posts && posts.length > 0 ? (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg" data-testid={`post-item-${post.id}`}>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{post.title}</h3>
                          <p className="text-sm text-muted-foreground">{post.category} • {post.published ? 'Published' : 'Draft'}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(post.createdAt!).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleEdit(post)}
                            data-testid={`button-edit-${post.id}`}
                          >
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => deletePostMutation.mutate(post.id)}
                            disabled={deletePostMutation.isPending}
                            data-testid={`button-delete-${post.id}`}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No posts found.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle data-testid="text-contact-submissions-title">Contact Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingContacts ? (
                  <div>Loading contacts...</div>
                ) : contacts && contacts.length > 0 ? (
                  <div className="space-y-4">
                    {contacts.map((contact) => (
                      <div key={contact.id} className="p-4 border rounded-lg" data-testid={`contact-item-${contact.id}`}>
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {contact.firstName} {contact.lastName}
                            </h3>
                            <p className="text-sm text-muted-foreground">{contact.email}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">
                              Service: {contact.service}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(contact.createdAt!).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-foreground">{contact.message}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No contact submissions found.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
