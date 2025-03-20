import { Card } from "@/helpers/types";
import { deckToString } from "@/helpers/util";
import OpenAI from "openai";


const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.EXPO_PUBLIC_API_KEY?.split(' ')[1].trim()
});


const SYSTEM_ROLE_CONTENT = "you're a deck-building assistant for Yu-Gi-Oh. The decks you create must be competitive enough to play in official tournaments and have around 40 cards. The user will give you a list of cards and some instructions on how the deck should be put together"


export const getDeckAi = async (cards: Card[], prompt: string | null): Promise<string | null> => {
    const userPrompt = prompt ? `#DECK DESCRIPTION\n${prompt}` : ''
    const userContent = `${deckToString(cards)}\n${userPrompt}`    
    const completion = await openai.chat.completions.create({
        messages: [
            { role: "system", content: SYSTEM_ROLE_CONTENT},
            { role: 'user', content: userContent}
        ],
        model: "deepseek-reasoner",
    });    
    return completion.choices[0].message.content    
}