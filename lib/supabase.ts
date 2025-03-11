import { createClient } from '@supabase/supabase-js'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CARD_FETCH_LIMIT, DECK_TYPES, DECK_FETCH_LIMIT } from '../constants/AppConstants';
import { Card, Deck, ImageDB, UserDB } from '@/helpers/types';



const supabaseUrl = 'https://mlhjkqlgzlkvtqjngzdr.supabase.co'
const supabaseKey = process.env.EXPO_PUBLIC_API_KEY

const EQ_COMP = [
  "archetype",
  "attribute",
  "frametype",
  "race",
  "type"
]


export const supabase = createClient(supabaseUrl, supabaseKey, {
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
        return {name: data.name, image: {image_id: data.image_id, image_url: data.images.image_url}}
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
  

export async function supaRandomTrivia(): Promise<string | null> {
  // Chama a função definida no banco
  const { data, error } = await supabase.rpc('get_random_trivia_descr');

  if (error) {
    console.error('Erro ao obter trivia:', error);
    return null;
  }

  return data;
}


export async function fetchProfileIcons(): Promise<ImageDB[]> {
  const {data, error} = await supabase.from("profile_icons").select("image_id, images (image_url)")
  const r = data ? data.map(
    item => {return {image_id: item.image_id, image_url: item.images.image_url}}
  ) : []
  return r
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
  if (error) {
    console.log(error)
  }
  return data ? data : []
}


export const supaFetchDecks = async (
  searchTxt: string | null,
  options: Map<any, any>, 
  page: number
): Promise<Deck[]> => {
  let query = supabase.from("decks").select(`
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
    created_by,
    owner
  `)  

  query = query.eq("is_public", true)  

  query = query.gte("num_cards", 1)

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
  data?.forEach(item => item['userIsOwner'] = item.owner != null && item.owner == item.created_by)
  console.log(data)
  return data ? data : []  
  
}