import { pgTable, text, serial, integer, boolean, jsonb, timestamp, real, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  preferences: jsonb("preferences"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  preferences: true,
});

// IPO model
export const ipos = pgTable("ipos", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull(),
  symbol: text("symbol"),
  sector: text("sector").notNull(),
  issueManager: text("issue_manager").notNull(),
  issueSize: integer("issue_size").notNull(), // In number of shares
  issuePrice: integer("issue_price").notNull(), // In NPR
  openDate: date("open_date"),
  closeDate: date("close_date"),
  allotmentDate: date("allotment_date"),
  status: text("status").notNull(), // "upcoming", "ongoing", "closed"
  recommendationRating: text("recommendation_rating"), // "Strong Buy", "Buy", "Hold", "Avoid"
  fundamentalScore: real("fundamental_score"),
  valuationScore: real("valuation_score"),
  sectorOutlookScore: real("sector_outlook_score"),
  managementScore: real("management_score"),
  expectedListingGain: text("expected_listing_gain"),
  longTermPotential: text("long_term_potential"),
  subscriptionRate: real("subscription_rate"), // Current subscription multiplier
  analysis: text("analysis"), // Detailed analysis text
});

export const insertIpoSchema = createInsertSchema(ipos).omit({
  id: true,
});

// Company Financial Data
export const companyFinancials = pgTable("company_financials", {
  id: serial("id").primaryKey(),
  ipoId: integer("ipo_id").notNull(),
  eps: real("eps"), // Earnings Per Share
  peRatio: real("pe_ratio"), // Price to Earnings Ratio
  roe: real("roe"), // Return on Equity (percentage)
  debtToEquity: real("debt_to_equity"),
  netWorth: real("net_worth"), // In billions NPR
  bookValue: real("book_value"),
  revenue: real("revenue"), // In millions NPR
  netProfit: real("net_profit"), // In millions NPR
  year: integer("year"),
});

export const insertCompanyFinancialsSchema = createInsertSchema(companyFinancials).omit({
  id: true,
});

// Educational Resources
export const educationalResources = pgTable("educational_resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // "article", "video", "guide"
  level: text("level").notNull(), // "beginner", "intermediate", "advanced"
  content: text("content"), // Can be article content or video URL
  thumbnailUrl: text("thumbnail_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertEducationalResourceSchema = createInsertSchema(educationalResources).omit({
  id: true,
  createdAt: true,
});

// User Watchlists
export const watchlists = pgTable("watchlists", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  ipoId: integer("ipo_id").notNull(),
  addedAt: timestamp("added_at").defaultNow(),
});

export const insertWatchlistSchema = createInsertSchema(watchlists).omit({
  id: true,
  addedAt: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertIpo = z.infer<typeof insertIpoSchema>;
export type Ipo = typeof ipos.$inferSelect;

export type InsertCompanyFinancials = z.infer<typeof insertCompanyFinancialsSchema>;
export type CompanyFinancials = typeof companyFinancials.$inferSelect;

export type InsertEducationalResource = z.infer<typeof insertEducationalResourceSchema>;
export type EducationalResource = typeof educationalResources.$inferSelect;

export type InsertWatchlist = z.infer<typeof insertWatchlistSchema>;
export type Watchlist = typeof watchlists.$inferSelect;
