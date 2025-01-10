import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fpriqrupzrfewpjkxyjp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZwcmlxcnVwenJmZXdwamt4eWpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4OTg1NzUsImV4cCI6MjAyNTQ3NDU3NX0.VvvTzz2XEwVOXNPzKF5Oc-iBZ9yXK3KGwXqQnyTRVKY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});