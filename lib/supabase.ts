import { 
  CARD_FETCH_LIMIT, 
  DECK_TYPES, 
  DECK_FETCH_LIMIT 
} from '../constants/AppConstants';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Card, Deck, ImageDB, UserDB } from '@/helpers/types';
import { createClient } from '@supabase/supabase-js'
import { orderCards, removeTrailingNewlines, showToast, toTitleCase } from '@/helpers/util';



const supabaseUrl = 'https://mlhjkqlgzlkvtqjngzdr.supabase.co'
const supabaseKey = process.env.EXPO_PUBLIC_API_KEY

const EQ_COMP = [
  "archetype",
  "attribute",
  "frametype",
  "race",
  "type"
]


export const supabase = createClient(supabaseUrl, supabaseKey as any, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});


export async function supaGetSession() {
    const {data: {session}, error} = await supabase.auth.getSession()
    return session
}


export async function supaGetUser(): Promise<UserDB | null> {
    const session = await supaGetSession()
    const {data, error} = await supabase.from("users").select("name, image_id, images (image_url) ").eq("user_id", session.user.id).single()
    if (data) {
        return {
          name: data.name, 
          image: {
            image_id: data.image_id, 
            image_url: data.images.image_url
          }
        }
    }
    return null
}

export async function supaUpdateUserIcon(image_id: number) {
    const session = await supaGetSession()
    if (session) {
      const {data, error} = await supabase.from("users").update({"image_id": image_id}).eq("user_id", session.user.id)
      return error != null
    }
    return false
}


export async function supaAddCardToCollection(card_id: number, total: number): Promise<boolean> {
  const {data: {session}, error: err} = await supabase.auth.getSession()
  if (err) {
    console.log(err.message)
    return false    
  }
  const { error } = await supabase.rpc('insert_user_card', {
    p_card_id: card_id,
    p_user_id: session!.user.id,
    p_quantity: total
  })
  if (error) {
    console.log(error)
    return false
  }
  return true
}


export async function supaRmvCardFromCollection(card_id: number, total: number): Promise<boolean> {
  const {data: {session}, error: err} = await supabase.auth.getSession()
  if (err) {
    console.log(err.message)
    return false    
  }
  const { error } = await supabase.rpc('remove_user_card', {
    p_card_id: card_id,
    p_user_id: session!.user.id,
    p_quantity: total
  })
  if (error) {
    console.log(error)
    return false
  }
  return true
}
  

export async function supaCreateDeck(
  name: string, 
  description: string, 
  isPublic: boolean, 
  cards: Card[]
) {
  const session = await supaGetSession()

  if (!session) {
    console.log("user has no session")
    return false
  }

  const descr = removeTrailingNewlines(description.trim())
  const archetypes = new Set<string>()
  const attributes = new Set<string>()
  const frametypes = new Set<string>()
  const races = new Set<string>()
  const types = new Set<string>()  

  let cardMap = new Map<number, number>()
  let attack = 0
  let image_url = cards[0].cropped_image_url
  
  cards.forEach(item => {
    if (item.attack && item.attack > attack) {
      image_url = item.cropped_image_url
    }
    if (item.archetype) {
      archetypes.add(item.archetype)
    }

    if (item.attribute) {
      attributes.add(item.attribute)
    }

    if (item.frametype) {
      frametypes.add(item.frametype)
    }

    if (item.race) {
      races.add(item.race)
    }

    if (item.type) {
      types.add(item.type)
    }

    if (cardMap.has(item.card_id)) {
      cardMap.set(item.card_id, cardMap.get(item.card_id)! + 1)
    } else {
      cardMap.set(item.card_id, 1)
    }
  })  

  const { data, error } = await supabase.from(
    "decks"
  ).insert(
    [
      {
        name: name.trimEnd(), 
        descr: descr != '' ? descr : null,
        type: "Community",
        num_cards: cards.length,
        is_public: isPublic,
        created_by: session.user.id,
        owner: session.user.id,
        image_url: image_url,
        archetypes: Array.from(archetypes),
        attributes: Array.from(attributes),
        frametypes: Array.from(frametypes),
        races: Array.from(races),
        types: Array.from(types)
      }
    ]
  ).select("deck_id").single()

  if (error) {
    showToast("Error", error.message, "error")
    return false
  }

  const deck_id = data.deck_id
  const cardsToAdd: {deck_id: number, card_id: number, num_cards: number}[] = []

  cardMap.forEach((value, key) => {
    cardsToAdd.push({deck_id: deck_id, card_id: key, num_cards: value})
  })

  const {error: e1} = await supabase.from(
    "deck_cards"
  ).insert(cardsToAdd)

  if (e1) {
    const {data, error} = await supabase.from("decks").delete().eq("deck_id", deck_id)
    return false
  }

  return true

}

export async function supaDeleteDeck(deck_id: number): Promise<boolean> {
  const {data, error} = await supabase.from("decks").delete().eq("deck_id", deck_id)
  if (error) {
    console.log(error)
    return false
  }
  return true
}


export async function supaUpdateDeck(
  deck_id: number, 
  deckName: string, 
  deckDescr: string | null, 
  isPublic: boolean,
  cards: Card[]
): Promise<boolean> {
  
  const descr = deckDescr ? removeTrailingNewlines(deckDescr.trim()) : null
  const archetypes = new Set<string>()
  const attributes = new Set<string>()
  const frametypes = new Set<string>()
  const races = new Set<string>()
  const types = new Set<string>()  

  let cardMap = new Map<number, number>()  
  
  cards.forEach(item => {    
    if (item.archetype) {
      archetypes.add(item.archetype)
    }

    if (item.attribute) {
      attributes.add(item.attribute)
    }

    if (item.frametype) {
      frametypes.add(item.frametype)
    }

    if (item.race) {
      races.add(item.race)
    }

    if (item.type) {
      types.add(item.type)
    }

    if (cardMap.has(item.card_id)) {
      cardMap.set(item.card_id, cardMap.get(item.card_id)! + 1)
    } else {
      cardMap.set(item.card_id, 1)
    }
  })  

  const { data, error } = await supabase.from(
    "decks"
  ).update(    
      {
        name: deckName.trimEnd(), 
        descr: descr != '' ? descr : null,
        type: "Community",
        num_cards: cards.length,
        is_public: isPublic,        
        archetypes: Array.from(archetypes),
        attributes: Array.from(attributes),
        frametypes: Array.from(frametypes),
        races: Array.from(races),
        types: Array.from(types)
      }    
  ).eq('deck_id', deck_id)

  if (error) {
    showToast("Error", error.message, "error")
    return false
  }

  const cardsToAdd: {deck_id: number, card_id: number, num_cards: number}[] = []

  cardMap.forEach((value, key) => {
    cardsToAdd.push({deck_id: deck_id, card_id: key, num_cards: value})
  })

  const {error: e1} = await supabase.from("deck_cards").upsert(cardsToAdd, {ignoreDuplicates: true})

  if (e1) {
    console.log("Error", e1)
    return false
  }

  return true
}

export async function fetchRandomTrivia(): Promise<string | null> {  
  const { data, error } = await supabase.rpc('get_random_trivia_descr');
  if (error) {
    console.error('Erro ao obter trivia:', error);
    return null;
  }
  return data;
}


export async function fetchProfileIcons(): Promise<ImageDB[]> {
  const { data } = await supabase.from("profile_icons").select("image_id, images (image_url)")
  const r: ImageDB[] = data ? data.map(
    item => {
      return {
        image_id: item.image_id, 
        image_url: item.images.image_url 
      }
    }
  ) : []
  return r
}


export async function fetchDeck(deck_id: number | string): Promise<Deck | null> {
  const {data, error} = await supabase.from("decks").select(
    `
      deck_id,
      name,
      type,
      descr,
      image_url,    
      num_cards,    
      archetypes,
      attributes,
      frametypes,
      races,
      types,
      is_public,
      created_by,
      owner
    ` 
  ).eq("deck_id", deck_id).single().overrideTypes<Deck>()
  if (error) {
    console.log(error)
    return null
  }
  return data as Deck
}


export async function fetchDeckCards(deck_id: number | string): Promise<Card[]> {
  const {data, error} = await supabase.from("deck_cards").select(
    `
    num_cards,
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
  ).eq("deck_id", deck_id)
  let r: Card[] = []
  data?.forEach(card => {
    for (let i = 0; i < card.num_cards; i++) {
      r.push(card.cards as any)
    }
  })
  r = orderCards(r)
  return r
}


export async function fetchUserCards(): Promise<Card[]> {
  const session = await supaGetSession()
  if (!session) {
    return []
  }
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
  ).eq("user_id", session.user.id)
  if (error) { console.log(error) }
  let cards: Card[] = []
  data?.forEach(item => cards.push({num_copies: item.total, ...item.cards} as any))
  return orderCards(cards)
}

export async function fetchUserDecks(): Promise<Deck[]> {
  const session = await supaGetSession()

  if (!session) {
    return []
  }

  const { data, error } = await supabase.from(
    "decks"
  ).select(
    `
      deck_id,
      name,
      type,
      descr,
      image_url,    
      num_cards,    
      archetypes,
      attributes,
      frametypes,
      races,
      is_public,
      types,
      created_by,
      owner
    `
  ).eq("owner", session?.user.id).order("updated_at", {ascending: false}).overrideTypes<Deck[]>()  
  return data ? data as Deck[] : []
  
}

export async function supaFetchCards(
  searchTxt: string | null, 
  optionsMap: Map<string, any>, 
  page: number
): Promise<Card[]> {  
  let query = supabase.from('cards').select(`
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
  `
  )

  if (searchTxt) {
    query = query.ilike("name", `%${searchTxt}%`)
  }  

  
  EQ_COMP.forEach(
    (value) => {
      if (optionsMap.get(value)) {
        const s = optionsMap.get(value).map((item: string) => `${value}.eq.${item}`).join(',')        
        if (s) {
          query = query.or(s)
        }
      }
    }
  )

  const orderBy = optionsMap.get("sort")  
  if (orderBy) {
    query = query.order(
      orderBy ? orderBy : "name",
      {ascending: optionsMap.get("sortDirection") != "DESC", nullsFirst: false}
    )
  }


  query = query.range(page * CARD_FETCH_LIMIT, ((page + 1) * CARD_FETCH_LIMIT) - 1)
  
  const {data, error} = await query.overrideTypes<Card[]>()
  if (error) { console.log(error) }
  return data ? data : []
}


export const supaFetchDecks = async (
  searchTxt: string | null,
  options: Map<any, any>, 
  page: number
): Promise<Deck[]> => {
  let query = supabase.from("decks").select(`
    users!decks_owner_fkey (
      name,
      user_id,
      images!users_image_id_fkey (image_url)
    ),
    deck_id,
    name,
    type,
    descr,
    image_url,    
    num_cards,    
    archetypes,
    attributes,
    frametypes,
    races,
    types,
    is_public,
    created_by,
    owner
  `)

  query = query.eq("is_public", true)  

  if (searchTxt) {
    query = query.ilike("name", `%${searchTxt}%`)
  }

  if (options.has('archetypes')) {
      options.get('archetypes').forEach(
      (value: string) => {
        query = query.contains('archetypes', [value])
      }
    )
  }

  if (options.has('attributes')) {
      options.get('attributes').forEach(
      (value: string) => {
        query = query.contains('attributes', [value])
      }
    )
  }

  if (options.has('frametypes')) {
      options.get('frametypes').forEach(
      (value: string) => {
        query = query.contains('frametypes', [value])
      }
    )
  }

  if (options.has('races')) {
      options.get('races').forEach(
      (value: string) => {        
        query = query.contains('races', [value])
      }
    )
  }

  if (options.has('types')) {
      options.get('types').forEach(
      (value: string) => {
        query = query.contains('types', [value])
      }
    )
  }

  if (options.has('deckType')) {
    const t: string = options.get('deckType')    
    if (t != "Any" && DECK_TYPES.includes(t)) {
      query = query.eq("type", t)
    }
  }

  const {data, error} = await query.order(
    'name', {ascending: true}
  ).range(
    page * DECK_FETCH_LIMIT, 
    (page * DECK_FETCH_LIMIT) + DECK_FETCH_LIMIT - 1
  ).overrideTypes<Deck[]>()

  if (error) {
    console.log(error)
  }

  data?.forEach(
    item => {      
      item.owner_name = item.users ? item.users.name : null
      item.owner_image_url = item.users ? item.users.images.image_url : null      
    }
  )
  return data ? data as Deck[] : []
}


export async function supaUserIsOwnerOfDeck(deck_id: number): Promise<boolean> {
  const session = await supaGetSession()  
  if (!session) {
    return false
  }
  const { data, error } = await supabase.from(
    "decks"
  ).select("deck_id").eq("deck_id", deck_id).eq("owner", session.user.id).single()

  if (error && error.code != "PGRST116") {
    console.log(error)
  }
  return data ? true : false
}

export async function fetchRelatedCards(archetype: string | null): Promise<Card[]> {
  const { data, error } = await supabase.from(
    "cards"
  ).select(
    `
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
    `
  ).eq("archetype", archetype).overrideTypes<Card[]>()
  return data ? orderCards(data) : []
}

export async function supaFetchCardsFromDeck(deck_id: number): Promise<Card[]> {
  const { data } = await supabase.from("deck_cards").select(
    `
    num_cards,
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
  ).eq("deck_id", deck_id).overrideTypes<Card[]>()  
  let cards: Card[] = []
  data?.forEach(item => {
    for (let i = 0; i < item.num_cards; i++) {
      cards.push(item.cards as any)
    }
  })
  return orderCards(cards)  
}


export async function supaAddDeckToCollection(deck_id: number): Promise<boolean> {
  const session = await supaGetSession()  

  if (!session) {
    return false
  }
  
  const { data: d1, error: e1 } = await supabase.rpc('copy_deck', {
    original_deck_id: deck_id,
    new_owner: session.user.id
  });

  if (e1) {
    console.log(e1)
    return false
  }

  const newDeckId = d1[0].deck_id;
    
  const { error } = await supabase.rpc('copy_deck_cards', {
    source_deck_id: deck_id,
    target_deck_id: newDeckId
  });

  if (error) {
    console.log(error)
    return false
  }

  return true
}


export async function supaRmvDeckFromCollection(deck_id: number) {
  const session = await supaGetSession()  
  if (!session) {
    return false
  }

  // Supondo que a tabela user_decks tenha uma coluna user_id para identificar o dono
  const { data, error } = await supabase
    .from("decks")
    .delete()
    .match({ deck_id: deck_id, owner: session.user.id });

  if (error) {
    console.error('Erro ao deletar deck:', error);
    return false;
  }

  return true;
}