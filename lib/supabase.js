import { createClient } from '@supabase/supabase-js'
import AsyncStorage from "@react-native-async-storage/async-storage";

const supabaseUrl = 'https://mlhjkqlgzlkvtqjngzdr.supabase.co'
const supabaseKey = process.env.EXPO_PUBLIC_API_KEY


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


export async function supaGetUser() {
    const session = await supaGetSession()
    const {data, error} = await supabase.from("users").select("name, images (image_url) ").eq("user_id", session.user.id).single()
    if (data) {
        return {user: {name: data.name, image_url: data.images.image_url}, error: null}
    }
    return {user: null, error: error}
}
  

export async function supaRandomTrivia() {
    // Chama a função definida no banco
    const { data, error } = await supabase.rpc('get_random_trivia_descr');
  
    if (error) {
      console.error('Erro ao obter trivia:', error);
      return null;
    }
  
    return data;
  }