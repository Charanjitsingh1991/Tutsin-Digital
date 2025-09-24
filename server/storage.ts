import { setDefaultResultOrder } from "node:dns";
setDefaultResultOrder("ipv4first");
import { type User, type InsertUser, type Client, type InsertClient, type ClientSession, type InsertClientSession, type BlogPost, type InsertBlogPost, type ContactSubmission, type InsertContactSubmission, type PageView, type InsertPageView, type WebsiteMetrics, type InsertWebsiteMetrics, type Project, type InsertProject, type ProjectMilestone, type InsertProjectMilestone, type ProjectTask, type InsertProjectTask, type ProjectComment, type InsertProjectComment } from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Client authentication methods
  getClient(id: string): Promise<Client | undefined>;
  getClientByEmail(email: string): Promise<Client | undefined>;
  createClient(client: InsertClient): Promise<Client>;
  updateClient(id: string, client: Partial<InsertClient>): Promise<Client | undefined>;
  
  // Client session methods
  createClientSession(session: InsertClientSession): Promise<ClientSession>;
  getClientSession(token: string): Promise<ClientSession | undefined>;
  deleteClientSession(token: string): Promise<boolean>;
  cleanExpiredSessions(): Promise<void>;
  
  getBlogPosts(): Promise<BlogPost[]>;
  getPublishedBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: string, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: string): Promise<boolean>;
  
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getContactSubmissions(): Promise<ContactSubmission[]>;
  
  // Analytics methods
  createPageView(pageView: InsertPageView): Promise<PageView>;
  getPageViews(startDate?: Date, endDate?: Date): Promise<PageView[]>;
  createWebsiteMetrics(metrics: InsertWebsiteMetrics): Promise<WebsiteMetrics>;
  getWebsiteMetrics(date: string): Promise<WebsiteMetrics | undefined>;
  getWebsiteMetricsRange(startDate: string, endDate: string): Promise<WebsiteMetrics[]>;
  updateWebsiteMetrics(date: string, metrics: Partial<InsertWebsiteMetrics>): Promise<WebsiteMetrics | undefined>;
  
  // Project management methods
  createProject(project: InsertProject): Promise<Project>;
  getProject(id: string): Promise<Project | undefined>;
  getProjectsByClient(clientId: string): Promise<Project[]>;
  getAllProjects(): Promise<Project[]>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;
  
  // Project milestone methods
  createProjectMilestone(milestone: InsertProjectMilestone): Promise<ProjectMilestone>;
  getProjectMilestone(id: string): Promise<ProjectMilestone | undefined>;
  getProjectMilestones(projectId: string): Promise<ProjectMilestone[]>;
  updateProjectMilestone(id: string, milestone: Partial<InsertProjectMilestone>): Promise<ProjectMilestone | undefined>;
  deleteProjectMilestone(id: string): Promise<boolean>;
  
  // Project task methods
  createProjectTask(task: InsertProjectTask): Promise<ProjectTask>;
  getProjectTask(id: string): Promise<ProjectTask | undefined>;
  getProjectTasks(projectId: string): Promise<ProjectTask[]>;
  getTasksByMilestone(milestoneId: string): Promise<ProjectTask[]>;
  updateProjectTask(id: string, task: Partial<InsertProjectTask>): Promise<ProjectTask | undefined>;
  deleteProjectTask(id: string): Promise<boolean>;
  
  // Project comment methods
  createProjectComment(comment: InsertProjectComment): Promise<ProjectComment>;
  getProjectComments(projectId: string, includeInternal?: boolean): Promise<ProjectComment[]>;
  updateProjectComment(id: string, comment: Partial<InsertProjectComment>): Promise<ProjectComment | undefined>;
  deleteProjectComment(id: string): Promise<boolean>;
  
  // Admin authentication methods
  getAdmin(id: string): Promise<Admin | undefined>;
  getAdminByEmail(email: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
  updateAdmin(id: string, admin: Partial<InsertAdmin>): Promise<Admin | undefined>;
  deleteAdmin(id: string): Promise<boolean>;
  getAllAdmins(): Promise<Admin[]>;
  
  // Admin role methods
  getAdminRole(id: string): Promise<AdminRole | undefined>;
  getAdminRoleByName(name: string): Promise<AdminRole | undefined>;
  createAdminRole(role: InsertAdminRole): Promise<AdminRole>;
  updateAdminRole(id: string, role: Partial<InsertAdminRole>): Promise<AdminRole | undefined>;
  deleteAdminRole(id: string): Promise<boolean>;
  getAllAdminRoles(): Promise<AdminRole[]>;
  
  // Admin session methods
  createAdminSession(session: InsertAdminSession): Promise<AdminSession>;
  getAdminSession(token: string): Promise<AdminSession | undefined>;
  deleteAdminSession(token: string): Promise<boolean>;
  cleanExpiredAdminSessions(): Promise<void>;
  
  // Notification methods
  createNotification(notification: InsertNotification): Promise<Notification>;
  getNotifications(recipientId: string, recipientType: string): Promise<Notification[]>;
  markNotificationAsRead(id: string): Promise<boolean>;
  deleteNotification(id: string): Promise<boolean>;
  
  // File upload methods
  createFileUpload(fileUpload: InsertFileUpload): Promise<FileUpload>;
  getFileUpload(id: string): Promise<FileUpload | undefined>;
  getFileUploads(uploadedBy?: string, category?: string): Promise<FileUpload[]>;
  deleteFileUpload(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private clients: Map<string, Client>;
  private clientSessions: Map<string, ClientSession>;
  private blogPosts: Map<string, BlogPost>;
  private contactSubmissions: Map<string, ContactSubmission>;
  private pageViews: Map<string, PageView>;
  private websiteMetrics: Map<string, WebsiteMetrics>;
  private projects: Map<string, Project>;
  private projectMilestones: Map<string, ProjectMilestone>;
  private projectTasks: Map<string, ProjectTask>;
  private projectComments: Map<string, ProjectComment>;
  private admins: Map<string, Admin>;
  private adminRoles: Map<string, AdminRole>;
  private adminSessions: Map<string, AdminSession>;
  private notifications: Map<string, Notification>;
  private fileUploads: Map<string, FileUpload>;

  constructor() {
    this.users = new Map();
    this.clients = new Map();
    this.clientSessions = new Map();
    this.blogPosts = new Map();
    this.contactSubmissions = new Map();
    this.pageViews = new Map();
    this.websiteMetrics = new Map();
    this.projects = new Map();
    this.projectMilestones = new Map();
    this.projectTasks = new Map();
    this.projectComments = new Map();
    this.admins = new Map();
    this.adminRoles = new Map();
    this.adminSessions = new Map();
    this.notifications = new Map();
    this.fileUploads = new Map();
    
    // Seed with sample blog posts, analytics data, and project data
    this.seedBlogPosts();
    this.seedAnalyticsData();
    this.seedProjectData();
    
    // Clean expired sessions every hour
    setInterval(() => this.cleanExpiredSessions(), 60 * 60 * 1000);
  }

  private seedBlogPosts() {
    const samplePosts: BlogPost[] = [
      {
        id: randomUUID(),
        title: "10 Web Design Trends for 2024",
        content: "Discover the latest design trends that are shaping the future of web development and user experience. From AI-powered design tools to immersive 3D elements, learn how to stay ahead of the curve.",
        excerpt: "Discover the latest design trends that are shaping the future of web development and user experience.",
        category: "Web Design",
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        published: true,
        createdAt: new Date("2024-03-15"),
        updatedAt: new Date("2024-03-15"),
      },
      {
        id: randomUUID(),
        title: "AI-Powered SEO Strategies",
        content: "Learn how artificial intelligence is revolutionizing search engine optimization and content strategy. Discover tools and techniques that can give your website a competitive edge.",
        excerpt: "Learn how artificial intelligence is revolutionizing search engine optimization and content strategy.",
        category: "SEO",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        published: true,
        createdAt: new Date("2024-03-12"),
        updatedAt: new Date("2024-03-12"),
      },
      {
        id: randomUUID(),
        title: "Social Media ROI Maximization",
        content: "Effective strategies to maximize your return on investment from social media marketing campaigns. Learn advanced targeting techniques and content optimization methods.",
        excerpt: "Effective strategies to maximize your return on investment from social media marketing campaigns.",
        category: "Marketing",
        imageUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
        published: true,
        createdAt: new Date("2024-03-10"),
        updatedAt: new Date("2024-03-10"),
      },
    ];

    samplePosts.forEach(post => {
      this.blogPosts.set(post.id, post);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Client authentication methods
  async getClient(id: string): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  async getClientByEmail(email: string): Promise<Client | undefined> {
    return Array.from(this.clients.values()).find(
      (client) => client.email === email,
    );
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const id = randomUUID();
    const client: Client = {
      ...insertClient,
      id,
      company: insertClient.company || null,
      phone: insertClient.phone || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.clients.set(id, client);
    return client;
  }

  async updateClient(id: string, updateData: Partial<InsertClient>): Promise<Client | undefined> {
    const client = this.clients.get(id);
    if (!client) return undefined;

    const updatedClient: Client = {
      ...client,
      ...updateData,
      updatedAt: new Date(),
    };
    this.clients.set(id, updatedClient);
    return updatedClient;
  }

  // Client session methods
  async createClientSession(insertSession: InsertClientSession): Promise<ClientSession> {
    const id = randomUUID();
    const session: ClientSession = {
      ...insertSession,
      id,
      createdAt: new Date(),
    };
    this.clientSessions.set(insertSession.token, session);
    return session;
  }

  async getClientSession(token: string): Promise<ClientSession | undefined> {
    const session = this.clientSessions.get(token);
    if (!session) return undefined;
    
    // Check if session is expired
    if (new Date() > new Date(session.expiresAt)) {
      this.clientSessions.delete(token);
      return undefined;
    }
    
    return session;
  }

  async deleteClientSession(token: string): Promise<boolean> {
    return this.clientSessions.delete(token);
  }

  async cleanExpiredSessions(): Promise<void> {
    const now = new Date();
    const entries = Array.from(this.clientSessions.entries());
    for (const [token, session] of entries) {
      if (now > new Date(session.expiresAt)) {
        this.clientSessions.delete(token);
      }
    }
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter(post => post.published)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const id = randomUUID();
    const post: BlogPost = {
      ...insertPost,
      id,
      imageUrl: insertPost.imageUrl || null,
      published: insertPost.published || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.blogPosts.set(id, post);
    return post;
  }

  async updateBlogPost(id: string, updateData: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const post = this.blogPosts.get(id);
    if (!post) return undefined;

    const updatedPost: BlogPost = {
      ...post,
      ...updateData,
      updatedAt: new Date(),
    };
    this.blogPosts.set(id, updatedPost);
    return updatedPost;
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    return this.blogPosts.delete(id);
  }

  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const id = randomUUID();
    const submission: ContactSubmission = {
      ...insertSubmission,
      id,
      createdAt: new Date(),
    };
    this.contactSubmissions.set(id, submission);
    return submission;
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return Array.from(this.contactSubmissions.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  // Analytics methods
  async createPageView(insertPageView: InsertPageView): Promise<PageView> {
    const id = randomUUID();
    const pageView: PageView = {
      ...insertPageView,
      id,
      userAgent: insertPageView.userAgent || null,
      referrer: insertPageView.referrer || null,
      ip: insertPageView.ip || null,
      timestamp: new Date(),
    };
    this.pageViews.set(id, pageView);
    return pageView;
  }

  async getPageViews(startDate?: Date, endDate?: Date): Promise<PageView[]> {
    const views = Array.from(this.pageViews.values());
    if (!startDate && !endDate) return views;
    
    return views.filter((view) => {
      const viewDate = new Date(view.timestamp!);
      if (startDate && viewDate < startDate) return false;
      if (endDate && viewDate > endDate) return false;
      return true;
    });
  }

  async createWebsiteMetrics(insertMetrics: InsertWebsiteMetrics): Promise<WebsiteMetrics> {
    const id = randomUUID();
    const metrics: WebsiteMetrics = {
      ...insertMetrics,
      id,
      totalViews: insertMetrics.totalViews || 0,
      uniqueVisitors: insertMetrics.uniqueVisitors || 0,
      bounceRate: insertMetrics.bounceRate || 0,
      avgSessionDuration: insertMetrics.avgSessionDuration || 0,
      topPages: insertMetrics.topPages || null,
      topReferrers: insertMetrics.topReferrers || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.websiteMetrics.set(insertMetrics.date, metrics);
    return metrics;
  }

  async getWebsiteMetrics(date: string): Promise<WebsiteMetrics | undefined> {
    return this.websiteMetrics.get(date);
  }

  async getWebsiteMetricsRange(startDate: string, endDate: string): Promise<WebsiteMetrics[]> {
    return Array.from(this.websiteMetrics.values())
      .filter((metrics) => metrics.date >= startDate && metrics.date <= endDate)
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  async updateWebsiteMetrics(date: string, updateData: Partial<InsertWebsiteMetrics>): Promise<WebsiteMetrics | undefined> {
    const metrics = this.websiteMetrics.get(date);
    if (!metrics) return undefined;

    const updatedMetrics: WebsiteMetrics = {
      ...metrics,
      ...updateData,
      updatedAt: new Date(),
    };
    this.websiteMetrics.set(date, updatedMetrics);
    return updatedMetrics;
  }

  private seedAnalyticsData() {
    // Generate sample analytics data for the last 30 days
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const metrics: WebsiteMetrics = {
        id: randomUUID(),
        date: dateStr,
        totalViews: Math.floor(Math.random() * 500) + 100,
        uniqueVisitors: Math.floor(Math.random() * 300) + 50,
        bounceRate: Math.floor(Math.random() * 40) + 30,
        avgSessionDuration: Math.floor(Math.random() * 300) + 120,
        topPages: ["/", "/services", "/about", "/blog", "/contact"],
        topReferrers: ["google.com", "facebook.com", "linkedin.com", "direct"],
        createdAt: date,
        updatedAt: date,
      };
      this.websiteMetrics.set(dateStr, metrics);
    }
  }

  private seedProjectData() {
    // Create a sample client first with properly hashed password and consistent ID
    const hashedPassword = bcrypt.hashSync("password123", 10);
    const sampleClient: Client = {
      id: "sample-client-jane-smith-uuid", // Fixed UUID for consistency across server restarts
      firstName: "Jane",
      lastName: "Smith", 
      email: "jane.smith@example.com",
      password: hashedPassword,
      company: "Acme Corp",
      phone: "+1-555-0123",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.clients.set(sampleClient.id, sampleClient);

    // Create sample projects
    const project1: Project = {
      id: randomUUID(),
      title: "Website Redesign",
      description: "Complete redesign of corporate website with modern UI/UX",
      clientId: sampleClient.id,
      status: "active",
      priority: "high",
      budget: 25000_00, // $25,000 in cents
      startDate: new Date("2024-03-01"),
      endDate: new Date("2024-05-15"),
      completedAt: null,
      createdAt: new Date("2024-03-01"),
      updatedAt: new Date(),
    };
    this.projects.set(project1.id, project1);

    const project2: Project = {
      id: randomUUID(),
      title: "SEO Optimization",
      description: "Comprehensive SEO audit and optimization campaign",
      clientId: sampleClient.id,
      status: "completed",
      priority: "medium",
      budget: 8000_00, // $8,000 in cents
      startDate: new Date("2024-02-01"),
      endDate: new Date("2024-03-30"),
      completedAt: new Date("2024-03-28"),
      createdAt: new Date("2024-02-01"),
      updatedAt: new Date("2024-03-28"),
    };
    this.projects.set(project2.id, project2);

    // Create sample milestones for project 1
    const milestone1: ProjectMilestone = {
      id: randomUUID(),
      projectId: project1.id,
      title: "Design Phase",
      description: "Create wireframes, mockups, and design system",
      status: "completed",
      dueDate: new Date("2024-03-15"),
      completedAt: new Date("2024-03-14"),
      order: 1,
      createdAt: new Date("2024-03-01"),
      updatedAt: new Date("2024-03-14"),
    };
    this.projectMilestones.set(milestone1.id, milestone1);

    const milestone2: ProjectMilestone = {
      id: randomUUID(),
      projectId: project1.id,
      title: "Development Phase",
      description: "Frontend and backend development implementation",
      status: "in_progress",
      dueDate: new Date("2024-04-30"),
      completedAt: null,
      order: 2,
      createdAt: new Date("2024-03-01"),
      updatedAt: new Date(),
    };
    this.projectMilestones.set(milestone2.id, milestone2);

    // Create sample tasks
    const task1: ProjectTask = {
      id: randomUUID(),
      projectId: project1.id,
      milestoneId: milestone2.id,
      title: "Homepage Development",
      description: "Develop responsive homepage with hero section and key features",
      status: "in_progress",
      priority: "high",
      estimatedHours: 20,
      actualHours: 12,
      dueDate: new Date("2024-04-10"),
      completedAt: null,
      order: 1,
      createdAt: new Date("2024-03-15"),
      updatedAt: new Date(),
    };
    this.projectTasks.set(task1.id, task1);

    const task2: ProjectTask = {
      id: randomUUID(),
      projectId: project1.id,
      milestoneId: milestone2.id,
      title: "Contact Form Integration",
      description: "Implement contact form with validation and email notifications",
      status: "todo",
      priority: "medium",
      estimatedHours: 8,
      actualHours: null,
      dueDate: new Date("2024-04-15"),
      completedAt: null,
      order: 2,
      createdAt: new Date("2024-03-15"),
      updatedAt: new Date(),
    };
    this.projectTasks.set(task2.id, task2);

    // Create sample comments
    const comment1: ProjectComment = {
      id: randomUUID(),
      projectId: project1.id,
      taskId: task1.id,
      milestoneId: null,
      authorId: sampleClient.id,
      content: "The homepage is looking great! Could we make the hero image a bit larger?",
      isInternal: false,
      createdAt: new Date("2024-03-20"),
      updatedAt: new Date("2024-03-20"),
    };
    this.projectComments.set(comment1.id, comment1);
  }

  // Project management methods
  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = {
      ...insertProject,
      id,
      status: insertProject.status || "active",
      priority: insertProject.priority || "medium",
      description: insertProject.description || null,
      budget: insertProject.budget || null,
      startDate: insertProject.startDate || null,
      endDate: insertProject.endDate || null,
      completedAt: insertProject.completedAt || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.projects.set(id, project);
    return project;
  }

  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjectsByClient(clientId: string): Promise<Project[]> {
    return Array.from(this.projects.values())
      .filter(project => project.clientId === clientId)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async updateProject(id: string, updateData: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;

    const updatedProject: Project = {
      ...project,
      ...updateData,
      updatedAt: new Date(),
    };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Project milestone methods
  async createProjectMilestone(insertMilestone: InsertProjectMilestone): Promise<ProjectMilestone> {
    const id = randomUUID();
    const milestone: ProjectMilestone = {
      ...insertMilestone,
      id,
      status: insertMilestone.status || "pending",
      description: insertMilestone.description || null,
      dueDate: insertMilestone.dueDate || null,
      completedAt: insertMilestone.completedAt || null,
      order: insertMilestone.order || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.projectMilestones.set(id, milestone);
    return milestone;
  }

  async getProjectMilestone(id: string): Promise<ProjectMilestone | undefined> {
    return this.projectMilestones.get(id);
  }

  async getProjectMilestones(projectId: string): Promise<ProjectMilestone[]> {
    return Array.from(this.projectMilestones.values())
      .filter(milestone => milestone.projectId === projectId)
      .sort((a, b) => a.order - b.order);
  }

  async updateProjectMilestone(id: string, updateData: Partial<InsertProjectMilestone>): Promise<ProjectMilestone | undefined> {
    const milestone = this.projectMilestones.get(id);
    if (!milestone) return undefined;

    const updatedMilestone: ProjectMilestone = {
      ...milestone,
      ...updateData,
      updatedAt: new Date(),
    };
    this.projectMilestones.set(id, updatedMilestone);
    return updatedMilestone;
  }

  async deleteProjectMilestone(id: string): Promise<boolean> {
    return this.projectMilestones.delete(id);
  }

  // Project task methods
  async createProjectTask(insertTask: InsertProjectTask): Promise<ProjectTask> {
    const id = randomUUID();
    const task: ProjectTask = {
      ...insertTask,
      id,
      status: insertTask.status || "todo",
      priority: insertTask.priority || "medium",
      description: insertTask.description || null,
      milestoneId: insertTask.milestoneId || null,
      estimatedHours: insertTask.estimatedHours || null,
      actualHours: insertTask.actualHours || null,
      dueDate: insertTask.dueDate || null,
      completedAt: insertTask.completedAt || null,
      order: insertTask.order || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.projectTasks.set(id, task);
    return task;
  }

  async getProjectTask(id: string): Promise<ProjectTask | undefined> {
    return this.projectTasks.get(id);
  }

  async getProjectTasks(projectId: string): Promise<ProjectTask[]> {
    return Array.from(this.projectTasks.values())
      .filter(task => task.projectId === projectId)
      .sort((a, b) => a.order - b.order);
  }

  async getTasksByMilestone(milestoneId: string): Promise<ProjectTask[]> {
    return Array.from(this.projectTasks.values())
      .filter(task => task.milestoneId === milestoneId)
      .sort((a, b) => a.order - b.order);
  }

  async updateProjectTask(id: string, updateData: Partial<InsertProjectTask>): Promise<ProjectTask | undefined> {
    const task = this.projectTasks.get(id);
    if (!task) return undefined;

    const updatedTask: ProjectTask = {
      ...task,
      ...updateData,
      updatedAt: new Date(),
    };
    this.projectTasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteProjectTask(id: string): Promise<boolean> {
    return this.projectTasks.delete(id);
  }

  // Project comment methods
  async createProjectComment(insertComment: InsertProjectComment): Promise<ProjectComment> {
    const id = randomUUID();
    const comment: ProjectComment = {
      ...insertComment,
      id,
      taskId: insertComment.taskId || null,
      milestoneId: insertComment.milestoneId || null,
      isInternal: insertComment.isInternal || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.projectComments.set(id, comment);
    return comment;
  }

  async getProjectComments(projectId: string, includeInternal: boolean = true): Promise<ProjectComment[]> {
    return Array.from(this.projectComments.values())
      .filter(comment => 
        comment.projectId === projectId && 
        (includeInternal || !comment.isInternal)
      )
      .sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime());
  }

  async getTaskComments(taskId: string, includeInternal: boolean = true): Promise<ProjectComment[]> {
    return Array.from(this.projectComments.values())
      .filter(comment => 
        comment.taskId === taskId && 
        (includeInternal || !comment.isInternal)
      )
      .sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime());
  }

  async getMilestoneComments(milestoneId: string, includeInternal: boolean = true): Promise<ProjectComment[]> {
    return Array.from(this.projectComments.values())
      .filter(comment => 
        comment.milestoneId === milestoneId && 
        (includeInternal || !comment.isInternal)
      )
      .sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime());
  }

  async updateProjectComment(id: string, updateData: Partial<InsertProjectComment>): Promise<ProjectComment | undefined> {
    const comment = this.projectComments.get(id);
    if (!comment) return undefined;

    const updatedComment: ProjectComment = {
      ...comment,
      ...updateData,
      updatedAt: new Date(),
    };
    this.projectComments.set(id, updatedComment);
    return updatedComment;
  }

  async deleteProjectComment(id: string): Promise<boolean> {
    return this.projectComments.delete(id);
  }

  // Admin authentication methods
  async getAdmin(id: string): Promise<Admin | undefined> {
    return this.admins.get(id);
  }

  async getAdminByEmail(email: string): Promise<Admin | undefined> {
    return Array.from(this.admins.values()).find(admin => admin.email === email);
  }

  async createAdmin(insertAdmin: InsertAdmin): Promise<Admin> {
    const id = randomUUID();
    const admin: Admin = {
      ...insertAdmin,
      id,
      isActive: insertAdmin.isActive ?? true,
      lastLoginAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.admins.set(id, admin);
    return admin;
  }

  async updateAdmin(id: string, updateData: Partial<InsertAdmin>): Promise<Admin | undefined> {
    const admin = this.admins.get(id);
    if (!admin) return undefined;

    const updatedAdmin: Admin = {
      ...admin,
      ...updateData,
      updatedAt: new Date(),
    };
    this.admins.set(id, updatedAdmin);
    return updatedAdmin;
  }

  async deleteAdmin(id: string): Promise<boolean> {
    return this.admins.delete(id);
  }

  async getAllAdmins(): Promise<Admin[]> {
    return Array.from(this.admins.values());
  }

  // Admin role methods
  async getAdminRole(id: string): Promise<AdminRole | undefined> {
    return this.adminRoles.get(id);
  }

  async getAdminRoleByName(name: string): Promise<AdminRole | undefined> {
    return Array.from(this.adminRoles.values()).find(role => role.name === name);
  }

  async createAdminRole(insertRole: InsertAdminRole): Promise<AdminRole> {
    const id = randomUUID();
    const role: AdminRole = {
      ...insertRole,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.adminRoles.set(id, role);
    return role;
  }

  async updateAdminRole(id: string, updateData: Partial<InsertAdminRole>): Promise<AdminRole | undefined> {
    const role = this.adminRoles.get(id);
    if (!role) return undefined;

    const updatedRole: AdminRole = {
      ...role,
      ...updateData,
      updatedAt: new Date(),
    };
    this.adminRoles.set(id, updatedRole);
    return updatedRole;
  }

  async deleteAdminRole(id: string): Promise<boolean> {
    return this.adminRoles.delete(id);
  }

  async getAllAdminRoles(): Promise<AdminRole[]> {
    return Array.from(this.adminRoles.values());
  }

  // Admin session methods
  async createAdminSession(insertSession: InsertAdminSession): Promise<AdminSession> {
    const id = randomUUID();
    const session: AdminSession = {
      ...insertSession,
      id,
      createdAt: new Date(),
    };
    this.adminSessions.set(id, session);
    return session;
  }

  async getAdminSession(token: string): Promise<AdminSession | undefined> {
    const session = Array.from(this.adminSessions.values()).find(s => s.token === token);
    if (session && session.expiresAt < new Date()) {
      this.adminSessions.delete(session.id);
      return undefined;
    }
    return session;
  }

  async deleteAdminSession(token: string): Promise<boolean> {
    const session = Array.from(this.adminSessions.values()).find(s => s.token === token);
    if (session) {
      return this.adminSessions.delete(session.id);
    }
    return false;
  }

  async cleanExpiredAdminSessions(): Promise<void> {
    const now = new Date();
    for (const [id, session] of this.adminSessions.entries()) {
      if (session.expiresAt < now) {
        this.adminSessions.delete(id);
      }
    }
  }

  // Notification methods
  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = randomUUID();
    const notification: Notification = {
      ...insertNotification,
      id,
      isRead: false,
      createdAt: new Date(),
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async getNotifications(recipientId: string, recipientType: string): Promise<Notification[]> {
    return Array.from(this.notifications.values())
      .filter(n => n.recipientId === recipientId && n.recipientType === recipientType)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async markNotificationAsRead(id: string): Promise<boolean> {
    const notification = this.notifications.get(id);
    if (!notification) return false;
    
    notification.isRead = true;
    this.notifications.set(id, notification);
    return true;
  }

  async deleteNotification(id: string): Promise<boolean> {
    return this.notifications.delete(id);
  }

  // File upload methods
  async createFileUpload(insertFileUpload: InsertFileUpload): Promise<FileUpload> {
    const id = randomUUID();
    const fileUpload: FileUpload = {
      ...insertFileUpload,
      id,
      createdAt: new Date(),
    };
    this.fileUploads.set(id, fileUpload);
    return fileUpload;
  }

  async getFileUpload(id: string): Promise<FileUpload | undefined> {
    return this.fileUploads.get(id);
  }

  async getFileUploads(uploadedBy?: string, category?: string): Promise<FileUpload[]> {
    let uploads = Array.from(this.fileUploads.values());
    
    if (uploadedBy) {
      uploads = uploads.filter(u => u.uploadedBy === uploadedBy);
    }
    
    if (category) {
      uploads = uploads.filter(u => u.category === category);
    }
    
    return uploads.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async deleteFileUpload(id: string): Promise<boolean> {
    return this.fileUploads.delete(id);
  }
}

// Choose storage implementation.
// Default to in-memory storage. If USE_DB=true and DATABASE_URL is present,
// try to use the PostgreSQL-backed storage.
let storageImpl: IStorage = new MemStorage();

if (process.env.USE_DB === "true" && process.env.DATABASE_URL) {
  try {
    const mod = await import("./db-storage");
    const PostgreSQLStorage = (mod as any).PostgreSQLStorage;
    if (PostgreSQLStorage) {
      storageImpl = new PostgreSQLStorage();
    }
  } catch (_e) {
    // fall back to MemStorage if db-storage cannot be loaded
    storageImpl = new MemStorage();
  }
}

export const storage = storageImpl;
