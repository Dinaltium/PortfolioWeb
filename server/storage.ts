import { 
  users, products, orders, helpRequests, contactMessages,
  type User, type InsertUser,
  type Product, type InsertProduct,
  type Order, type InsertOrder,
  type HelpRequest, type InsertHelpRequest,
  type ContactMessage, type InsertContactMessage
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProductStock(id: number, stock: number): Promise<Product | undefined>;

  // Orders
  getOrders(): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;

  // Help Requests
  getHelpRequests(): Promise<HelpRequest[]>;
  getHelpRequest(id: number): Promise<HelpRequest | undefined>;
  createHelpRequest(request: InsertHelpRequest): Promise<HelpRequest>;
  updateHelpRequestStatus(id: number, status: string, paymentStatus?: string): Promise<HelpRequest | undefined>;

  // Contact Messages
  getContactMessages(): Promise<ContactMessage[]>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).orderBy(desc(products.createdAt));
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProductStock(id: number, stock: number): Promise<Product | undefined> {
    const [product] = await db.update(products)
      .set({ stock })
      .where(eq(products.id, id))
      .returning();
    return product || undefined;
  }

  // Orders
  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order || undefined;
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const [order] = await db.update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return order || undefined;
  }

  // Help Requests
  async getHelpRequests(): Promise<HelpRequest[]> {
    return await db.select().from(helpRequests).orderBy(desc(helpRequests.createdAt));
  }

  async getHelpRequest(id: number): Promise<HelpRequest | undefined> {
    const [request] = await db.select().from(helpRequests).where(eq(helpRequests.id, id));
    return request || undefined;
  }

  async createHelpRequest(request: InsertHelpRequest): Promise<HelpRequest> {
    const [newRequest] = await db.insert(helpRequests).values(request).returning();
    return newRequest;
  }

  async updateHelpRequestStatus(id: number, status: string, paymentStatus?: string): Promise<HelpRequest | undefined> {
    const updateData: any = { status };
    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }
    
    const [request] = await db.update(helpRequests)
      .set(updateData)
      .where(eq(helpRequests.id, id))
      .returning();
    return request || undefined;
  }

  // Contact Messages
  async getContactMessages(): Promise<ContactMessage[]> {
    return await db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [newMessage] = await db.insert(contactMessages).values(message).returning();
    return newMessage;
  }
}

export const storage = new DatabaseStorage();
