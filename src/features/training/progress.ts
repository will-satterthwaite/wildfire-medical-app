const progressKey = "lineready-training-progress";

export type StoredProgress = {
  streak: number;
  xp: number;
  completedScenarioIds: string[];
  lastCompletedDate?: string;
};

export const defaultProgress: StoredProgress = {
  streak: 0,
  xp: 0,
  completedScenarioIds: []
};

export function loadProgress(): StoredProgress {
  if (typeof window === "undefined") {
    return defaultProgress;
  }

  const stored = window.localStorage.getItem(progressKey);
  if (!stored) {
    return defaultProgress;
  }

  try {
    return { ...defaultProgress, ...JSON.parse(stored) };
  } catch {
    return defaultProgress;
  }
}

export function saveProgress(progress: StoredProgress) {
  window.localStorage.setItem(progressKey, JSON.stringify(progress));
}

export function completeScenario(
  progress: StoredProgress,
  scenarioId: string,
  earnedXp: number
): StoredProgress {
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  const alreadyCompletedToday = progress.lastCompletedDate === today;
  const continuedStreak = progress.lastCompletedDate === yesterday;
  const streak = alreadyCompletedToday
    ? progress.streak
    : continuedStreak
      ? progress.streak + 1
      : 1;

  return {
    streak,
    xp: progress.xp + earnedXp,
    lastCompletedDate: today,
    completedScenarioIds: Array.from(
      new Set([...progress.completedScenarioIds, scenarioId])
    )
  };
}
