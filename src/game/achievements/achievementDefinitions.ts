import { Achievement } from '../../types'

export const ACHIEVEMENTS: Achievement[] = [
  // Combat Achievements
  {
    id: 'first_blood',
    name: 'First Blood',
    description: 'Defeat your first enemy',
    category: 'combat',
    rarity: 'common',
    icon: '⚔️',
    hidden: false,
    checkCondition: (state) => state.battleStats.enemyKills >= 1
  },
  {
    id: 'rambo',
    name: 'One Man Army',
    description: 'Defeat 100 enemies (They drew first blood, not me)',
    category: 'combat',
    rarity: 'rare',
    icon: '💪',
    hidden: false,
    checkCondition: (state) => ({
      current: state.battleStats.enemyKills,
      required: 100
    })
  },
  {
    id: 'doom_slayer',
    name: 'Rip and Tear',
    description: 'Defeat 500 enemies until it is done',
    category: 'combat',
    rarity: 'epic',
    icon: '😈',
    hidden: false,
    checkCondition: (state) => ({
      current: state.battleStats.enemyKills,
      required: 500
    })
  },
  {
    id: 'this_is_sparta',
    name: 'THIS. IS. SPARTA!',
    description: 'Survive wave 300',
    category: 'combat',
    rarity: 'legendary',
    icon: '🛡️',
    hidden: false,
    checkCondition: (state) => state.highestWave >= 300
  },
  {
    id: 'pyrrhic_victory',
    name: 'Pyrrhic Victory',
    description: 'Win a wave with all soldiers dead',
    category: 'combat',
    rarity: 'rare',
    icon: '💀',
    hidden: true,
    checkCondition: (state) => false // Needs special event tracking
  },

  // Economy Achievements
  {
    id: 'gold_rush',
    name: 'Gold Rush',
    description: 'Accumulate 1000 gold',
    category: 'economy',
    rarity: 'common',
    icon: '💰',
    hidden: false,
    checkCondition: (state) => state.resources.gold >= 1000
  },
  {
    id: 'scrooge_mcduck',
    name: 'Swimming in Gold',
    description: 'Earn 10,000 total gold (Life is like a hurricane)',
    category: 'economy',
    rarity: 'rare',
    icon: '💎',
    hidden: false,
    checkCondition: (state) => ({
      current: state.totalGoldEarned,
      required: 10000
    })
  },
  {
    id: 'stonks',
    name: 'Stonks',
    description: 'Have 500 of each resource at once',
    category: 'economy',
    rarity: 'epic',
    icon: '📈',
    hidden: false,
    checkCondition: (state) =>
      state.resources.gold >= 500 &&
      state.resources.food >= 500 &&
      state.resources.stone >= 500 &&
      state.resources.soldiers >= 500
  },

  // Building Achievements
  {
    id: 'humble_beginnings',
    name: 'Humble Beginnings',
    description: 'Place your first building',
    category: 'building',
    rarity: 'common',
    icon: '🏠',
    hidden: false,
    checkCondition: (state) => state.buildings.length >= 1
  },
  {
    id: 'sim_city',
    name: 'Urban Planner',
    description: 'Build 25 buildings',
    category: 'building',
    rarity: 'rare',
    icon: '🏙️',
    hidden: false,
    checkCondition: (state) => ({
      current: state.buildings.length,
      required: 25
    })
  },
  {
    id: 'military_industrial_complex',
    name: 'Military Industrial Complex',
    description: 'Build 10 barracks',
    category: 'building',
    rarity: 'rare',
    icon: '🏰',
    hidden: false,
    checkCondition: (state) => ({
      current: state.buildingCounts.barracks || 0,
      required: 10
    })
  },
  {
    id: 'farm_simulator',
    name: 'Farming Simulator',
    description: "It ain't much, but it's honest work (20 farms)",
    category: 'building',
    rarity: 'common',
    icon: '🌾',
    hidden: false,
    checkCondition: (state) => ({
      current: state.buildingCounts.farm || 0,
      required: 20
    })
  },
  {
    id: 'minecraft',
    name: 'Mine Diamonds',
    description: 'Build 15 mines',
    category: 'building',
    rarity: 'common',
    icon: '⛏️',
    hidden: false,
    checkCondition: (state) => ({
      current: state.buildingCounts.mine || 0,
      required: 15
    })
  },

  // Survival Achievements
  {
    id: 'rookie',
    name: 'Rookie Defender',
    description: 'Survive 5 waves',
    category: 'survival',
    rarity: 'common',
    icon: '🌊',
    hidden: false,
    checkCondition: (state) => state.totalWaves >= 5
  },
  {
    id: 'veteran',
    name: 'Veteran Commander',
    description: 'Survive 25 waves',
    category: 'survival',
    rarity: 'rare',
    icon: '🎖️',
    hidden: false,
    checkCondition: (state) => ({
      current: state.totalWaves,
      required: 25
    })
  },
  {
    id: 'legendary_defender',
    name: 'Legendary Defender',
    description: 'Survive 100 waves',
    category: 'survival',
    rarity: 'epic',
    icon: '👑',
    hidden: false,
    checkCondition: (state) => ({
      current: state.totalWaves,
      required: 100
    })
  },
  {
    id: 'they_are_billions',
    name: 'The Few Against Many',
    description: 'Survive 50 waves (They are billions reference)',
    category: 'survival',
    rarity: 'epic',
    icon: '🏛️',
    hidden: false,
    checkCondition: (state) => state.highestWave >= 50
  },

  // Misc Achievements
  {
    id: 'hello_world',
    name: 'Hello World!',
    description: 'Start your first game',
    category: 'misc',
    rarity: 'common',
    icon: '👋',
    hidden: false,
    checkCondition: (state) => state.totalPlayTime > 0
  },
  {
    id: 'no_life',
    name: 'Dedication',
    description: 'Play for 60 minutes total',
    category: 'misc',
    rarity: 'rare',
    icon: '⏰',
    hidden: false,
    checkCondition: (state) => ({
      current: Math.floor(state.totalPlayTime / 60000),
      required: 60
    })
  },
  {
    id: 'eye_of_sauron',
    name: 'Eye of Sauron',
    description: 'Upgrade your gaze 5 times (One does not simply...)',
    category: 'misc',
    rarity: 'rare',
    icon: '👁️',
    hidden: false,
    checkCondition: (state) => ({
      current: state.gazeUpgrades,
      required: 5
    })
  },
  {
    id: 'fresh_start',
    name: 'Rise from the Ashes',
    description: 'Lose your first game',
    category: 'misc',
    rarity: 'common',
    icon: '🔥',
    hidden: false,
    checkCondition: (state) => state.gameOver && state.totalWaves > 0
  },
  {
    id: 'dark_souls',
    name: 'You Died',
    description: 'Lose 10 times (Git gud)',
    category: 'misc',
    rarity: 'rare',
    icon: '☠️',
    hidden: false,
    checkCondition: (state) => false // Needs death counter tracking
  },
  {
    id: 'konami_code',
    name: 'Up Up Down Down',
    description: 'A secret achievement',
    category: 'misc',
    rarity: 'legendary',
    icon: '🎮',
    hidden: true,
    checkCondition: (state) => false // Secret achievement
  },
  {
    id: 'over_9000',
    name: "It's Over 9000!",
    description: 'Defeat over 9000 enemies',
    category: 'combat',
    rarity: 'legendary',
    icon: '💥',
    hidden: false,
    checkCondition: (state) => ({
      current: state.battleStats.enemyKills,
      required: 9000
    })
  },
  {
    id: 'all_your_base',
    name: 'All Your Base',
    description: 'Are belong to us (Build 100 buildings)',
    category: 'building',
    rarity: 'legendary',
    icon: '🏗️',
    hidden: false,
    checkCondition: (state) => ({
      current: state.buildings.length,
      required: 100
    })
  }
]

export const getAchievementById = (id: string): Achievement | undefined => {
  return ACHIEVEMENTS.find(a => a.id === id)
}

export const getAchievementsByCategory = (category: string): Achievement[] => {
  return ACHIEVEMENTS.filter(a => a.category === category)
}

export const getAchievementsByRarity = (rarity: string): Achievement[] => {
  return ACHIEVEMENTS.filter(a => a.rarity === rarity)
}