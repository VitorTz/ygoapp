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
  