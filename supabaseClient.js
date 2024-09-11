// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://mxyippuwkpysdexmxrbm.supabase.co'; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14eWlwcHV3a3B5c2RleG14cmJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk5NzI1ODcsImV4cCI6MjAyNTU0ODU4N30.ed2YgcvYOoajEOc-NkcTpwW1Bhb79sWoRWKGHZDdxHM'; // Replace with your Supabase anon key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
