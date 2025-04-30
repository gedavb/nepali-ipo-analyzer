import { storage } from "../storage";
import { Ipo, InsertIpo } from "@shared/schema";

export async function getAllIpos(): Promise<Ipo[]> {
  return storage.getIpos();
}

export async function getIpoById(id: number): Promise<Ipo | undefined> {
  return storage.getIpo(id);
}

export async function getIposByStatus(status: "upcoming" | "ongoing" | "closed"): Promise<Ipo[]> {
  return storage.getIposByStatus(status);
}

export async function createIpo(ipo: InsertIpo): Promise<Ipo> {
  return storage.createIpo(ipo);
}

export async function updateIpo(id: number, ipo: Partial<InsertIpo>): Promise<Ipo | undefined> {
  return storage.updateIpo(id, ipo);
}

export async function calculateMarketStatistics() {
  const ongoingIpos = await storage.getIposByStatus("ongoing");
  const upcomingIpos = await storage.getIposByStatus("upcoming");
  const closedIpos = await storage.getIposByStatus("closed");
  
  // Calculate market sentiment (simple implementation for MVP)
  // In a real app, this would involve more complex analysis
  const sentiment = 65; // Percentage on a scale from 0 (bearish) to 100 (bullish)
  
  return {
    ongoingCount: ongoingIpos.length,
    upcomingCount: upcomingIpos.length,
    closedCount: closedIpos.length,
    marketSentiment: sentiment,
    nepseIndex: 2143.67,
    nepseChange: 1.24
  };
}

export async function addToWatchlist(userId: number, ipoId: number) {
  return storage.addToWatchlist({ userId, ipoId });
}

export async function removeFromWatchlist(userId: number, ipoId: number) {
  return storage.removeFromWatchlist(userId, ipoId);
}

export async function getUserWatchlist(userId: number) {
  const watchlistItems = await storage.getWatchlistByUser(userId);
  
  // Get the full IPO details for each item in the watchlist
  const watchlistIpos = await Promise.all(
    watchlistItems.map(async (item) => {
      const ipo = await storage.getIpo(item.ipoId);
      return {
        ...item,
        ipo
      };
    })
  );
  
  return watchlistIpos.filter(item => item.ipo !== undefined);
}
