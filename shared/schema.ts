import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const clients = pgTable("clients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  company: text("company"),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const clientSessions = pgTable("client_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").notNull().references(() => clients.id),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url"),
  published: boolean("published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  service: text("service").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const pageViews = pgTable("page_views", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  path: text("path").notNull(),
  userAgent: text("user_agent"),
  referrer: text("referrer"),
  ip: text("ip"),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const websiteMetrics = pgTable("website_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: varchar("date").notNull(), // YYYY-MM-DD format
  totalViews: integer("total_views").notNull().default(0),
  uniqueVisitors: integer("unique_visitors").notNull().default(0),
  bounceRate: integer("bounce_rate").notNull().default(0), // percentage
  avgSessionDuration: integer("avg_session_duration").notNull().default(0), // seconds
  topPages: text("top_pages").array(), // JSON array of page paths
  topReferrers: text("top_referrers").array(), // JSON array of referrer URLs
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  clientId: varchar("client_id").notNull().references(() => clients.id),
  status: varchar("status").notNull().default("active"), // active, completed, paused, cancelled
  priority: varchar("priority").notNull().default("medium"), // low, medium, high, urgent
  budget: integer("budget"), // in cents
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projectMilestones = pgTable("project_milestones", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull().references(() => projects.id),
  title: text("title").notNull(),
  description: text("description"),
  status: varchar("status").notNull().default("pending"), // pending, in_progress, completed
  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projectTasks = pgTable("project_tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull().references(() => projects.id),
  milestoneId: varchar("milestone_id").references(() => projectMilestones.id),
  title: text("title").notNull(),
  description: text("description"),
  status: varchar("status").notNull().default("todo"), // todo, in_progress, completed, blocked
  priority: varchar("priority").notNull().default("medium"), // low, medium, high, urgent
  estimatedHours: integer("estimated_hours"),
  actualHours: integer("actual_hours"),
  dueDate: timestamp("due_date"),
  completedAt: timestamp("completed_at"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projectComments = pgTable("project_comments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: varchar("project_id").notNull().references(() => projects.id),
  taskId: varchar("task_id").references(() => projectTasks.id),
  milestoneId: varchar("milestone_id").references(() => projectMilestones.id),
  authorId: varchar("author_id").notNull().references(() => clients.id),
  content: text("content").notNull(),
  isInternal: boolean("is_internal").notNull().default(false), // internal comments not visible to clients
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertBlogPostSchema = createInsertSchema(blogPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  createdAt: true,
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const loginClientSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const insertClientSessionSchema = createInsertSchema(clientSessions).omit({
  id: true,
  createdAt: true,
});

export const insertPageViewSchema = createInsertSchema(pageViews).omit({
  id: true,
  timestamp: true,
});

export const insertWebsiteMetricsSchema = createInsertSchema(websiteMetrics).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProjectMilestoneSchema = createInsertSchema(projectMilestones).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProjectTaskSchema = createInsertSchema(projectTasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProjectCommentSchema = createInsertSchema(projectComments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;
export type LoginClient = z.infer<typeof loginClientSchema>;
export type ClientSession = typeof clientSessions.$inferSelect;
export type InsertClientSession = z.infer<typeof insertClientSessionSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type PageView = typeof pageViews.$inferSelect;
export type InsertPageView = z.infer<typeof insertPageViewSchema>;
export type WebsiteMetrics = typeof websiteMetrics.$inferSelect;
export type InsertWebsiteMetrics = z.infer<typeof insertWebsiteMetricsSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type ProjectMilestone = typeof projectMilestones.$inferSelect;
export type InsertProjectMilestone = z.infer<typeof insertProjectMilestoneSchema>;
export type ProjectTask = typeof projectTasks.$inferSelect;
export type InsertProjectTask = z.infer<typeof insertProjectTaskSchema>;
export type ProjectComment = typeof projectComments.$inferSelect;
export type InsertProjectComment = z.infer<typeof insertProjectCommentSchema>;
