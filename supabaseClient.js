// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ixdvhtnzvbnbxmtkqyxe.supabase.co'; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4ZHZodG56dmJuYnhtdGtxeXhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkzMTczOTEsImV4cCI6MjA0NDg5MzM5MX0.NUVrCRc0LTWhXZMsuZYIsLLiH_zhckfRygoi88Sue70'; // Replace with your Supabase anon key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
