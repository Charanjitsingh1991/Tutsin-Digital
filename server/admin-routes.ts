import type { Express, Request, Response, NextFunction } from "express";
import { storage } from "./storage";
import { insertAdminSchema, loginAdminSchema, insertAdminRoleSchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

// Helper function to generate admin session tokens
function generateAdminSessionToken(): string {
  return 'admin_' + randomUUID() + '-' + Date.now().toString(36);
}

// Admin authentication middleware
export async function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: "No admin token provided" });
    }
    
    const session = await storage.getAdminSession(token);
    if (!session) {
      return res.status(401).json({ message: "Invalid or expired admin token" });
    }
    
    const admin = await storage.getAdmin(session.adminId);
    if (!admin || !admin.isActive) {
      return res.status(401).json({ message: "Admin account not found or inactive" });
    }
    
    // Add admin info to request
    (req as any).admin = admin;
    (req as any).adminSession = session;
    
    next();
  } catch (error) {
    res.status(500).json({ message: "Admin authentication failed" });
  }
}

// Permission checking middleware
export function requirePermission(permission: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const admin = (req as any).admin;
      if (!admin) {
        return res.status(401).json({ message: "Admin authentication required" });
      }
      
      const role = await storage.getAdminRole(admin.roleId);
      if (!role) {
        return res.status(403).json({ message: "Admin role not found" });
      }
      
      // Super admin has all permissions
      if (role.name === 'super_admin') {
        return next();
      }
      
      // Check if admin has the required permission
      if (!role.permissions || !role.permissions.includes(permission)) {
        return res.status(403).json({ message: "Insufficient permissions" });
      }
      
      next();
    } catch (error) {
      res.status(500).json({ message: "Permission check failed" });
    }
  };
}

export async function registerAdminRoutes(app: Express): Promise<void> {
  // Admin Authentication Routes
  app.post("/api/admin/auth/login", async (req, res) => {
    try {
      const { email, password } = loginAdminSchema.parse(req.body);
      
      // Find admin
      const admin = await storage.getAdminByEmail(email);
      if (!admin) {
        return res.status(401).json({ message: "Invalid admin credentials" });
      }
      
      // Check if admin is active
      if (!admin.isActive) {
        return res.status(401).json({ message: "Admin account is inactive" });
      }
      
      // Verify password
      const isValidPassword = await bcrypt.compare(password, admin.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid admin credentials" });
      }
      
      // Update last login
      await storage.updateAdmin(admin.id, { lastLoginAt: new Date() });
      
      // Create session
      const token = generateAdminSessionToken();
      const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000); // 8 hours
      
      await storage.createAdminSession({
        adminId: admin.id,
        token,
        expiresAt,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent') || null,
      });
      
      // Get admin role
      const role = await storage.getAdminRole(admin.roleId);
      
      res.json({ 
        message: "Admin login successful", 
        token,
        admin: { 
          id: admin.id, 
          firstName: admin.firstName, 
          lastName: admin.lastName, 
          email: admin.email,
          role: role?.name || 'unknown',
          permissions: role?.permissions || []
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid login data", errors: error.errors });
      }
      res.status(500).json({ message: "Admin login failed" });
    }
  });

  app.post("/api/admin/auth/logout", requireAdminAuth, async (req, res) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (token) {
        await storage.deleteAdminSession(token);
      }
      res.json({ message: "Admin logout successful" });
    } catch (error) {
      res.status(500).json({ message: "Admin logout failed" });
    }
  });

  app.get("/api/admin/auth/me", requireAdminAuth, async (req, res) => {
    try {
      const admin = (req as any).admin;
      const role = await storage.getAdminRole(admin.roleId);
      
      res.json({ 
        admin: { 
          id: admin.id, 
          firstName: admin.firstName, 
          lastName: admin.lastName, 
          email: admin.email,
          role: role?.name || 'unknown',
          permissions: role?.permissions || [],
          lastLoginAt: admin.lastLoginAt
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get admin info" });
    }
  });

  // Admin Management Routes
  app.get("/api/admin/admins", requireAdminAuth, requirePermission('manage_admins'), async (req, res) => {
    try {
      const admins = await storage.getAllAdmins();
      const adminsWithRoles = await Promise.all(
        admins.map(async (admin) => {
          const role = await storage.getAdminRole(admin.roleId);
          return {
            ...admin,
            password: undefined, // Don't send password
            role: role?.name || 'unknown'
          };
        })
      );
      res.json(adminsWithRoles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch admins" });
    }
  });

  app.post("/api/admin/admins", requireAdminAuth, requirePermission('manage_admins'), async (req, res) => {
    try {
      const adminData = insertAdminSchema.parse(req.body);
      
      // Check if admin already exists
      const existingAdmin = await storage.getAdminByEmail(adminData.email);
      if (existingAdmin) {
        return res.status(400).json({ message: "Admin email already exists" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(adminData.password, 12);
      
      // Create admin
      const admin = await storage.createAdmin({
        ...adminData,
        password: hashedPassword,
      });
      
      const role = await storage.getAdminRole(admin.roleId);
      
      res.status(201).json({ 
        message: "Admin created successfully", 
        admin: {
          ...admin,
          password: undefined,
          role: role?.name || 'unknown'
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid admin data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create admin" });
    }
  });

  app.put("/api/admin/admins/:id", requireAdminAuth, requirePermission('manage_admins'), async (req, res) => {
    try {
      const updateData = insertAdminSchema.partial().parse(req.body);
      
      // Hash password if provided
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 12);
      }
      
      const admin = await storage.updateAdmin(req.params.id, updateData);
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }
      
      const role = await storage.getAdminRole(admin.roleId);
      
      res.json({ 
        message: "Admin updated successfully", 
        admin: {
          ...admin,
          password: undefined,
          role: role?.name || 'unknown'
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid admin data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update admin" });
    }
  });

  app.delete("/api/admin/admins/:id", requireAdminAuth, requirePermission('manage_admins'), async (req, res) => {
    try {
      const currentAdmin = (req as any).admin;
      
      // Prevent admin from deleting themselves
      if (currentAdmin.id === req.params.id) {
        return res.status(400).json({ message: "Cannot delete your own admin account" });
      }
      
      const deleted = await storage.deleteAdmin(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Admin not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete admin" });
    }
  });

  // Admin Role Management Routes
  app.get("/api/admin/roles", requireAdminAuth, async (req, res) => {
    try {
      const roles = await storage.getAllAdminRoles();
      res.json(roles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch admin roles" });
    }
  });

  app.post("/api/admin/roles", requireAdminAuth, requirePermission('manage_roles'), async (req, res) => {
    try {
      const roleData = insertAdminRoleSchema.parse(req.body);
      
      // Check if role already exists
      const existingRole = await storage.getAdminRoleByName(roleData.name);
      if (existingRole) {
        return res.status(400).json({ message: "Role name already exists" });
      }
      
      const role = await storage.createAdminRole(roleData);
      res.status(201).json({ message: "Role created successfully", role });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid role data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create role" });
    }
  });

  app.put("/api/admin/roles/:id", requireAdminAuth, requirePermission('manage_roles'), async (req, res) => {
    try {
      const updateData = insertAdminRoleSchema.partial().parse(req.body);
      const role = await storage.updateAdminRole(req.params.id, updateData);
      
      if (!role) {
        return res.status(404).json({ message: "Role not found" });
      }
      
      res.json({ message: "Role updated successfully", role });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid role data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update role" });
    }
  });

  app.delete("/api/admin/roles/:id", requireAdminAuth, requirePermission('manage_roles'), async (req, res) => {
    try {
      // Check if any admins are using this role
      const admins = await storage.getAllAdmins();
      const roleInUse = admins.some(admin => admin.roleId === req.params.id);
      
      if (roleInUse) {
        return res.status(400).json({ message: "Cannot delete role that is assigned to admins" });
      }
      
      const deleted = await storage.deleteAdminRole(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Role not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete role" });
    }
  });

  // Client Management Routes (Admin view)
  app.get("/api/admin/clients", requireAdminAuth, requirePermission('manage_clients'), async (req, res) => {
    try {
      // This would need to be implemented in storage
      // For now, we'll return an empty array
      res.json([]);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch clients" });
    }
  });

  // Dashboard Analytics Routes
  app.get("/api/admin/dashboard/stats", requireAdminAuth, async (req, res) => {
    try {
      // Get basic stats for dashboard
      const [admins, roles, blogPosts, projects] = await Promise.all([
        storage.getAllAdmins(),
        storage.getAllAdminRoles(),
        storage.getBlogPosts(),
        storage.getAllProjects()
      ]);
      
      const stats = {
        totalAdmins: admins.length,
        totalRoles: roles.length,
        totalBlogPosts: blogPosts.length,
        totalProjects: projects.length,
        publishedPosts: blogPosts.filter(post => post.published).length,
        activeProjects: projects.filter(project => project.status === 'active').length
      };
      
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });
}

