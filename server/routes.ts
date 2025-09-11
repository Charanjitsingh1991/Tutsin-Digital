import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBlogPostSchema, insertContactSubmissionSchema, insertClientSchema, loginClientSchema, insertPageViewSchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

// Helper function to generate session tokens
function generateSessionToken(): string {
  return randomUUID() + '-' + Date.now().toString(36);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Client Authentication API
  app.post("/api/auth/register", async (req, res) => {
    try {
      const clientData = insertClientSchema.parse(req.body);
      
      // Check if client already exists
      const existingClient = await storage.getClientByEmail(clientData.email);
      if (existingClient) {
        return res.status(400).json({ message: "Email already registered" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(clientData.password, 10);
      
      // Create client
      const client = await storage.createClient({
        ...clientData,
        password: hashedPassword,
      });
      
      // Create session
      const token = generateSessionToken();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      
      await storage.createClientSession({
        clientId: client.id,
        token,
        expiresAt,
      });
      
      res.status(201).json({ 
        message: "Registration successful", 
        token,
        client: { 
          id: client.id, 
          firstName: client.firstName, 
          lastName: client.lastName, 
          email: client.email,
          company: client.company,
          phone: client.phone
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid registration data", errors: error.errors });
      }
      res.status(500).json({ message: "Registration failed" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginClientSchema.parse(req.body);
      
      // Find client
      const client = await storage.getClientByEmail(email);
      if (!client) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Verify password
      const isValidPassword = await bcrypt.compare(password, client.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Create session
      const token = generateSessionToken();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      
      await storage.createClientSession({
        clientId: client.id,
        token,
        expiresAt,
      });
      
      res.json({ 
        message: "Login successful", 
        token,
        client: { 
          id: client.id, 
          firstName: client.firstName, 
          lastName: client.lastName, 
          email: client.email,
          company: client.company,
          phone: client.phone
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid login data", errors: error.errors });
      }
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (token) {
        await storage.deleteClientSession(token);
      }
      res.json({ message: "Logout successful" });
    } catch (error) {
      res.status(500).json({ message: "Logout failed" });
    }
  });

  app.get("/api/auth/me", async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }
      
      const session = await storage.getClientSession(token);
      if (!session) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }
      
      const client = await storage.getClient(session.clientId);
      if (!client) {
        return res.status(401).json({ message: "Client not found" });
      }
      
      res.json({ 
        client: { 
          id: client.id, 
          firstName: client.firstName, 
          lastName: client.lastName, 
          email: client.email,
          company: client.company,
          phone: client.phone
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get user info" });
    }
  });

  // Blog Posts API
  app.get("/api/blog/posts", async (req, res) => {
    try {
      const posts = await storage.getPublishedBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/posts/:id", async (req, res) => {
    try {
      const post = await storage.getBlogPost(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Admin Blog Posts API (all posts including unpublished)
  app.get("/api/admin/blog/posts", async (req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.post("/api/admin/blog/posts", async (req, res) => {
    try {
      const postData = insertBlogPostSchema.parse(req.body);
      const post = await storage.createBlogPost(postData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid post data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create blog post" });
    }
  });

  app.put("/api/admin/blog/posts/:id", async (req, res) => {
    try {
      const postData = insertBlogPostSchema.partial().parse(req.body);
      const post = await storage.updateBlogPost(req.params.id, postData);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid post data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update blog post" });
    }
  });

  app.delete("/api/admin/blog/posts/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteBlogPost(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // Contact API
  app.post("/api/contact", async (req, res) => {
    try {
      const submissionData = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(submissionData);
      res.status(201).json({ message: "Message sent successfully!", submission });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid form data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  app.get("/api/admin/contact", async (req, res) => {
    try {
      const submissions = await storage.getContactSubmissions();
      res.json(submissions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contact submissions" });
    }
  });

  // Analytics API
  app.post("/api/analytics/pageview", async (req, res) => {
    try {
      const pageViewData = insertPageViewSchema.parse(req.body);
      const pageView = await storage.createPageView(pageViewData);
      res.status(201).json({ message: "Page view recorded", pageView });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid page view data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to record page view" });
    }
  });

  app.get("/api/analytics/metrics", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "startDate and endDate query parameters are required" });
      }
      
      const metrics = await storage.getWebsiteMetricsRange(
        startDate as string, 
        endDate as string
      );
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics metrics" });
    }
  });

  app.get("/api/analytics/metrics/:date", async (req, res) => {
    try {
      const { date } = req.params;
      const metrics = await storage.getWebsiteMetrics(date);
      
      if (!metrics) {
        return res.status(404).json({ message: "Metrics not found for this date" });
      }
      
      res.json(metrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch metrics for date" });
    }
  });

  app.get("/api/analytics/overview", async (req, res) => {
    try {
      // Get metrics for the last 30 days
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      const metrics = await storage.getWebsiteMetricsRange(startDate, endDate);
      
      // Calculate summary statistics
      const totalViews = metrics.reduce((sum, m) => sum + m.totalViews, 0);
      const totalUniqueVisitors = metrics.reduce((sum, m) => sum + m.uniqueVisitors, 0);
      const avgBounceRate = metrics.length > 0 ? 
        Math.round(metrics.reduce((sum, m) => sum + m.bounceRate, 0) / metrics.length) : 0;
      const avgSessionDuration = metrics.length > 0 ? 
        Math.round(metrics.reduce((sum, m) => sum + m.avgSessionDuration, 0) / metrics.length) : 0;
      
      // Get top pages and referrers from the most recent data
      const recentMetrics = metrics.slice(-7); // Last 7 days
      const topPagesMap = new Map<string, number>();
      const topReferrersMap = new Map<string, number>();
      
      recentMetrics.forEach(m => {
        m.topPages?.forEach(page => {
          topPagesMap.set(page, (topPagesMap.get(page) || 0) + 1);
        });
        m.topReferrers?.forEach(referrer => {
          topReferrersMap.set(referrer, (topReferrersMap.get(referrer) || 0) + 1);
        });
      });
      
      const topPages = Array.from(topPagesMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([page, count]) => ({ page, views: count }));
        
      const topReferrers = Array.from(topReferrersMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([referrer, count]) => ({ referrer, visits: count }));
      
      res.json({
        summary: {
          totalViews,
          totalUniqueVisitors,
          avgBounceRate,
          avgSessionDuration,
        },
        topPages,
        topReferrers,
        dailyMetrics: metrics.slice(-7), // Last 7 days for charts
        period: { startDate, endDate }
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics overview" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
