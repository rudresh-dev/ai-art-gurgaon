// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://dvomtdfgsaposxyigjbw.supabase.co'; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2b210ZGZnc2Fwb3N4eWlnamJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5ODc1MTMsImV4cCI6MjA0OTU2MzUxM30.Tc3IpnOwa7i5pA-v7ZohiSUliZ8twy-vbgowUrYyAdk'; // Replace with your Supabase anon key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
