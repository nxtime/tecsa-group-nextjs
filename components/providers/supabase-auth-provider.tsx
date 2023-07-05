"use client";

import axios from "axios";
import { Session } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect } from "react";
import useSWR from "swr";
import { useSupabase } from "./supabase-provider";
interface ContextI {
  user: any;
  error: any;
  isLoading: boolean;
  mutate: any;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<string | null>;
}
const Context = createContext<ContextI>({
  user: null,
  error: null,
  isLoading: true,
  mutate: null,
  signOut: async () => {},
  signInWithGoogle: async () => {},
  signInWithEmail: async (email: string, password: string) => null
});

export default function SupabaseAuthProvider({
  serverSession,
  children
}: {
  serverSession?: Session | null;
  children: React.ReactNode;
}) {
  const { supabase } = useSupabase();
  const router = useRouter();

  const getUser = async () => {
    const { data: user } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", serverSession?.user?.id)
      .single();
    // .single();
    if (error) {
      console.log(error);
      return null;
    } else {
      return user;
    }
  };

  const {
    data: user,
    error,
    isLoading,
    mutate
  } = useSWR(serverSession ? "profile-context" : null, getUser);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google"
    });
  };

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return error.message;
    }

    return null;
  };

  useEffect(() => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(serverSession?.access_token !== session?.access_token);

      if (serverSession?.access_token !== session?.access_token) {
        switch (event) {
          case "SIGNED_OUT":
            axios.post("/api/logs", {
              type: "logout",
              userId: serverSession?.user.id
            });
            break;
          case "SIGNED_IN":
            axios.post("/api/logs", {
              type: "login",
              userId: session?.user.id
            });
            break;
        }
      }

      if (session?.access_token !== serverSession?.access_token) {
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase, serverSession?.access_token]);

  const exposed: ContextI = {
    user,
    error,
    isLoading,
    mutate,
    signOut,
    signInWithGoogle,
    signInWithEmail
  };

  return <Context.Provider value={exposed}>{children}</Context.Provider>;
}

export const useAuth = () => {
  let context = useContext(Context);
  if (context === undefined) {
    throw new Error("useAuth must be used inside SupabaseAuthProvider");
  } else {
    return context;
  }
};
