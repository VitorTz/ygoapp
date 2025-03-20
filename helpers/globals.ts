import { supabase, fetchRelatedCards, supaGetSession } from "@/lib/supabase";
import { Card } from "./types";
import { orderCards } from "./util";


const USER_CARDS = new Map<number, Card>()

const RELATED_CARDS: Map<string, Card[]> = new Map()


export async function getRelatedCards(archetype: string | null): Promise<Card[]> {
    if (!archetype) { return [] }
    if (RELATED_CARDS.has(archetype)) {        
        return RELATED_CARDS.get(archetype)!        
    }    
    const cards = await fetchRelatedCards(archetype).then()
    RELATED_CARDS.set(archetype, cards)
    return cards
}


export async function initUserCards(user_id: string): Promise<boolean> {    
    const { data, error } = await supabase.from(
        "user_cards"
    ).select(
    ` 
        total,
        cards (
            card_id,
            name,
            descr,    
            attack,
            defence,
            level,
            attribute,
            archetype,
            frametype,
            race,
            type,
            image_url,
            cropped_image_url
        )
    `
    ).eq("user_id", user_id)
    if (error) { 
        console.log(error)
        return false
    }
    data?.forEach(item => {        
        USER_CARDS.set((item.cards as any).card_id, {...item.cards, num_copies: item.total} as any)
    })
    return true
}

export async function addCardToUser(card: Card, total: number = 1): Promise<boolean> {
    const session = await supaGetSession()
    if (!session) { return false }

    const { error } = await supabase.rpc('insert_user_card', {
        p_card_id: card.card_id,
        p_user_id: session!.user.id,
        p_quantity: total
    })

    if (error) {
        console.log("could not insert card", card.name, error)
        return false
    }

    if (USER_CARDS.has(card.card_id)) {
        USER_CARDS.get(card.card_id)!.num_copies += total as any
    } else {
        card.num_copies = total
        USER_CARDS.set(card.card_id, card)
    }
    return true
}

export async function rmvCardFromUser(card: Card, total: number = 1): Promise<boolean> {
    const session = await supaGetSession()
    if (!session) { return false }

    const { error } = await supabase.rpc('remove_user_card', {
        p_card_id: card.card_id,
        p_user_id: session!.user.id,
        p_quantity: total
    })

    if (error) {
        console.log("could not remove card", card.name, error)
        return false
    }

    if (USER_CARDS.has(card.card_id)) {
        const n = USER_CARDS.get(card.card_id)!.num_copies as any
        USER_CARDS.get(card.card_id)!.num_copies = n - total >= 0 ? n - total : 0
    }
    return true
}

export function getCardCopiesOnUserCollection(card_id: number): number {
    return USER_CARDS.get(card_id) ? USER_CARDS.get(card_id)!.num_copies as number : 0
}

export function getUserCards(): Card[] {
    return orderCards(USER_CARDS.values().toArray())
}