// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://fuhqxfbyvrklxggecynt.supabase.co'; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1aHF4ZmJ5dnJrbHhnZ2VjeW50Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4ODk0MzcsImV4cCI6MjA1MzQ2NTQzN30.0r2cHr8g6nNwjaVaVGuXjo9MXNFu9_rx40j5Bb3Ib2Q'; // Replace with your Supabase anon key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
