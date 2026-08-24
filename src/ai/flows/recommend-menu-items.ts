'use server';

/**
 * @fileOverview A menu item recommendation AI agent.
 *
 * - recommendMenuItems - A function that handles the menu item recommendation process.
 * - RecommendMenuItemsInput - The input type for the recommendMenuItems function.
 * - RecommendMenuItemsOutput - The return type for the recommendMenuItems function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendMenuItemsInputSchema = z.object({
  pastOrders: z
    .string()
    .describe('A comma separated list of the user\'s past orders.'),
  preferences: z
    .string()
    .describe('A comma separated list of the user\'s preferences.'),
  menu: z.string().describe('The menu of the cafe.'),
});
export type RecommendMenuItemsInput = z.infer<typeof RecommendMenuItemsInputSchema>;

const RecommendMenuItemsOutputSchema = z.object({
  recommendedItems: z
    .string()
    .describe('A comma separated list of recommended menu items.'),
});
export type RecommendMenuItemsOutput = z.infer<typeof RecommendMenuItemsOutputSchema>;

export async function recommendMenuItems(
  input: RecommendMenuItemsInput
): Promise<RecommendMenuItemsOutput> {
  return recommendMenuItemsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendMenuItemsPrompt',
  input: {schema: RecommendMenuItemsInputSchema},
  output: {schema: RecommendMenuItemsOutputSchema},
  prompt: `You are a recommendation engine for Cafe 9:50.

Based on the user's past orders and preferences, recommend menu items that the user might enjoy.

Past Orders: {{{pastOrders}}}
Preferences: {{{preferences}}}
Menu: {{{menu}}}

Return a comma separated list of recommended menu items.

Recommended Menu Items:`,
});

const recommendMenuItemsFlow = ai.defineFlow(
  {
    name: 'recommendMenuItemsFlow',
    inputSchema: RecommendMenuItemsInputSchema,
    outputSchema: RecommendMenuItemsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {recommendedItems: output!.text};
  }
);
