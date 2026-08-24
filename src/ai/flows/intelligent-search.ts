
// intelligent-search.ts
'use server';

/**
 * @fileOverview Implements intelligent search for menu items using natural language queries.
 *
 * - intelligentSearch - A function that handles the menu item search process.
 * - IntelligentSearchInput - The input type for the intelligentSearch function.
 * - IntelligentSearchOutput - The return type for the intelligentSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { menuSections } from '@/lib/menu';

const allMenuItems = menuSections.flatMap(section => 
  section.items.map(item => ({
    name: item.name,
    price: item.price || (item.prices ? `${item.prices.ny}/${item.prices.neap}` : 0),
    section: section.title,
    description: item.description || ''
  }))
);


const IntelligentSearchInputSchema = z.object({
  query: z.string().describe('The user query to search for menu items.'),
});
export type IntelligentSearchInput = z.infer<typeof IntelligentSearchInputSchema>;

const MenuItemSchema = z.object({
  name: z.string().describe('The name of the menu item.'),
  price: z.union([z.number(), z.string()]).describe('The price of the menu item.'),
  section: z.string().describe('The section of the menu the item belongs to'),
});

const IntelligentSearchOutputSchema = z.array(MenuItemSchema);
export type IntelligentSearchOutput = z.infer<typeof IntelligentSearchOutputSchema>;

const intelligentSearchFlow = ai.defineFlow(
  {
    name: 'intelligentSearchFlow',
    inputSchema: IntelligentSearchInputSchema,
    outputSchema: IntelligentSearchOutputSchema,
  },
  async ({ query }) => {
    const { output } = await ai.generate({
        prompt: `You are a helpful assistant for a cafe. A customer is searching for items on the menu.
        Their search query is: "${query}"

        Here is the full menu, with descriptions:
        ${JSON.stringify(allMenuItems, null, 2)}
        
        Based on the query, return a list of matching menu items. 
        Consider the name, section, and description. 
        Be flexible with partial matches and synonyms (e.g., "cold coffee" could match "Frappe" or "Cold Brew").
        If the query is for something generic like "something sweet" or "a snack", find relevant items.
        Return an empty array if nothing matches.
        `,
        output: {
            schema: IntelligentSearchOutputSchema,
        },
    });

    return output ?? [];
  }
);


export async function intelligentSearch(input: IntelligentSearchInput): Promise<IntelligentSearchOutput> {
  return intelligentSearchFlow(input);
}
