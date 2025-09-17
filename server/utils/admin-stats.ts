import { storage } from '../storage';

export interface DashboardStats {
  totalAdmins: number;
  totalRoles: number;
  totalBlogPosts: number;
  totalProjects: number;
  publishedPosts: number;
  activeProjects: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [admins, roles, blogPosts, projects] = await Promise.all([
      storage.getAllAdmins(),
      storage.getAllAdminRoles(),
      storage.getAllBlogPosts(),
      storage.getAllProjects()
    ]);

    const publishedPosts = blogPosts.filter(post => post.published).length;
    const activeProjects = projects.filter(project => project.status === 'active').length;

    return {
      totalAdmins: admins.length,
      totalRoles: roles.length,
      totalBlogPosts: blogPosts.length,
      totalProjects: projects.length,
      publishedPosts,
      activeProjects
    };
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    return {
      totalAdmins: 0,
      totalRoles: 0,
      totalBlogPosts: 0,
      totalProjects: 0,
      publishedPosts: 0,
      activeProjects: 0
    };
  }
}

