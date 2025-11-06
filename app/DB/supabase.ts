// lib/supabase.ts
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// ⚠️ REEMPLAZA CON TUS CREDENCIALES DE SUPABASE
const supabaseUrl = 'https://yyffjsqfnwfebcuimaor.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5ZmZqc3FmbndmZWJjdWltYW9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzODgzNDksImV4cCI6MjA3Nzk2NDM0OX0.l3sk0jicbkThR-cHzwfIqG7X-c8b0cyD34fJ15RpOyM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});


export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};


export const isAuthenticated = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};
