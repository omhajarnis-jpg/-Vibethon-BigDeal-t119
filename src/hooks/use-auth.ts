import { useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export interface User {
  email: string;
  name: string;
  createdAt: string;
}

interface AuthData {
  users: Record<string, { password: string; user: User }>;
  currentUser: string | null;
}

function loadLocalAuth(): LocalAuthData {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { users: {}, currentUser: null };
}

function saveLocalAuth(data: LocalAuthData) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(data));
}

// ─── Convert Supabase user to our User type ───
function supabaseUserToUser(su: SupabaseUser): User {
  return {
    email: su.email || "",
    name: su.user_metadata?.name || su.email?.split("@")[0] || "User",
    createdAt: su.created_at || new Date().toISOString(),
  };
}

export function useAuth() {
  const [localAuth, setLocalAuth] = useState<LocalAuthData>(loadLocalAuth);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  // ─── Supabase session listener ───
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setSupabaseUser(supabaseUserToUser(session.user));
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setSupabaseUser(supabaseUserToUser(session.user));
      } else {
        setSupabaseUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // ─── Determine current user ───
  const currentUser: User | null = isSupabaseConfigured
    ? supabaseUser
    : localAuth.currentUser
      ? localAuth.users[localAuth.currentUser]?.user ?? null
      : null;

  const isLoggedIn = !!currentUser;

  // ─── Signup ───
  const signup = useCallback(async (email: string, password: string, name: string): Promise<{ ok: boolean; error?: string }> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } },
        });
        if (error) return { ok: false, error: error.message };
        if (data.user) {
          setSupabaseUser(supabaseUserToUser(data.user));
          // Initialize progress in database
          try {
            await supabase.from("users_progress").upsert({
              email,
              modules_completed: 0,
              quiz_score: 0,
              game_score: 0,
            }, { onConflict: "email" });
          } catch { /* ignore if table doesn't exist yet */ }
        }
        return { ok: true };
      } catch (err) {
        return { ok: false, error: err instanceof Error ? err.message : "Signup failed" };
      }
    }

    // localStorage fallback
    const a = loadLocalAuth();
    if (a.users[email]) return { ok: false, error: "Email already registered" };
    if (password.length < 4) return { ok: false, error: "Password must be at least 4 characters" };
    const user: User = { email, name, createdAt: new Date().toISOString() };
    a.users[email] = { password, user };
    a.currentUser = email;
    saveLocalAuth(a);
    setLocalAuth(a);
    return { ok: true };
  }, []);

  // ─── Login ───
  const login = useCallback(async (email: string, password: string): Promise<{ ok: boolean; error?: string }> => {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { ok: false, error: error.message };
        if (data.user) {
          setSupabaseUser(supabaseUserToUser(data.user));
        }
        return { ok: true };
      } catch (err) {
        return { ok: false, error: err instanceof Error ? err.message : "Login failed" };
      }
    }

    // localStorage fallback
    const a = loadLocalAuth();
    const entry = a.users[email];
    if (!entry) return { ok: false, error: "User not found" };
    if (entry.password !== password) return { ok: false, error: "Incorrect password" };
    a.currentUser = email;
    saveLocalAuth(a);
    setLocalAuth(a);
    return { ok: true };
  }, []);

  // ─── Logout ───
  const logout = useCallback(async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
      setSupabaseUser(null);
      return;
    }

    // localStorage fallback
    const a = loadLocalAuth();
    a.currentUser = null;
    saveLocalAuth(a);
    setLocalAuth(a);
  }, []);

  // ─── Sync with localStorage storage events ───
  useEffect(() => {
    if (isSupabaseConfigured) return;
    const handler = (e: StorageEvent) => {
      if (e.key === AUTH_KEY) setLocalAuth(loadLocalAuth());
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  return { currentUser, isLoggedIn, loading, signup, login, logout };
}
