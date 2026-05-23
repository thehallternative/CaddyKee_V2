import { createClient } from '@supabase/supabase-js';

// Looks for the environment handles first, falls back directly to your verified tokens if blank
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xdnhwityhjuideusgcvh.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhkbmh3aXR5aGp1aWRldXNnY3ZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4MzA3ODIsImV4cCI6MjA4NDQwNjc4Mn0.vAPf9TV3p8OJgL7sqxaOIeNOaONkKZCO9d9xIHdehnM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);