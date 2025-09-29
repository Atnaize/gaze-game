import { create } from 'zustand'
import { BattleArenaState, BattleStats, Wave } from '../types/index'

interface BattleStore extends BattleArenaState {
  // Actions
  updateArenaState: (state: Partial<BattleArenaState>) => void
  updateStats: (stats: Partial<BattleStats>) => void
  setCurrentWave: (wave: Wave | null) => void
  incrementWave: () => void
  addTreasure: (amount: number) => void
  resetArena: () => void
}

const initialState: BattleArenaState = {
  soldiers: [],
  enemies: [],
  currentWave: null,
  nextWaveTime: 15000, // 15 seconds until first wave
  battleInProgress: false,
  totalWaves: 0,
  stats: {
    soldierKills: 0,
    enemyKills: 0,
    totalBattles: 0,
    goldEarned: 0
  },
  kingdomWall: {
    currentHP: 1000, // Will be initialized properly by BattleManager
    maxHP: 1000,
    isDestroyed: false
  },
  gameOver: false
}

export const useBattleStore = create<BattleStore>((set, get) => ({
  ...initialState,

  updateArenaState: (newState) => set((state) => ({
    ...state,
    ...newState
  })),

  updateStats: (newStats) => set((state) => ({
    ...state,
    stats: {
      ...state.stats,
      ...newStats
    }
  })),

  setCurrentWave: (wave) => set((state) => ({
    ...state,
    currentWave: wave
  })),

  incrementWave: () => set((state) => ({
    ...state,
    totalWaves: state.totalWaves + 1
  })),

  addTreasure: (amount) => set((state) => ({
    ...state,
    stats: {
      ...state.stats,
      goldEarned: state.stats.goldEarned + amount
    }
  })),

  resetArena: () => set(() => ({
    ...initialState,
    nextWaveTime: 15000 // 15 seconds until first wave (in accumulated time)
  }))
}))