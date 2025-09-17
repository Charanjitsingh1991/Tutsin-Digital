import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { storage } from '../storage';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AdminRequest extends Request {
  admin?: any;
}

export const adminAuth = async (req: AdminRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7);
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      const admin = await storage.getAdminById(decoded.adminId);
      
      if (!admin || !admin.isActive) {
        return res.status(401).json({ error: 'Invalid or inactive admin' });
      }

      // Get admin role
      const role = await storage.getAdminRoleById(admin.roleId);
      admin.role = role?.name;
      admin.permissions = role?.permissions || [];

      req.admin = admin;
      next();
    } catch (jwtError) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    console.error('Admin auth middleware error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const requirePermission = (permission: string) => {
  return (req: AdminRequest, res: Response, next: NextFunction) => {
    if (!req.admin) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Super admin has all permissions
    if (req.admin.role === 'super_admin') {
      return next();
    }

    if (!req.admin.permissions || !req.admin.permissions.includes(permission)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

