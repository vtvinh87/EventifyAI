import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qtsggtmrriyacybaqhkt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0c2dndG1ycml5YWN5YmFxaGt0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MTI1NDUsImV4cCI6MjA3NjM4ODU0NX0.rW3akrZcA0jmYCgTkF_C5AuuvE9WgCcoKciDi9Yu-yk';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase URL and Anon Key are not configured. Database features will be disabled.");
}

// FIX: Export the configured Supabase client to enable database interactions throughout the application.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
