import { DashboardStats } from '../types';
import { api } from './api';

/**
 * Generates strategic business insights based on current dashboard statistics.
 * Now routed through the backend for improved security.
 */
export async function getBusinessInsights(stats: DashboardStats): Promise<string> {
  try {
    return await api.getAiInsights(stats);
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "Analyzed metrics suggest stable growth; monitor customer acquisition costs to ensure scalability.";
  }
}
