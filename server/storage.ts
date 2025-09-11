import { type User, type InsertUser, type Client, type InsertClient, type ClientSession, type InsertClientSession, type BlogPost, type InsertBlogPost, type ContactSubmission, type InsertContactSubmission, type PageView, type InsertPageView, type WebsiteMetrics, type InsertWebsiteMetrics } from "@shared/schema";
import { randomUUID } from "crypto";

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
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private clients: Map<string, Client>;
  private clientSessions: Map<string, ClientSession>;
  private blogPosts: Map<string, BlogPost>;
  private contactSubmissions: Map<string, ContactSubmission>;
  private pageViews: Map<string, PageView>;
  private websiteMetrics: Map<string, WebsiteMetrics>;

  constructor() {
    this.users = new Map();
    this.clients = new Map();
    this.clientSessions = new Map();
    this.blogPosts = new Map();
    this.contactSubmissions = new Map();
    this.pageViews = new Map();
    this.websiteMetrics = new Map();
    
    // Seed with sample blog posts and analytics data
    this.seedBlogPosts();
    this.seedAnalyticsData();
    
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
}

export const storage = new MemStorage();
