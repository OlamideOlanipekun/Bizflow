
import { GoogleGenAI } from "@google/genai";
import { DashboardStats } from '../types';

/**
 * Generates strategic business insights based on current dashboard statistics.
 * Adheres strictly to Gemini SDK best practices.
 */
export async function getBusinessInsights(stats: DashboardStats): Promise<string> {
  try {
    // Fix: Initialize strictly with the environment key as per Google GenAI guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
      You are a senior business analyst for a high-growth SaaS platform called BizFlow.
      Analyze these metrics:
      - Total Revenue: $${stats.totalRevenue.toLocaleString()}
      - Total Customers: ${stats.totalCustomers}
      - Monthly Growth: ${stats.monthlyGrowth}%
      - Recent Activity Highlights: ${stats.recentTransactions.slice(0, 3).map(t => `${t.customerName} (${t.category}: $${t.amount})`).join(', ')}

      Task: Provide a 2-sentence executive summary highlighting one strength and one opportunity for optimization.
      Tone: Professional, data-driven, and encouraging.
    `;

    // 2. Use the generateContent method with correct parameter structure
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    // 3. Extract text output directly from the .text property (not a method call)
    return response.text || "Analyzed metrics suggest stable growth; monitor customer acquisition costs to ensure scalability.";
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "AI Analyst is currently unavailable. Review your revenue stream manually for optimizations.";
  }
}
