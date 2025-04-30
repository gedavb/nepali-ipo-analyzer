import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertUserSchema, insertIpoSchema, insertCompanyFinancialsSchema, insertEducationalResourceSchema, insertWatchlistSchema } from "@shared/schema";
import { 
  getAllIpos, 
  getIpoById, 
  getIposByStatus, 
  createIpo, 
  updateIpo, 
  calculateMarketStatistics,
  addToWatchlist,
  removeFromWatchlist,
  getUserWatchlist
} from "./services/ipoService";
import { getCompanyFinancials, createCompanyFinancials, getCompanyAnalysis } from "./services/companyService";
import { 
  getAllEducationalResources, 
  getEducationalResourcesByType, 
  getEducationalResourceById, 
  createEducationalResource 
} from "./services/educationalService";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.post("/api/users/register", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
      }
      
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }
      
      // Create the user
      const user = await storage.createUser(userData);
      
      // Don't return the password in the response
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid user data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create user" });
      }
    }
  });
  
  // IPO routes
  app.get("/api/ipos", async (_req: Request, res: Response) => {
    try {
      const ipos = await getAllIpos();
      res.json(ipos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch IPOs" });
    }
  });
  
  app.get("/api/ipos/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const ipo = await getIpoById(id);
      
      if (!ipo) {
        return res.status(404).json({ message: "IPO not found" });
      }
      
      res.json(ipo);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch IPO" });
    }
  });
  
  app.get("/api/ipos/status/:status", async (req: Request, res: Response) => {
    try {
      const status = req.params.status as "upcoming" | "ongoing" | "closed";
      
      if (!["upcoming", "ongoing", "closed"].includes(status)) {
        return res.status(400).json({ message: "Invalid status parameter" });
      }
      
      const ipos = await getIposByStatus(status);
      res.json(ipos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch IPOs by status" });
    }
  });
  
  app.post("/api/ipos", async (req: Request, res: Response) => {
    try {
      const ipoData = insertIpoSchema.parse(req.body);
      const ipo = await createIpo(ipoData);
      res.status(201).json(ipo);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid IPO data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create IPO" });
      }
    }
  });
  
  app.patch("/api/ipos/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const ipoData = req.body;
      
      const ipo = await updateIpo(id, ipoData);
      
      if (!ipo) {
        return res.status(404).json({ message: "IPO not found" });
      }
      
      res.json(ipo);
    } catch (error) {
      res.status(500).json({ message: "Failed to update IPO" });
    }
  });
  
  // Company Financials routes
  app.get("/api/company-financials/:ipoId", async (req: Request, res: Response) => {
    try {
      const ipoId = parseInt(req.params.ipoId);
      const financials = await getCompanyFinancials(ipoId);
      res.json(financials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch company financials" });
    }
  });
  
  app.post("/api/company-financials", async (req: Request, res: Response) => {
    try {
      const financialsData = insertCompanyFinancialsSchema.parse(req.body);
      const financials = await createCompanyFinancials(financialsData);
      res.status(201).json(financials);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid company financials data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create company financials" });
      }
    }
  });
  
  app.get("/api/company-analysis/:ipoId", async (req: Request, res: Response) => {
    try {
      const ipoId = parseInt(req.params.ipoId);
      const analysis = await getCompanyAnalysis(ipoId);
      res.json(analysis);
    } catch (error) {
      if (error instanceof Error) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to fetch company analysis" });
      }
    }
  });
  
  // Educational Resources routes
  app.get("/api/educational-resources", async (_req: Request, res: Response) => {
    try {
      const resources = await getAllEducationalResources();
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch educational resources" });
    }
  });
  
  app.get("/api/educational-resources/type/:type", async (req: Request, res: Response) => {
    try {
      const type = req.params.type;
      const resources = await getEducationalResourcesByType(type);
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch educational resources by type" });
    }
  });
  
  app.get("/api/educational-resources/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const resource = await getEducationalResourceById(id);
      
      if (!resource) {
        return res.status(404).json({ message: "Educational resource not found" });
      }
      
      res.json(resource);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch educational resource" });
    }
  });
  
  app.post("/api/educational-resources", async (req: Request, res: Response) => {
    try {
      const resourceData = insertEducationalResourceSchema.parse(req.body);
      const resource = await createEducationalResource(resourceData);
      res.status(201).json(resource);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid educational resource data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create educational resource" });
      }
    }
  });
  
  // Watchlist routes
  app.post("/api/watchlist", async (req: Request, res: Response) => {
    try {
      const watchlistData = insertWatchlistSchema.parse(req.body);
      const watchlist = await addToWatchlist(watchlistData.userId, watchlistData.ipoId);
      res.status(201).json(watchlist);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid watchlist data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to add to watchlist" });
      }
    }
  });
  
  app.delete("/api/watchlist/:userId/:ipoId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const ipoId = parseInt(req.params.ipoId);
      
      const success = await removeFromWatchlist(userId, ipoId);
      
      if (!success) {
        return res.status(404).json({ message: "Watchlist item not found" });
      }
      
      res.json({ message: "Removed from watchlist" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove from watchlist" });
    }
  });
  
  app.get("/api/watchlist/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const watchlist = await getUserWatchlist(userId);
      res.json(watchlist);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch watchlist" });
    }
  });
  
  // Market Statistics
  app.get("/api/market-statistics", async (_req: Request, res: Response) => {
    try {
      const statistics = await calculateMarketStatistics();
      res.json(statistics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch market statistics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
