// src/ai/flows/suggest-link-icons.ts
'use server';

/**
 * @fileOverview Provides AI-powered suggestions for icons to use with links.
 *
 * - suggestLinkIcons - A function that suggests relevant icons for a given link text.
 * - SuggestLinkIconsInput - The input type for the suggestLinkIcons function.
 * - SuggestLinkIconsOutput - The return type for the suggestLinkIcons function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestLinkIconsInputSchema = z.object({
  linkText: z.string().describe('The text of the link for which to suggest icons.'),
});
export type SuggestLinkIconsInput = z.infer<typeof SuggestLinkIconsInputSchema>;

const SuggestLinkIconsOutputSchema = z.object({
  icons: z
    .array(z.string())
    .describe('An array of suggested icon names or keywords relevant to the link text.'),
});
export type SuggestLinkIconsOutput = z.infer<typeof SuggestLinkIconsOutputSchema>;

export async function suggestLinkIcons(input: SuggestLinkIconsInput): Promise<SuggestLinkIconsOutput> {
  return suggestLinkIconsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestLinkIconsPrompt',
  input: {schema: SuggestLinkIconsInputSchema},
  output: {schema: SuggestLinkIconsOutputSchema},
  prompt: `Suggest relevant icons or keywords for the following link text.  Return an array of strings.

Link Text: {{{linkText}}}

Icons:`,
});

const suggestLinkIconsFlow = ai.defineFlow(
  {
    name: 'suggestLinkIconsFlow',
    inputSchema: SuggestLinkIconsInputSchema,
    outputSchema: SuggestLinkIconsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
