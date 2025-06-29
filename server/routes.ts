import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema, insertOrderSchema, insertHelpRequestSchema, insertContactMessageSchema } from "@shared/schema";
import nodemailer from "nodemailer";
import QRCode from "qrcode";

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: "Invalid product data" });
    }
  });

  // Orders
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(validatedData);
      
      // Update product stock
      const items = validatedData.items as any[];
      for (const item of items) {
        const product = await storage.getProduct(item.productId);
        if (product) {
          await storage.updateProductStock(item.productId, product.stock - item.quantity);
        }
      }

      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ message: "Invalid order data" });
    }
  });

  app.patch("/api/orders/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const order = await storage.updateOrderStatus(id, status);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to update order" });
    }
  });

  // Generate QR code for payment
  app.post("/api/generate-qr", async (req, res) => {
    try {
      const { amount, orderId, type } = req.body;
      
      // Create UPI payment string
      const upiString = `upi://pay?pa=orneryraptor778@paytm&pn=AAF11&am=${amount}&cu=INR&tn=${type === 'order' ? 'Order' : 'Help Request'} ${orderId}`;
      
      const qrCode = await QRCode.toDataURL(upiString);
      res.json({ qrCode, upiString });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate QR code" });
    }
  });

  // Help Requests
  app.get("/api/help-requests", async (req, res) => {
    try {
      const requests = await storage.getHelpRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch help requests" });
    }
  });

  app.post("/api/help-requests", async (req, res) => {
    try {
      const validatedData = insertHelpRequestSchema.parse(req.body);
      const request = await storage.createHelpRequest(validatedData);

      // Try to send email notifications, but don't fail if email fails
      try {
        const emailHtml = `
          <h2>New Help Request - AAF11</h2>
          <p><strong>Name:</strong> ${request.name}</p>
          <p><strong>USN:</strong> ${request.usn}</p>
          <p><strong>Year:</strong> ${request.year}</p>
          <p><strong>Semester:</strong> ${request.semester}</p>
          <p><strong>Phone:</strong> ${request.phone}</p>
          <p><strong>Email:</strong> ${request.email}</p>
          <p><strong>Deposit Amount:</strong> ₹${request.depositAmount}</p>
          <p><strong>Project Details:</strong></p>
          <p>${request.projectDetails}</p>
          <p><strong>Request ID:</strong> ${request.id}</p>
          <p><strong>Submitted:</strong> ${request.createdAt}</p>
        `;

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: ['orneryraptor778@gmail.com', 'mohammedjazeel73@gmail.com'],
          subject: `New Help Request from ${request.name} - AAF11`,
          html: emailHtml,
        });
      } catch (emailError) {
        console.error('Email failed but request created:', emailError);
      }

      res.status(201).json(request);
    } catch (error) {
      console.error('Error creating help request:', error);
      res.status(400).json({ message: "Invalid help request data" });
    }
  });

  app.patch("/api/help-requests/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status, paymentStatus } = req.body;
      const request = await storage.updateHelpRequestStatus(id, status, paymentStatus);
      if (!request) {
        return res.status(404).json({ message: "Help request not found" });
      }
      res.json(request);
    } catch (error) {
      res.status(500).json({ message: "Failed to update help request" });
    }
  });

  // Contact Messages
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createContactMessage(validatedData);

      // Send email notification
      const emailHtml = `
        <h2>New Contact Message - AAF11</h2>
        <p><strong>Name:</strong> ${message.name}</p>
        <p><strong>Email:</strong> ${message.email}</p>
        <p><strong>Subject:</strong> ${message.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.message}</p>
        <p><strong>Submitted:</strong> ${message.createdAt}</p>
      `;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: ['orneryraptor778@gmail.com', 'mohammedjazeel73@gmail.com'],
        subject: `Contact Form: ${message.subject} - AAF11`,
        html: emailHtml,
      });

      res.status(201).json(message);
    } catch (error) {
      console.error('Error sending contact message:', error);
      res.status(400).json({ message: "Invalid contact message data" });
    }
  });

  // Initialize with sample products
  app.post("/api/init-products", async (req, res) => {
    try {
      const sampleProducts = [
        {
          name: "Arduino Uno R3",
          description: "Microcontroller board for beginners",
          price: "450.00",
          stock: 25,
          image: "https://images.unsplash.com/photo-1553406830-ef2513450d76?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          category: "Development Boards"
        },
        {
          name: "Half-Size Breadboard",
          description: "400 tie-point solderless breadboard",
          price: "120.00",
          stock: 50,
          image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          category: "Prototyping"
        },
        {
          name: "LED Assortment Kit",
          description: "100pcs mixed color LEDs",
          price: "200.00",
          stock: 30,
          image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          category: "Components"
        },
        {
          name: "Resistor Value Pack",
          description: "30 values, 10 of each resistor",
          price: "150.00",
          stock: 40,
          image: "https://images.unsplash.com/photo-1609728476020-4b2b0f6c5e1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          category: "Components"
        },
        {
          name: "HC-SR04 Ultrasonic",
          description: "Distance measuring sensor module",
          price: "180.00",
          stock: 20,
          image: "https://images.unsplash.com/photo-1611164536892-8b8d6e7b8773?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          category: "Sensors"
        },
        {
          name: "SG90 Servo Motor",
          description: "Micro servo for robotics projects",
          price: "250.00",
          stock: 15,
          image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          category: "Motors"
        },
        {
          name: "Jumper Wire Set",
          description: "120pcs male-to-male wires",
          price: "80.00",
          stock: 60,
          image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          category: "Connectivity"
        },
        {
          name: "ESP32 DevKit",
          description: "WiFi & Bluetooth development board",
          price: "600.00",
          stock: 12,
          image: "https://images.unsplash.com/photo-1553406830-ef2513450d76?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
          category: "Development Boards"
        }
      ];

      for (const product of sampleProducts) {
        await storage.createProduct(product);
      }

      res.json({ message: "Sample products initialized" });
    } catch (error) {
      res.status(500).json({ message: "Failed to initialize products" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
