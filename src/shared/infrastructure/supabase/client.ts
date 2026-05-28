import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

// Supbase espera métodos getItem/setItem/removeItem pero expo-secure-store 
// expone getItemAsync/setItemAsynbc/removeItemAsync - este adaptador los mejora
const SecureStoreAdapter = {
    getItem: (key: string) =>
        SecureStore.getItemAsync(key),
    setItem: (key: string, value: string) =>
        SecureStore.setItemAsync(key, value),
    removeItem: (key: string) =>
        SecureStore.deleteItemAsync(key),
};

export const supabase = createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL!,
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
    {
        auth: {
            storage: SecureStoreAdapter,
            autoRefreshToken: true,
            persistSession: true,
        },
    }
);