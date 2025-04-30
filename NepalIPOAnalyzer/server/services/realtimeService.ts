
import { createClient } from '@supabase/realtime-js';
import { pool } from '../db';
import { CronJob } from 'cron';
import { DataScrapingService } from './dataScrapingService';

export class RealtimeService {
  private static instance: RealtimeService;
  private cronJob: CronJob;

  private constructor() {
    // Run scraping every 5 minutes
    this.cronJob = new CronJob('*/5 * * * *', () => {
      DataScrapingService.scrapeIPOData();
    });
  }

  static getInstance() {
    if (!RealtimeService.instance) {
      RealtimeService.instance = new RealtimeService();
    }
    return RealtimeService.instance;
  }

  startDataSync() {
    this.cronJob.start();
    console.log('Started real-time data synchronization');
  }

  stopDataSync() {
    this.cronJob.stop();
    console.log('Stopped real-time data synchronization');
  }
}
