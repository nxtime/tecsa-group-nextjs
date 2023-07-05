import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { cookies, headers } from "next/headers";
import "server-only";

export const createClient = () =>
  createServerComponentSupabaseClient({
    headers,
    cookies,
  });
