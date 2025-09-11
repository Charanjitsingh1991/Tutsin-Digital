import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Calendar, Clock, User, AlertCircle, CheckCircle, Circle, MessageSquare, Plus, FileText, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Project, ProjectMilestone, ProjectTask, ProjectComment } from "@shared/schema";

interface ProjectWithDetails extends Project {
  milestones?: ProjectMilestone[];
  tasks?: ProjectTask[];
  comments?: ProjectComment[];
}

export function ProjectManagement() {
  const { client } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");

  // Queries
  const { data: projects, isLoading: isLoadingProjects } = useQuery({
    queryKey: ["/api/projects", client?.id],
    queryFn: () => apiRequest("GET", `/api/projects?clientId=${client?.id}`) as Promise<Project[]>,
    enabled: !!client?.id,
  });

  const { data: milestones } = useQuery({
    queryKey: ["/api/projects", selectedProject, "milestones"],
    queryFn: () => apiRequest("GET", `/api/projects/${selectedProject}/milestones`) as Promise<ProjectMilestone[]>,
    enabled: !!selectedProject,
  });

  const { data: tasks } = useQuery({
    queryKey: ["/api/projects", selectedProject, "tasks"],
    queryFn: () => apiRequest("GET", `/api/projects/${selectedProject}/tasks`) as Promise<ProjectTask[]>,
    enabled: !!selectedProject,
  });

  const { data: comments } = useQuery({
    queryKey: ["/api/projects", selectedProject, "comments"],
    queryFn: () => apiRequest("GET", `/api/projects/${selectedProject}/comments?includeInternal=false`) as Promise<ProjectComment[]>,
    enabled: !!selectedProject,
  });

  // Mutations
  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { status: string } }) => {
      return await apiRequest("PUT", `/api/tasks/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", selectedProject, "tasks"] });
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    },
  });

  const addCommentMutation = useMutation({
    mutationFn: async (comment: { content: string; projectId: string; authorId: string }) => {
      return await apiRequest("POST", `/api/projects/${comment.projectId}/comments`, comment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", selectedProject, "comments"] });
      setNewComment("");
      toast({
        title: "Success",
        description: "Comment added successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in_progress":
        return "bg-blue-500";
      case "pending":
        return "bg-yellow-500";
      case "todo":
        return "bg-gray-500";
      case "blocked":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "medium":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "low":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const handleTaskStatusUpdate = (taskId: string, newStatus: string) => {
    updateTaskMutation.mutate({ id: taskId, data: { status: newStatus } });
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedProject || !client) return;
    
    addCommentMutation.mutate({
      content: newComment.trim(),
      projectId: selectedProject,
      authorId: client.id,
    });
  };

  const calculateProjectProgress = (project: Project, projectMilestones?: ProjectMilestone[], projectTasks?: ProjectTask[]) => {
    if ((!projectMilestones || !projectMilestones.length) && (!projectTasks || !projectTasks.length)) return 0;
    
    if (projectTasks && projectTasks.length > 0) {
      const completedTasks = projectTasks.filter(task => task.status === "completed").length;
      return Math.round((completedTasks / projectTasks.length) * 100);
    }
    
    if (projectMilestones && projectMilestones.length > 0) {
      const completedMilestones = projectMilestones.filter(milestone => milestone.status === "completed").length;
      return Math.round((completedMilestones / projectMilestones.length) * 100);
    }
    
    return 0;
  };

  if (isLoadingProjects) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-48 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!projects?.length) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-muted-foreground mb-2">No Projects Yet</h2>
            <p className="text-muted-foreground">Your projects will appear here once they are created.</p>
          </div>
        </div>
      </div>
    );
  }

  const selectedProjectData = projects.find(p => p.id === selectedProject);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent" data-testid="text-projects-title">
              Project Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Track progress and collaborate on your projects
            </p>
          </div>
          <div className="text-sm text-muted-foreground">
            {projects.length} active project{projects.length !== 1 ? 's' : ''}
          </div>
        </div>

        {!selectedProject ? (
          /* Project Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card 
                key={project.id} 
                className="glass-card cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedProject(project.id)}
                data-testid={`card-project-${project.id}`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg" data-testid={`text-project-title-${project.id}`}>
                      {project.title}
                    </CardTitle>
                    <Badge 
                      className={getStatusColor(project.status)}
                      data-testid={`badge-project-status-${project.id}`}
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Due: {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'TBD'}</span>
                    </div>
                    <Badge className={getPriorityColor(project.priority)}>
                      {project.priority}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{calculateProjectProgress(project)}%</span>
                    </div>
                    <Progress 
                      value={calculateProjectProgress(project)} 
                      className="h-2"
                      data-testid={`progress-project-${project.id}`}
                    />
                  </div>

                  {project.budget && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span>Budget: ${(project.budget / 100).toLocaleString()}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Project Details */
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => setSelectedProject(null)}
                data-testid="button-back-to-projects"
              >
                ← Back to Projects
              </Button>
              <div>
                <h2 className="text-2xl font-bold" data-testid="text-selected-project-title">
                  {selectedProjectData?.title}
                </h2>
                <p className="text-muted-foreground">{selectedProjectData?.description}</p>
              </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
                <TabsTrigger value="milestones" data-testid="tab-milestones">Milestones</TabsTrigger>
                <TabsTrigger value="tasks" data-testid="tab-tasks">Tasks</TabsTrigger>
                <TabsTrigger value="comments" data-testid="tab-comments">Comments</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="glass-card">
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold" data-testid="text-project-progress">
                        {calculateProjectProgress(selectedProjectData!, milestones, tasks)}%
                      </div>
                      <p className="text-sm text-muted-foreground">Project Progress</p>
                      <Progress value={calculateProjectProgress(selectedProjectData!, milestones, tasks)} className="mt-2" />
                    </CardContent>
                  </Card>
                  
                  <Card className="glass-card">
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold" data-testid="text-total-tasks">
                        {tasks?.length || 0}
                      </div>
                      <p className="text-sm text-muted-foreground">Total Tasks</p>
                      <div className="text-xs text-muted-foreground mt-1">
                        {tasks?.filter(t => t.status === "completed").length || 0} completed
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="glass-card">
                    <CardContent className="pt-6">
                      <div className="text-2xl font-bold" data-testid="text-total-milestones">
                        {milestones?.length || 0}
                      </div>
                      <p className="text-sm text-muted-foreground">Milestones</p>
                      <div className="text-xs text-muted-foreground mt-1">
                        {milestones?.filter(m => m.status === "completed").length || 0} completed
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Project Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Status</div>
                      <Badge className={getStatusColor(selectedProjectData?.status || "")}>
                        {selectedProjectData?.status}
                      </Badge>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Priority</div>
                      <Badge className={getPriorityColor(selectedProjectData?.priority || "")}>
                        {selectedProjectData?.priority}
                      </Badge>
                    </div>
                    {selectedProjectData?.startDate && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Start Date</div>
                        <div className="text-sm">{new Date(selectedProjectData.startDate).toLocaleDateString()}</div>
                      </div>
                    )}
                    {selectedProjectData?.endDate && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">End Date</div>
                        <div className="text-sm">{new Date(selectedProjectData.endDate).toLocaleDateString()}</div>
                      </div>
                    )}
                    {selectedProjectData?.budget && (
                      <div>
                        <div className="text-sm font-medium text-muted-foreground">Budget</div>
                        <div className="text-sm">${(selectedProjectData.budget / 100).toLocaleString()}</div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="milestones" className="space-y-4">
                {milestones?.length ? (
                  milestones.map((milestone) => (
                    <Card key={milestone.id} className="glass-card" data-testid={`card-milestone-${milestone.id}`}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold" data-testid={`text-milestone-title-${milestone.id}`}>
                            {milestone.title}
                          </h3>
                          <Badge className={getStatusColor(milestone.status)}>
                            {milestone.status}
                          </Badge>
                        </div>
                        {milestone.description && (
                          <p className="text-sm text-muted-foreground mb-3">{milestone.description}</p>
                        )}
                        {milestone.dueDate && (
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Due: {new Date(milestone.dueDate).toLocaleDateString()}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Circle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No milestones defined for this project.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="tasks" className="space-y-4">
                {tasks?.length ? (
                  <div className="space-y-4">
                    {tasks.map((task) => (
                      <Card key={task.id} className="glass-card" data-testid={`card-task-${task.id}`}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="font-semibold" data-testid={`text-task-title-${task.id}`}>
                                  {task.title}
                                </h3>
                                <Badge className={getPriorityColor(task.priority)}>
                                  {task.priority}
                                </Badge>
                              </div>
                              {task.description && (
                                <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                              )}
                              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                {task.dueDate && (
                                  <div className="flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                                  </div>
                                )}
                                {task.estimatedHours && (
                                  <div className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    <span>{task.estimatedHours}h estimated</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="ml-4">
                              <Select
                                value={task.status}
                                onValueChange={(value) => handleTaskStatusUpdate(task.id, value)}
                                data-testid={`select-task-status-${task.id}`}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="todo">To Do</SelectItem>
                                  <SelectItem value="in_progress">In Progress</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                  <SelectItem value="blocked">Blocked</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No tasks assigned to this project yet.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="comments" className="space-y-4">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2" />
                      Add Comment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Textarea
                      placeholder="Share updates, ask questions, or provide feedback..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      data-testid="textarea-new-comment"
                    />
                    <Button 
                      onClick={handleAddComment}
                      disabled={!newComment.trim() || addCommentMutation.isPending}
                      data-testid="button-add-comment"
                    >
                      {addCommentMutation.isPending ? "Adding..." : "Add Comment"}
                    </Button>
                  </CardContent>
                </Card>

                {comments?.length ? (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <Card key={comment.id} className="glass-card" data-testid={`card-comment-${comment.id}`}>
                        <CardContent className="pt-6">
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                              {client?.firstName?.[0] || 'U'}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <span className="font-medium text-sm">
                                  {client?.firstName} {client?.lastName}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(comment.createdAt!).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm" data-testid={`text-comment-content-${comment.id}`}>
                                {comment.content}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">No comments yet. Start the conversation!</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}