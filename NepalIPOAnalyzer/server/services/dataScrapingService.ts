
import axios from 'axios';
import cheerio from 'cheerio';
import { pool, db } from '../db';
import { ipos } from '@shared/schema';
import { eq } from 'drizzle-orm';

export class DataScrapingService {
  static async scrapeIPOData() {
    try {
      // Example: Scrape from Nepal Stock Exchange
      const response = await axios.get('https://www.nepalstock.com/ipo');
      const $ = cheerio.load(response.data);
      
      // Extract IPO data (example selectors - adjust based on actual website structure)
      $('.ipo-listing tr').each(async (_, element) => {
        const companyName = $(element).find('.company-name').text().trim();
        const issuePrice = parseFloat($(element).find('.issue-price').text());
        const status = $(element).find('.status').text().toLowerCase();
        
        // Update database if IPO exists
        if (companyName) {
          const existingIpo = await db.select().from(ipos)
            .where(eq(ipos.companyName, companyName))
            .limit(1);
          
          if (existingIpo.length > 0) {
            await db.update(ipos)
              .set({ 
                issuePrice,
                status,
                updatedAt: new Date().toISOString()
              })
              .where(eq(ipos.companyName, companyName));
          }
        }
      });
    } catch (error) {
      console.error('Error scraping IPO data:', error);
    }
  }
}
