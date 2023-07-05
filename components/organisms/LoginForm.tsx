"use client";

import { useAuth } from "@/components/providers/supabase-auth-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import GoogleIcon from "../atoms/icons/Google";

const LoginForm = () => {
  const [error, setError] = useState<string | null>(null);
  const { signInWithEmail, signInWithGoogle, user } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const [email, password] = new FormData(
      e.target as HTMLFormElement
    ).values() as unknown as string[];

    setError(null);
    try {
      const error = await signInWithEmail(email, password);
      if (error) {
        setError(error);
      }
    } catch (error) {
      console.log("Something went wrong!");
    }
  };

  // Check if there is a user
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user]);

  return (
    <div className="flex flex-col gap-2 bg-slate-800 p-6 rounded-lg">
      <h2 className="text-2xl font-medium text-center text-zinc-100">Entrar</h2>
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <input
          className="input"
          placeholder="Email..."
          type="email"
          name="email"
          id="email"
        />
        <input
          placeholder="Senha..."
          className="input"
          type="password"
          name="password"
          id="password"
        />
        <button type="submit" className="btn">
          Enviar
        </button>
        <span className="hr">OU</span>
        <button className="btn btn-google" onClick={signInWithGoogle}>
          <GoogleIcon />
          <span>Entrar com Google</span>
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
