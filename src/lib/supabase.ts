import { createClient, SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (client) return client;
  const url = "https://zhgtxvfwljwvofvqwtpc.supabase.co";
  const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpoZ3R4dmZ3bGp3dm9mdnF3dHBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMDI4NjUsImV4cCI6MjA4NjU3ODg2NX0.hk3DDUJijCW2kEYGxVwaUV8h0_K6nTszu_ODJIBVWkk";
  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }
  client = createClient(url, key);
  return client;
}
