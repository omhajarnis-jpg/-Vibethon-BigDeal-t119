import { useState, useEffect, useCallback } from "react";

export interface ProgressData {
  modulesCompleted: number[];    // IDs of completed modules
  quizScore: number;             // latest quiz score
  quizTotal: number;             // total quiz questions
  quizCompleted: boolean;        // whether quiz was finished
  gameCompleted: boolean;        // whether mini game reached a result
  gamesPlayed: number;           // number of times game was played
}

const STORAGE_KEY = "doraemon-ai-lab-progress";

const defaultProgress: ProgressData = {
  modulesCompleted: [],
  quizScore: 0,
  quizTotal: 5,
  quizCompleted: false,
  gameCompleted: false,
  gamesPlayed: 0,
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

export function useProgress() {
  const [progress, setProgress] = useState<ProgressData>(loadProgress);

  // Sync across tabs
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
      return next;
    });
  }, []);

  const setQuizScore = useCallback((score: number, total: number) => {
    setProgress((prev) => {
      const next = { ...prev, quizScore: score, quizTotal: total, quizCompleted: true };
      saveProgress(next);
      return next;
    });
  }, []);

  const completeGame = useCallback(() => {
    setProgress((prev) => {
      const next = { ...prev, gameCompleted: true, gamesPlayed: prev.gamesPlayed + 1 };
      saveProgress(next);
      return next;
    });
  }, []);

  const resetProgress = useCallback(() => {
    const fresh = { ...defaultProgress };
    saveProgress(fresh);
    setProgress(fresh);
  }, []);

  return { progress, update, completeModule, setQuizScore, completeGame, resetProgress };
}
