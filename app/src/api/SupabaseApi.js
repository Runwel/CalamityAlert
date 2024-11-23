import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://osdpvwtthelyqotmghew.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zZHB2d3R0aGVseXFvdG1naGV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA2OTg4MTIsImV4cCI6MjA0NjI3NDgxMn0.KckK3yyIchIOUNr0H3TJX15eCclgcjPIy7eum9wsllU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);