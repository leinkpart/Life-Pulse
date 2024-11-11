import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://uxtdkpwafrhzjpjsvhkq.supabase.co';
const supabaseAnonkey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4dGRrcHdhZnJoempwanN2aGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEwODAyNDQsImV4cCI6MjA0NjY1NjI0NH0.-68iRghQUeA50GQ-Kvyv3NniLrwJ7FoHCywj69YpyhE';

export const supabase = createClient(supabaseUrl, supabaseAnonkey, 
    {
        auth: {
            storage: AsyncStorage,
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false,
        },
    }
);