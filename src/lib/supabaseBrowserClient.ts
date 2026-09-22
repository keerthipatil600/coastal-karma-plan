import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Browser Supabase client.
 *
 * Uses only the public URL + publishable/anon key exposed through Vite env vars.
 * No service-role or secret key is ever referenced here, so nothing privileged
 * can reach the browser bundle. Returns null when the project is not configured
 * yet, so callers can show an honest "not connected" state instead of failing.
 */

const url =
  import.meta.env['VITE_SUPABASE_URL'] ?? undefined;
const publishableKey =
  import.meta.env['VITE_SUPABASE_PUBLISHABLE_KEY'] ??
  import.meta.env['VITE_SUPABASE_ANON_KEY'] ??
  undefined;

let client: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return Boolean(url && publishableKey);
}

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!client) {
    client = createClient(url as string, publishableKey as string, {
      auth: { persistSession: false },
    });
  }
  return client;
}
