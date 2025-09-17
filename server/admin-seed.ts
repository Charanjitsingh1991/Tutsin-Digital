import { storage } from "./storage";
import bcrypt from "bcryptjs";

export async function seedAdminData() {
  try {
    // Create default admin roles
    const superAdminRole = await storage.createAdminRole({
      name: "super_admin",
      description: "Super Administrator with full system access",
      permissions: [
        "manage_admins",
        "manage_roles", 
        "manage_clients",
        "manage_content",
        "manage_projects",
        "view_analytics",
        "system_settings"
      ]
    });

    const adminRole = await storage.createAdminRole({
      name: "admin",
      description: "Administrator with most system access",
      permissions: [
        "manage_clients",
        "manage_content", 
        "manage_projects",
        "view_analytics"
      ]
    });

    const moderatorRole = await storage.createAdminRole({
      name: "moderator",
      description: "Moderator with limited access",
      permissions: [
        "manage_content",
        "view_analytics"
      ]
    });

    // Create default super admin user
    const hashedPassword = await bcrypt.hash("admin123", 12);
    
    const superAdmin = await storage.createAdmin({
      firstName: "Super",
      lastName: "Admin",
      email: "admin@tutsindigital.com",
      password: hashedPassword,
      roleId: superAdminRole.id,
      isActive: true
    });

    console.log("Admin seed data created successfully:");
    console.log("- Super Admin Role:", superAdminRole.name);
    console.log("- Admin Role:", adminRole.name);
    console.log("- Moderator Role:", moderatorRole.name);
    console.log("- Super Admin User:", superAdmin.email);
    console.log("- Default Password: admin123");
    
    return {
      roles: [superAdminRole, adminRole, moderatorRole],
      admins: [superAdmin]
    };
  } catch (error) {
    console.error("Error seeding admin data:", error);
    throw error;
  }
}

