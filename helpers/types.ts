


export interface UserDB {
    name: string
    image: {
        image_id: number,
        image_url: string
    }
}


export interface ImageDB {
    image_id: number
    image_url: string
}


export interface Card {
    name: string
    card_id: number
    attack: number | null
    defence: number | null
    level: number | null
    archetype: string | null
    attribute: string | null
    frametype: string | null
    race: string | null
    type: string | null
    descr: string
    image_url: string
    cropped_image_url: string
}


export type DeckType = "Structure" | "Community" | "Starter" | "Any" | "TCG"

export interface Deck {
    name: string
    deck_id: number
    descr: string | null
    num_cards: number
    image_url: string | null
    type: DeckType
    archetypes: string[]
    attributes: string[]
    frametypes: string[]
    races: string[]
    types: string[]
    is_public: boolean
    created_by: string
    owner: string
}