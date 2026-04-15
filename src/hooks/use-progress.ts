import { useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface ProgressData {
  modulesCompleted: number[];
  quizScore: number;
  quizTotal: number;
  quizCompleted: boolean;
  gameCompleted: boolean;
  gamesPlayed: number;
  simulationCompleted: boolean;
  [key: string]: unknown;
}

const STORAGE_KEY = "doraemon-ai-lab-progress";

const defaultProgress: ProgressData = {
  modulesCompleted: [],
  quizScore: 0,
  quizTotal: 5,
  quizCompleted: false,
  gameCompleted: false,
  gamesPlayed: 0,
  simulationCompleted: false,
};

function loadProgress(): ProgressData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return { ...defaultProgress, ...JSON.parse(raw) };
    }
  } catch {
    // ignore parse errors
  }
  return { ...defaultProgress };
}

function saveProgress(data: ProgressData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Helper to push progress to Supabase
async function syncToSupabase(data: ProgressData) {
  if (!isSupabaseConfigured || !supabase) return;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user?.email) return;

  const email = session.user.email;
  // Upsert users_progress
  await supabase.from("users_progress").upsert({
    email,
    modules_completed: data.modulesCompleted.length,
    quiz_score: data.quizScore,
    game_score: data.gamesPlayed,
    // Add custom fields if backend supports them, otherwise just the needed ones
  }, { onConflict: "email" });

  // Calculate score for leaderboard
  const score = 
    data.modulesCompleted.length * 25 + 
    data.quizScore * 20 + 
    (data.gameCompleted ? 50 : 0) + 
    (data.simulationCompleted ? 50 : 0);

  // Calculate badge (string)
  let badge = "Learner";
  if (data.modulesCompleted.length >= 6 && data.quizCompleted && data.gameCompleted && data.simulationCompleted) {
    badge = "AI Champion";
  } else if (data.quizCompleted && data.quizScore >= 3) {
    badge = "Quiz Master";
  }

  const username = session.user.user_metadata?.name || email.split("@")[0] || "User";

  // Upsert leaderboard
  await supabase.from("leaderboard").upsert({
    username,
    score,
    badge,
  }, { onConflict: "username" });
}

// Fetch from DB on load
async function fetchFromSupabase(): Promise<ProgressData | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user?.email) return null;

  const { data, error } = await supabase
    .from("users_progress")
    .select("*")
    .eq("email", session.user.email)
    .single();

  if (error || !data) return null;

  // We map the backend data back. Note: if the backend only stores counts (modules_completed),
  // we might miss specific module IDs. We'll generate dummy array of length `modules_completed`.
  const modulesCount = data.modules_completed || 0;
  const dummyModules = Array.from({ length: modulesCount }, (_, i) => i + 1);

  return {
    ...defaultProgress,
    modulesCompleted: dummyModules,
    quizScore: data.quiz_score || 0,
    quizCompleted: (data.quiz_score || 0) > 0,
    gamesPlayed: data.game_score || 0,
    gameCompleted: (data.game_score || 0) > 0,
    // simulation is not tracked in the table specs directly, rely on local storage for it if needed,
    // or assume game_score > 1 means simulation completed (hack for now without schema changes)
  };
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressData>(loadProgress);

  // Sync session loading
  useEffect(() => {
    fetchFromSupabase().then(serverProgress => {
      if (serverProgress) {
        setProgress(serverProgress);
        saveProgress(serverProgress);
      }
    });
  }, []);

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setProgress(loadProgress());
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const update = useCallback((partial: Partial<ProgressData>) => {
    setProgress((prev) => {
      const next = { ...prev, ...partial };
      saveProgress(next);
      syncToSupabase(next);
      return next;
    });
  }, []);

  const completeModule = useCallback((moduleId: number) => {
    setProgress((prev) => {
      const ids = prev.modulesCompleted.includes(moduleId)
        ? prev.modulesCompleted
        : [...prev.modulesCompleted, moduleId];
      const next = { ...prev, modulesCompleted: ids };
      saveProgress(next);
      syncToSupabase(next);
      return next;
    });
  }, []);

  const setQuizScore = useCallback((score: number, total: number) => {
    setProgress((prev) => {
      const next = { ...prev, quizScore: score, quizTotal: total, quizCompleted: true };
      saveProgress(next);
      syncToSupabase(next);
      return next;
    });
  }, []);

  const completeGame = useCallback(() => {
    setProgress((prev) => {
      const next = { ...prev, gameCompleted: true, gamesPlayed: prev.gamesPlayed + 1 };
      saveProgress(next);
      syncToSupabase(next);
      return next;
    });
  }, []);

  const resetProgress = useCallback(() => {
    const fresh = { ...defaultProgress };
    saveProgress(fresh);
    setProgress(fresh);
    syncToSupabase(fresh);
  }, []);

  return { progress, update, completeModule, setQuizScore, completeGame, resetProgress };
}
