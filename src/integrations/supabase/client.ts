import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = 'https://fpriqrupzrfewpjkxyjp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwcmlxcnVwenJmZXdwamt4eWpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU1NjE3MTIsImV4cCI6MjA1MTEzNzcxMn0.VjAFZvNo3z3MZFuwpUuiKXgvu0uQ3oP5kgJBnlzJUuE';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});