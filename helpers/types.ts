


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
    num_copies: number
}

export type DeckType = "Structure" | "Community" | "Starter" | "Any" | "TCG"

export interface Deck {
    owner_name: string | null
    owner_image_url: string | null
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
    userIsOwner: boolean
}

export interface UserDeck {
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
    userIsOwner: boolean    
}


export interface LimitedCards {
    forbidden: Card[]
    limitedOne: Card[]
    limitedTwo: Card[]
}


export type DeckComment = {
    comment_id: number,
    deck_id: number,
    user_id: string,
    user_vote_sum: number,
    user_name: string,
    user_image_url: string,
    comment: string,    
    parent_comment_id: number | null,
    vote_sum: number
    replies: DeckComment[]
}