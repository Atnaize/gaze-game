import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Achievement, GameStateSnapshot } from '../types'

interface AchievementState {
  unlockedAchievements: string[]
  achievementProgress: Record<string, { current: number, required: number }>
  lastChecked: number
  notifications: Array<{ id: string, achievement: Achievement, timestamp: number }>
}

interface AchievementStore extends AchievementState {
  unlockAchievement: (achievementId: string) => void
  updateProgress: (achievementId: string, current: number, required: number) => void
  checkAchievements: (achievements: Achievement[], gameState: GameStateSnapshot) => void
  dismissNotification: (achievementId: string) => void
  clearNotifications: () => void
  isUnlocked: (achievementId: string) => boolean
  getProgress: (achievementId: string) => { current: number, required: number } | undefined
  resetAchievements: () => void
}

const initialState: AchievementState = {
  unlockedAchievements: [],
  achievementProgress: {},
  lastChecked: Date.now(),
  notifications: []
}

export const useAchievementStore = create<AchievementStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      unlockAchievement: (achievementId: string) => set((state) => {
        if (state.unlockedAchievements.includes(achievementId)) {
          return state
        }

        const newProgress = { ...state.achievementProgress }
        delete newProgress[achievementId]

        return {
          unlockedAchievements: [...state.unlockedAchievements, achievementId],
          achievementProgress: newProgress
        }
      }),

      updateProgress: (achievementId: string, current: number, required: number) => set((state) => ({
        achievementProgress: {
          ...state.achievementProgress,
          [achievementId]: { current, required }
        }
      })),

      checkAchievements: (achievements: Achievement[], gameState: GameStateSnapshot) => {
        const state = get()
        const newUnlocks: Array<{ id: string, achievement: Achievement }> = []

        for (const achievement of achievements) {
          if (state.unlockedAchievements.includes(achievement.id)) {
            continue
          }

          const result = achievement.checkCondition(gameState)

          if (typeof result === 'boolean') {
            if (result) {
              newUnlocks.push({ id: achievement.id, achievement })
            }
          } else {
            get().updateProgress(achievement.id, result.current, result.required)
            if (result.current >= result.required) {
              newUnlocks.push({ id: achievement.id, achievement })
            }
          }
        }

        if (newUnlocks.length > 0) {
          set((state) => ({
            unlockedAchievements: [
              ...state.unlockedAchievements,
              ...newUnlocks.map(u => u.id)
            ],
            notifications: [
              ...state.notifications,
              ...newUnlocks.map(u => ({
                id: u.id,
                achievement: u.achievement,
                timestamp: Date.now()
              }))
            ],
            lastChecked: Date.now()
          }))
        } else {
          set({ lastChecked: Date.now() })
        }
      },

      dismissNotification: (achievementId: string) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== achievementId)
      })),

      clearNotifications: () => set({ notifications: [] }),

      isUnlocked: (achievementId: string) => {
        return get().unlockedAchievements.includes(achievementId)
      },

      getProgress: (achievementId: string) => {
        return get().achievementProgress[achievementId]
      },

      resetAchievements: () => set(initialState)
    }),
    {
      name: 'gaze-game-achievements',
      partialize: (state) => ({
        unlockedAchievements: state.unlockedAchievements,
        achievementProgress: state.achievementProgress
      })
    }
  )
)