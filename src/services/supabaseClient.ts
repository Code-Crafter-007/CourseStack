import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL or Anon Key is missing. Check your .env setup.');
}

export const supabase = createClient(
    supabaseUrl || 'https://ujdsbkttudshpbonvurc.supabase.co',
    supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqZHNia3R0dWRzaHBib252dXJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMzgzOTQsImV4cCI6MjA4NjkxNDM5NH0.O4-hcRyUBh4v2QoDNYT52Qza7yoExlZk6kh53_jimgQ'
);
