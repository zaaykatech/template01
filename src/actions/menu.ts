"use server";

import { intelligentSearch, type IntelligentSearchOutput } from '@/ai/flows/intelligent-search';

export async function searchMenuItems(query: string): Promise<IntelligentSearchOutput> {
  if (!query || query.trim().length < 3) {
    return [];
  }
  try {
    const results = await intelligentSearch({ query });
    return results;
  } catch (error) {
    console.error('Error in intelligent search:', error);
    throw new Error('Failed to perform search. Please try again.');
  }
}
