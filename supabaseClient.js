// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vogewdoilqaqjlshdzue.supabase.co'; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvZ2V3ZG9pbHFhcWpsc2hkenVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEzMjQ3OTUsImV4cCI6MjA0NjkwMDc5NX0.T1YTNPKH5Caxp1CQYiO6zwGKVcY7UHU0UkOYo6vdVGc'; // Replace with your Supabase anon key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
