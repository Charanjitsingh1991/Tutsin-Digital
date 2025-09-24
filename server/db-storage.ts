import { type User, type InsertUser, type Client, type InsertClient, type ClientSession, type InsertClientSession, type BlogPost, type InsertBlogPost, type ContactSubmission, type InsertContactSubmission, type PageView, type InsertPageView, type WebsiteMetrics, type InsertWebsiteMetrics, type Project, type InsertProject, type ProjectMilestone, type InsertProjectMilestone, type ProjectTask, type InsertProjectTask, type ProjectComment, type InsertProjectComment } from "@shared/schema";
import { db } from "./db";
import { users, clients, clientSessions, blogPosts, contactSubmissions, pageViews, websiteMetrics, projects, projectMilestones, projectTasks, projectComments, admins, adminRoles, adminSessions, notifications, fileUploads } from "@shared/schema";
import { eq, and, gte, lte, desc, asc } from "drizzle-orm";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { IStorage } from "./storage";
import { seedAdminData } from "./admin-seed";

export class PostgreSQLStorage implements IStorage {
  constructor() {
    // Seed with sample data on initialization
    this.seedData();
    // Seed admin data
    this.seedAdminData();
  }

  private async seedAdminData() {
    try {
      // If at least one admin exists, nothing to do
      const existingAdmins = await db.select().from(admins).limit(1);
      if (existingAdmins.length > 0) return;

      // Ensure roles exist (create if missing)
      const existingRoles = await db.select().from(adminRoles).limit(1);
      if (existingRoles.length === 0) {
        await seedAdminData();
        return;
      }

      // Roles exist but no admin: create default super admin
      const superRole = await this.getAdminRoleByName('super_admin');
      const roleId = superRole?.id || existingRoles[0].id;
      const defaultPassword = await bcrypt.hash('admin123', 12);
      await this.createAdmin({
        firstName: 'Super',
        lastName: 'Admin',
        email: 'admin@tutsindigital.com',
        password: defaultPassword,
        roleId,
        isActive: true,
      });
    } catch (error) {
      console.error("Error seeding admin data:", error);
    }
  }

  private async seedData() {
    try {
      // Check if data already exists
      const existingPosts = await db.select().from(blogPosts).limit(1);
      if (existingPosts.length > 0) return;

      // Seed blog posts
      const samplePosts = [
        {
          id: randomUUID(),
          title: "10 Web Design Trends for 2024",
          content: "Discover the latest design trends that are shaping the future of web development and user experience. From AI-powered design tools to immersive 3D elements, learn how to stay ahead of the curve.",
          excerpt: "Discover the latest design trends that are shaping the future of web development and user experience.",
          category: "Web Design",
          imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          published: true,
        },
        {
          id: randomUUID(),
          title: "AI-Powered SEO Strategies",
          content: "Learn how artificial intelligence is revolutionizing search engine optimization and content strategy. Discover tools and techniques that can give your website a competitive edge.",
          excerpt: "Learn how artificial intelligence is revolutionizing search engine optimization and content strategy.",
          category: "SEO",
          imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          published: true,
        },
        {
          id: randomUUID(),
          title: "Social Media ROI Maximization",
          content: "Effective strategies to maximize your return on investment from social media marketing campaigns. Learn advanced targeting techniques and content optimization methods.",
          excerpt: "Effective strategies to maximize your return on investment from social media marketing campaigns.",
          category: "Marketing",
          imageUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
          published: true,
        },
      ];

      await db.insert(blogPosts).values(samplePosts);

      // Seed sample client
      const hashedPassword = bcrypt.hashSync("password123", 10);
      const sampleClient = {
        id: "sample-client-jane-smith-uuid",
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        password: hashedPassword,
        company: "Acme Corp",
        phone: "+1-555-0123",
      };

      await db.insert(clients).values(sampleClient);

      // Seed analytics data for the last 30 days
      const today = new Date();
      const analyticsData = [];
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        analyticsData.push({
          id: randomUUID(),
          date: dateStr,
          totalViews: Math.floor(Math.random() * 500) + 100,
          uniqueVisitors: Math.floor(Math.random() * 300) + 50,
          bounceRate: Math.floor(Math.random() * 40) + 30,
          avgSessionDuration: Math.floor(Math.random() * 300) + 120,
          topPages: ["/", "/services", "/about", "/blog", "/contact"],
          topReferrers: ["google.com", "facebook.com", "linkedin.com", "direct"],
        });
      }

      await db.insert(websiteMetrics).values(analyticsData);

      // Seed sample projects
      const sampleProject = {
        id: "sample-project-website-redesign",
        title: "Website Redesign Project",
        description: "Complete redesign of company website with modern UI/UX and mobile optimization",
        clientId: "sample-client-jane-smith-uuid",
        status: "in_progress",
        priority: "high",
        budget: 2999900, // $29,999 in cents
        startDate: new Date("2024-09-01"),
        endDate: new Date("2024-12-01"),
      };

      await db.insert(projects).values(sampleProject);

      // Seed sample milestones
      const sampleMilestones = [
        {
          id: "milestone-1-discovery",
          projectId: "sample-project-website-redesign",
          title: "Discovery & Planning",
          description: "Research, competitor analysis, and project planning phase",
          status: "completed",
          dueDate: new Date("2024-09-15"),
          completedAt: new Date("2024-09-14"),
          order: 1,
        },
        {
          id: "milestone-2-design",
          projectId: "sample-project-website-redesign",
          title: "Design & Wireframing",
          description: "Create wireframes, mockups, and design system",
          status: "in_progress",
          dueDate: new Date("2024-10-15"),
          order: 2,
        },
        {
          id: "milestone-3-development",
          projectId: "sample-project-website-redesign",
          title: "Development & Implementation",
          description: "Frontend and backend development of the new website",
          status: "pending",
          dueDate: new Date("2024-11-15"),
          order: 3,
        },
        {
          id: "milestone-4-testing",
          projectId: "sample-project-website-redesign",
          title: "Testing & Launch",
          description: "Quality assurance, testing, and website launch",
          status: "pending",
          dueDate: new Date("2024-12-01"),
          order: 4,
        },
      ];

      await db.insert(projectMilestones).values(sampleMilestones);

      // Seed sample tasks
      const sampleTasks = [
        {
          id: "task-1-research",
          projectId: "sample-project-website-redesign",
          milestoneId: "milestone-1-discovery",
          title: "Competitor Analysis",
          description: "Analyze top 5 competitors' websites and identify best practices",
          status: "completed",
          priority: "high",
          estimatedHours: 8,
          actualHours: 6,
          completedAt: new Date("2024-09-10"),
          order: 1,
        },
        {
          id: "task-2-wireframes",
          projectId: "sample-project-website-redesign",
          milestoneId: "milestone-2-design",
          title: "Create Homepage Wireframes",
          description: "Design wireframes for the new homepage layout",
          status: "in_progress",
          priority: "high",
          estimatedHours: 12,
          dueDate: new Date("2024-10-05"),
          order: 2,
        },
        {
          id: "task-3-mockups",
          projectId: "sample-project-website-redesign",
          milestoneId: "milestone-2-design",
          title: "High-Fidelity Mockups",
          description: "Create detailed mockups for all main pages",
          status: "todo",
          priority: "medium",
          estimatedHours: 20,
          dueDate: new Date("2024-10-12"),
          order: 3,
        },
      ];

      await db.insert(projectTasks).values(sampleTasks);

      // Seed sample comments
      const sampleComments = [
        {
          id: "comment-1-feedback",
          projectId: "sample-project-website-redesign",
          authorId: "sample-client-jane-smith-uuid",
          content: "Great progress on the discovery phase! I'm excited to see the wireframes.",
          isInternal: false,
        },
        {
          id: "comment-2-update",
          projectId: "sample-project-website-redesign",
          taskId: "task-2-wireframes",
          authorId: "sample-client-jane-smith-uuid",
          content: "Could we add a testimonials section to the homepage wireframe?",
          isInternal: false,
        },
      ];

      await db.insert(projectComments).values(sampleComments);

      console.log("Database seeded successfully");
    } catch (error) {
      console.error("Error seeding database:", error);
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getClient(id: string): Promise<Client | undefined> {
    const result = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
    return result[0];
  }

  async getClientByEmail(email: string): Promise<Client | undefined> {
    const result = await db.select().from(clients).where(eq(clients.email, email)).limit(1);
    return result[0];
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const result = await db.insert(clients).values(insertClient).returning();
    return result[0];
  }

  async updateClient(id: string, updateData: Partial<InsertClient>): Promise<Client | undefined> {
    const result = await db.update(clients)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(clients.id, id))
      .returning();
    return result[0];
  }

  async createClientSession(insertSession: InsertClientSession): Promise<ClientSession> {
    const result = await db.insert(clientSessions).values(insertSession).returning();
    return result[0];
  }

  async getClientSession(token: string): Promise<ClientSession | undefined> {
    const result = await db.select().from(clientSessions)
      .where(and(
        eq(clientSessions.token, token),
        gte(clientSessions.expiresAt, new Date())
      ))
      .limit(1);
    return result[0];
  }

  async deleteClientSession(token: string): Promise<boolean> {
    const result = await db.delete(clientSessions).where(eq(clientSessions.token, token));
    return result.rowCount > 0;
  }

  async cleanExpiredSessions(): Promise<void> {
    await db.delete(clientSessions).where(lte(clientSessions.expiresAt, new Date()));
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  }

  async getPublishedBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts)
      .where(eq(blogPosts.published, true))
      .orderBy(desc(blogPosts.createdAt));
  }

  async getBlogPost(id: string): Promise<BlogPost | undefined> {
    const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
    return result[0];
  }

  async createBlogPost(insertPost: InsertBlogPost): Promise<BlogPost> {
    const result = await db.insert(blogPosts).values(insertPost).returning();
    return result[0];
  }

  async updateBlogPost(id: string, updateData: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const result = await db.update(blogPosts)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(blogPosts.id, id))
      .returning();
    return result[0];
  }

  async deleteBlogPost(id: string): Promise<boolean> {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id));
    return result.rowCount > 0;
  }

  async createContactSubmission(insertSubmission: InsertContactSubmission): Promise<ContactSubmission> {
    const result = await db.insert(contactSubmissions).values(insertSubmission).returning();
    return result[0];
  }

  async getContactSubmissions(): Promise<ContactSubmission[]> {
    return await db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt));
  }

  async createPageView(insertPageView: InsertPageView): Promise<PageView> {
    const result = await db.insert(pageViews).values(insertPageView).returning();
    return result[0];
  }

  async getPageViews(startDate?: Date, endDate?: Date): Promise<PageView[]> {
    let query = db.select().from(pageViews);
    
    if (startDate && endDate) {
      query = query.where(and(
        gte(pageViews.timestamp, startDate),
        lte(pageViews.timestamp, endDate)
      ));
    } else if (startDate) {
      query = query.where(gte(pageViews.timestamp, startDate));
    } else if (endDate) {
      query = query.where(lte(pageViews.timestamp, endDate));
    }
    
    return await query;
  }

  async createWebsiteMetrics(insertMetrics: InsertWebsiteMetrics): Promise<WebsiteMetrics> {
    const result = await db.insert(websiteMetrics).values(insertMetrics).returning();
    return result[0];
  }

  async getWebsiteMetrics(date: string): Promise<WebsiteMetrics | undefined> {
    const result = await db.select().from(websiteMetrics).where(eq(websiteMetrics.date, date)).limit(1);
    return result[0];
  }

  async getWebsiteMetricsRange(startDate: string, endDate: string): Promise<WebsiteMetrics[]> {
    return await db.select().from(websiteMetrics)
      .where(and(
        gte(websiteMetrics.date, startDate),
        lte(websiteMetrics.date, endDate)
      ))
      .orderBy(asc(websiteMetrics.date));
  }

  async updateWebsiteMetrics(date: string, updateData: Partial<InsertWebsiteMetrics>): Promise<WebsiteMetrics | undefined> {
    const result = await db.update(websiteMetrics)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(websiteMetrics.date, date))
      .returning();
    return result[0];
  }

  // Project management methods
  async createProject(insertProject: InsertProject): Promise<Project> {
    const result = await db.insert(projects).values(insertProject).returning();
    return result[0];
  }

  async getProject(id: string): Promise<Project | undefined> {
    const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
    return result[0];
  }

  async getProjectsByClient(clientId: string): Promise<Project[]> {
    return await db.select().from(projects)
      .where(eq(projects.clientId, clientId))
      .orderBy(desc(projects.createdAt));
  }

  async getAllProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(desc(projects.createdAt));
  }

  async updateProject(id: string, updateData: Partial<InsertProject>): Promise<Project | undefined> {
    const result = await db.update(projects)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return result[0];
  }

  async deleteProject(id: string): Promise<boolean> {
    const result = await db.delete(projects).where(eq(projects.id, id));
    return result.rowCount > 0;
  }

  // Project milestone methods
  async createProjectMilestone(insertMilestone: InsertProjectMilestone): Promise<ProjectMilestone> {
    const result = await db.insert(projectMilestones).values(insertMilestone).returning();
    return result[0];
  }

  async getProjectMilestone(id: string): Promise<ProjectMilestone | undefined> {
    const result = await db.select().from(projectMilestones).where(eq(projectMilestones.id, id)).limit(1);
    return result[0];
  }

  async getProjectMilestones(projectId: string): Promise<ProjectMilestone[]> {
    return await db.select().from(projectMilestones)
      .where(eq(projectMilestones.projectId, projectId))
      .orderBy(asc(projectMilestones.dueDate));
  }

  async updateProjectMilestone(id: string, updateData: Partial<InsertProjectMilestone>): Promise<ProjectMilestone | undefined> {
    const result = await db.update(projectMilestones)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(projectMilestones.id, id))
      .returning();
    return result[0];
  }

  async deleteProjectMilestone(id: string): Promise<boolean> {
    const result = await db.delete(projectMilestones).where(eq(projectMilestones.id, id));
    return result.rowCount > 0;
  }

  // Project task methods
  async createProjectTask(insertTask: InsertProjectTask): Promise<ProjectTask> {
    const result = await db.insert(projectTasks).values(insertTask).returning();
    return result[0];
  }

  async getProjectTask(id: string): Promise<ProjectTask | undefined> {
    const result = await db.select().from(projectTasks).where(eq(projectTasks.id, id)).limit(1);
    return result[0];
  }

  async getProjectTasks(projectId: string): Promise<ProjectTask[]> {
    return await db.select().from(projectTasks)
      .where(eq(projectTasks.projectId, projectId))
      .orderBy(asc(projectTasks.createdAt));
  }

  async getTasksByMilestone(milestoneId: string): Promise<ProjectTask[]> {
    return await db.select().from(projectTasks)
      .where(eq(projectTasks.milestoneId, milestoneId))
      .orderBy(asc(projectTasks.createdAt));
  }

  async updateProjectTask(id: string, updateData: Partial<InsertProjectTask>): Promise<ProjectTask | undefined> {
    const result = await db.update(projectTasks)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(projectTasks.id, id))
      .returning();
    return result[0];
  }

  async deleteProjectTask(id: string): Promise<boolean> {
    const result = await db.delete(projectTasks).where(eq(projectTasks.id, id));
    return result.rowCount > 0;
  }

  // Project comment methods
  async createProjectComment(insertComment: InsertProjectComment): Promise<ProjectComment> {
    const result = await db.insert(projectComments).values(insertComment).returning();
    return result[0];
  }

  async getProjectComments(projectId: string, includeInternal: boolean = true): Promise<ProjectComment[]> {
    let query = db.select().from(projectComments)
      .where(eq(projectComments.projectId, projectId));
    
    if (!includeInternal) {
      query = query.where(and(
        eq(projectComments.projectId, projectId),
        eq(projectComments.isInternal, false)
      ));
    }
    
    return await query.orderBy(asc(projectComments.createdAt));
  }

  async getTaskComments(taskId: string, includeInternal: boolean = true): Promise<ProjectComment[]> {
    let query = db.select().from(projectComments)
      .where(eq(projectComments.taskId, taskId));
    
    if (!includeInternal) {
      query = query.where(and(
        eq(projectComments.taskId, taskId),
        eq(projectComments.isInternal, false)
      ));
    }
    
    return await query.orderBy(asc(projectComments.createdAt));
  }

  async getMilestoneComments(milestoneId: string, includeInternal: boolean = true): Promise<ProjectComment[]> {
    let query = db.select().from(projectComments)
      .where(eq(projectComments.milestoneId, milestoneId));
    
    if (!includeInternal) {
      query = query.where(and(
        eq(projectComments.milestoneId, milestoneId),
        eq(projectComments.isInternal, false)
      ));
    }
    
    return await query.orderBy(asc(projectComments.createdAt));
  }

  async updateProjectComment(id: string, updateData: Partial<InsertProjectComment>): Promise<ProjectComment | undefined> {
    const result = await db.update(projectComments)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(projectComments.id, id))
      .returning();
    return result[0];
  }

  async deleteProjectComment(id: string): Promise<boolean> {
    const result = await db.delete(projectComments).where(eq(projectComments.id, id));
    return result.rowCount > 0;
  }

  // Admin methods implementation
  async createAdmin(adminData: any): Promise<any> {
    // Avoid double-hashing if password already looks like a bcrypt hash
    const needsHash = typeof adminData.password === 'string' && !adminData.password.startsWith('$2');
    const password = needsHash ? await bcrypt.hash(adminData.password, 10) : adminData.password;
    const result = await db.insert(admins).values({
      id: randomUUID(),
      ...adminData,
      password,
    }).returning();
    return result[0];
  }

  async getAdminByEmail(email: string): Promise<any> {
    const result = await db.select().from(admins).where(eq(admins.email, email));
    return result[0];
  }

  async getAdminById(id: string): Promise<any> {
    const result = await db.select().from(admins).where(eq(admins.id, id));
    return result[0];
  }

  async getAllAdmins(): Promise<any[]> {
    return await db.select().from(admins).orderBy(desc(admins.createdAt));
  }

  async updateAdmin(id: string, updateData: any): Promise<any> {
    if (updateData.password && !String(updateData.password).startsWith('$2')) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    const result = await db.update(admins)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(admins.id, id))
      .returning();
    return result[0];
  }

  async deleteAdmin(id: string): Promise<boolean> {
    const result = await db.delete(admins).where(eq(admins.id, id));
    return result.rowCount > 0;
  }

  async createAdminRole(roleData: any): Promise<any> {
    const result = await db.insert(adminRoles).values({
      id: randomUUID(),
      ...roleData,
    }).returning();
    return result[0];
  }

  async getAllAdminRoles(): Promise<any[]> {
    return await db.select().from(adminRoles).orderBy(asc(adminRoles.name));
  }

  async getAdminRoleById(id: string): Promise<any> {
    const result = await db.select().from(adminRoles).where(eq(adminRoles.id, id));
    return result[0];
  }

  async updateAdminRole(id: string, updateData: any): Promise<any> {
    const result = await db.update(adminRoles)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(adminRoles.id, id))
      .returning();
    return result[0];
  }

  async deleteAdminRole(id: string): Promise<boolean> {
    const result = await db.delete(adminRoles).where(eq(adminRoles.id, id));
    return result.rowCount > 0;
  }

  async createAdminSession(sessionData: any): Promise<any> {
    const result = await db.insert(adminSessions).values({
      id: randomUUID(),
      ...sessionData,
    }).returning();
    return result[0];
  }

  async getAdminSession(token: string): Promise<any> {
    const result = await db.select().from(adminSessions).where(eq(adminSessions.token, token));
    return result[0];
  }

  async deleteAdminSession(token: string): Promise<boolean> {
    const result = await db.delete(adminSessions).where(eq(adminSessions.token, token));
    return result.rowCount > 0;
  }

  async createNotification(notificationData: any): Promise<any> {
    const result = await db.insert(notifications).values({
      id: randomUUID(),
      ...notificationData,
    }).returning();
    return result[0];
  }

  async getNotifications(userId?: string, adminId?: string): Promise<any[]> {
    let query = db.select().from(notifications);
    
    if (userId) {
      query = query.where(eq(notifications.userId, userId));
    } else if (adminId) {
      query = query.where(eq(notifications.adminId, adminId));
    }
    
    return await query.orderBy(desc(notifications.createdAt));
  }

  async markNotificationAsRead(id: string): Promise<any> {
    const result = await db.update(notifications)
      .set({ isRead: true, updatedAt: new Date() })
      .where(eq(notifications.id, id))
      .returning();
    return result[0];
  }

  async deleteNotification(id: string): Promise<boolean> {
    const result = await db.delete(notifications).where(eq(notifications.id, id));
    return result.rowCount > 0;
  }

  async createFileUpload(fileData: any): Promise<any> {
    const result = await db.insert(fileUploads).values({
      id: randomUUID(),
      ...fileData,
    }).returning();
    return result[0];
  }

  async getFileUploads(userId?: string): Promise<any[]> {
    let query = db.select().from(fileUploads);
    
    if (userId) {
      query = query.where(eq(fileUploads.uploadedBy, userId));
    }
    
    return await query.orderBy(desc(fileUploads.createdAt));
  }

  async deleteFileUpload(id: string): Promise<boolean> {
    const result = await db.delete(fileUploads).where(eq(fileUploads.id, id));
    return result.rowCount > 0;
  }
}

