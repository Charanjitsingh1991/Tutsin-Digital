import { type User, type InsertUser, type Client, type InsertClient, type ClientSession, type InsertClientSession, type BlogPost, type InsertBlogPost, type ContactSubmission, type InsertContactSubmission, type PageView, type InsertPageView, type WebsiteMetrics, type InsertWebsiteMetrics, type Project, type InsertProject, type ProjectMilestone, type InsertProjectMilestone, type ProjectTask, type InsertProjectTask, type ProjectComment, type InsertProjectComment } from "@shared/schema";
import { db } from "./db";
import { users, clients, clientSessions, blogPosts, contactSubmissions, pageViews, websiteMetrics, projects, projectMilestones, projectTasks, projectComments } from "@shared/schema";
import { eq, and, gte, lte, desc, asc } from "drizzle-orm";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { IStorage } from "./storage";

export class PostgreSQLStorage implements IStorage {
  constructor() {
    // Seed with sample data on initialization
    this.seedData();
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
}

