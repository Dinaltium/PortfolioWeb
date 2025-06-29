import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").notNull().default(0),
  image: text("image").notNull(),
  category: text("category").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerEmail: text("customer_email").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerUsn: text("customer_usn").notNull().default(""),
  customerYear: text("customer_year").notNull().default(""),
  customerSemester: text("customer_semester").notNull().default(""),
  items: jsonb("items").notNull(), // Array of {productId, quantity, price}
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending, paid, completed, cancelled
  paymentMethod: text("payment_method").notNull().default("qr_code"),
  paymentScreenshot: text("payment_screenshot"), // Base64 encoded image or file path
  createdAt: timestamp("created_at").defaultNow(),
});

export const helpRequests = pgTable("help_requests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  usn: text("usn").notNull(),
  year: text("year").notNull().default(""),
  semester: text("semester").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  projectDetails: text("project_details").notNull(),
  depositAmount: decimal("deposit_amount", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("pending"), // pending, paid, in_progress, completed, refunded
  paymentStatus: text("payment_status").notNull().default("pending"), // pending, paid
  paymentScreenshot: text("payment_screenshot"), // Base64 encoded image or file path
  createdAt: timestamp("created_at").defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("unread"), // unread, read, replied
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(products),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
});

export const insertHelpRequestSchema = createInsertSchema(helpRequests).omit({
  id: true,
  createdAt: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type HelpRequest = typeof helpRequests.$inferSelect;
export type InsertHelpRequest = z.infer<typeof insertHelpRequestSchema>;

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
