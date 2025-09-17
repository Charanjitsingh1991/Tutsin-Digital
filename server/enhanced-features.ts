import type { Express } from "express";
import { storage } from "./storage";
import { requireAdminAuth, requirePermission } from "./admin-routes";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images and documents
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

export async function registerEnhancedFeatures(app: Express): Promise<void> {
  
  // File Upload Management
  app.post("/api/admin/files/upload", requireAdminAuth, upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const admin = (req as any).admin;
      const fileData = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path,
        uploadedBy: admin.id,
      };

      const fileRecord = await storage.createFileUpload(fileData);
      
      res.json({ 
        message: "File uploaded successfully", 
        file: fileRecord 
      });
    } catch (error) {
      res.status(500).json({ message: "File upload failed" });
    }
  });

  app.get("/api/admin/files", requireAdminAuth, async (req, res) => {
    try {
      const files = await storage.getFileUploads();
      res.json(files);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch files" });
    }
  });

  app.delete("/api/admin/files/:id", requireAdminAuth, async (req, res) => {
    try {
      const fileId = req.params.id;
      const files = await storage.getFileUploads();
      const file = files.find(f => f.id === fileId);
      
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }

      // Delete physical file
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      // Delete database record
      await storage.deleteFileUpload(fileId);
      
      res.json({ message: "File deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete file" });
    }
  });

  // Notification System
  app.get("/api/admin/notifications", requireAdminAuth, async (req, res) => {
    try {
      const admin = (req as any).admin;
      const notifications = await storage.getNotifications(undefined, admin.id);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.post("/api/admin/notifications", requireAdminAuth, async (req, res) => {
    try {
      const { title, message, type = 'info', userId, adminId } = req.body;
      const currentAdmin = (req as any).admin;

      if (!title || !message) {
        return res.status(400).json({ message: "Title and message are required" });
      }

      const notificationData = {
        title,
        message,
        type,
        userId: userId || null,
        adminId: adminId || null,
        createdBy: currentAdmin.id,
      };

      const notification = await storage.createNotification(notificationData);
      res.status(201).json({ message: "Notification created", notification });
    } catch (error) {
      res.status(500).json({ message: "Failed to create notification" });
    }
  });

  app.put("/api/admin/notifications/:id/read", requireAdminAuth, async (req, res) => {
    try {
      const notification = await storage.markNotificationAsRead(req.params.id);
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }
      res.json({ message: "Notification marked as read", notification });
    } catch (error) {
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  app.delete("/api/admin/notifications/:id", requireAdminAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteNotification(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Notification not found" });
      }
      res.json({ message: "Notification deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete notification" });
    }
  });

  // Enhanced Blog Management
  app.get("/api/admin/blog/posts", requireAdminAuth, requirePermission('manage_content'), async (req, res) => {
    try {
      const posts = await storage.getBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.post("/api/admin/blog/posts", requireAdminAuth, requirePermission('manage_content'), async (req, res) => {
    try {
      const { title, content, excerpt, category, imageUrl, published = false } = req.body;

      if (!title || !content || !excerpt || !category) {
        return res.status(400).json({ message: "Title, content, excerpt, and category are required" });
      }

      const postData = {
        title,
        content,
        excerpt,
        category,
        imageUrl: imageUrl || null,
        published,
      };

      const post = await storage.createBlogPost(postData);
      res.status(201).json({ message: "Blog post created", post });
    } catch (error) {
      res.status(500).json({ message: "Failed to create blog post" });
    }
  });

  app.put("/api/admin/blog/posts/:id", requireAdminAuth, requirePermission('manage_content'), async (req, res) => {
    try {
      const updateData = req.body;
      const post = await storage.updateBlogPost(req.params.id, updateData);
      
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      
      res.json({ message: "Blog post updated", post });
    } catch (error) {
      res.status(500).json({ message: "Failed to update blog post" });
    }
  });

  app.delete("/api/admin/blog/posts/:id", requireAdminAuth, requirePermission('manage_content'), async (req, res) => {
    try {
      const deleted = await storage.deleteBlogPost(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json({ message: "Blog post deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  // Contact Management
  app.get("/api/admin/contact", requireAdminAuth, requirePermission('manage_content'), async (req, res) => {
    try {
      const contacts = await storage.getContactSubmissions();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contact submissions" });
    }
  });

  // System Health Check
  app.get("/api/admin/system/health", requireAdminAuth, requirePermission('system_settings'), async (req, res) => {
    try {
      const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        version: process.version,
        environment: process.env.NODE_ENV || 'development',
      };
      
      res.json(health);
    } catch (error) {
      res.status(500).json({ message: "Failed to get system health" });
    }
  });

  // Backup and Maintenance
  app.post("/api/admin/system/backup", requireAdminAuth, requirePermission('system_settings'), async (req, res) => {
    try {
      // This would implement actual backup logic
      // For now, we'll just return a success message
      const backupInfo = {
        id: `backup_${Date.now()}`,
        timestamp: new Date().toISOString(),
        status: 'completed',
        size: '2.4MB', // Mock size
      };
      
      res.json({ message: "Backup created successfully", backup: backupInfo });
    } catch (error) {
      res.status(500).json({ message: "Failed to create backup" });
    }
  });

  app.post("/api/admin/system/cache/clear", requireAdminAuth, requirePermission('system_settings'), async (req, res) => {
    try {
      // This would implement actual cache clearing logic
      // For now, we'll just return a success message
      res.json({ message: "Cache cleared successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to clear cache" });
    }
  });

  // Analytics Enhancement
  app.get("/api/admin/analytics/overview", requireAdminAuth, requirePermission('view_analytics'), async (req, res) => {
    try {
      // Mock analytics data - in a real app, this would come from actual analytics
      const analytics = {
        summary: {
          totalViews: 12543,
          totalUniqueVisitors: 8921,
          avgBounceRate: 34,
          avgSessionDuration: 245, // seconds
        },
        topPages: [
          { page: '/', views: 4521 },
          { page: '/services', views: 2134 },
          { page: '/web-design', views: 1876 },
          { page: '/blog', views: 1432 },
          { page: '/hosting', views: 987 },
        ],
        topReferrers: [
          { referrer: 'google.com', visits: 5432 },
          { referrer: 'facebook.com', visits: 1234 },
          { referrer: 'twitter.com', visits: 876 },
          { referrer: 'linkedin.com', visits: 543 },
          { referrer: 'direct', visits: 2109 },
        ],
        dailyMetrics: [
          { date: '2024-01-15', totalViews: 1234, uniqueVisitors: 876, bounceRate: 32, avgSessionDuration: 234 },
          { date: '2024-01-14', totalViews: 1456, uniqueVisitors: 923, bounceRate: 35, avgSessionDuration: 267 },
          { date: '2024-01-13', totalViews: 1123, uniqueVisitors: 789, bounceRate: 38, avgSessionDuration: 198 },
          { date: '2024-01-12', totalViews: 1678, uniqueVisitors: 1034, bounceRate: 29, avgSessionDuration: 289 },
          { date: '2024-01-11', totalViews: 1345, uniqueVisitors: 867, bounceRate: 33, avgSessionDuration: 245 },
          { date: '2024-01-10', totalViews: 1567, uniqueVisitors: 945, bounceRate: 31, avgSessionDuration: 278 },
          { date: '2024-01-09', totalViews: 1234, uniqueVisitors: 823, bounceRate: 36, avgSessionDuration: 212 },
        ],
        period: {
          startDate: '2024-01-09',
          endDate: '2024-01-15',
        },
      };
      
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });
}

