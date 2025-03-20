import { supabase, fetchRelatedCards, supaGetSession } from "@/lib/supabase";
import { orderCards } from "./util";
import { Card } from "./types";



export async function getRelatedCards(archetype: string | null, relatedCards: Map<string, Card[]>): Promise<Card[]> {
    if (!archetype) { return [] }
    if (relatedCards.has(archetype)) {        
        return relatedCards.get(archetype)!        
    }    
    const cards = await fetchRelatedCards(archetype).then()
    relatedCards.set(archetype, cards)
    return cards
}


export async function initUserCards(user_id: string, cards: Map<number, Card>) {
    const { data, error } = await supabase
        .from("user_cards")
        .select(` 
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
            )`
        )
        .eq("user_id", user_id)

    if (error) { 
        console.log(error)
        return
    }
    cards.clear()
    data?.forEach(item => {        
        cards.set(
            (item.cards as any).card_id, 
            {...item.cards, num_copies: item.total} as any
        )
    })
}

export async function supabaseAddUserCard(card_id: number, num_copies: number = 1): Promise<boolean> {
    const session = await supaGetSession()
    if (!session) { return false }

    const { error } = await supabase.rpc('insert_user_card', {
        p_card_id: card_id,
        p_user_id: session!.user.id,
        p_quantity: num_copies
    })

    if (error) {
        console.log("could not insert card", error)
        return false
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
    return true
}


export function getUserCards(cards: Map<number, Card>): Card[] {
    return orderCards(Array.from(cards.values()))
}