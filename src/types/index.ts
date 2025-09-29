// Base types
export interface Position {
  x: number
  y: number
}

export interface GameEntity {
  id: string
  x: number
  y: number
}

export type BuildingType = 'farm' | 'mine' | 'barracks'

export interface BuildingCost {
  gold?: number
  food?: number
  stone?: number
  soldiers?: number
}

export interface Resources {
  gold: number
  food: number
  stone: number
  soldiers: number
}

// Building interfaces
export interface Building extends GameEntity {
  type: BuildingType
  isWatched: boolean
  cost: BuildingCost
  productionCooldown: number
  maxCooldown: number
  resourceOutputs: Record<keyof Resources, number> // Track output per resource type
  sprite?: Phaser.GameObjects.Rectangle | Phaser.GameObjects.Image
  text?: Phaser.GameObjects.Text
  cooldownCircle?: Phaser.GameObjects.Graphics
  capacityIndicator?: Phaser.GameObjects.Graphics
  remainingProductionText?: Phaser.GameObjects.Text // Text showing remaining production amounts
  soldierCountText?: Phaser.GameObjects.Text // Text showing current/max soldiers for barracks
}

export interface Farm extends Building {
  type: 'farm'
}

export interface Mine extends Building {
  type: 'mine'
}

export interface Barracks extends Building {
  type: 'barracks'
  unitCount: number
  maxUnits: number
}

// Game interfaces
export interface PreviewData {
  x: number
  y: number
  color: number
  alpha: number
  strokeColor: number
  strokeAlpha: number
  strokeWidth: number
  showAffordability?: boolean
  canAfford?: boolean
}

export interface GameConfig {
  GRID_SIZE: number
  GRID_WIDTH: number
  GRID_HEIGHT: number
}

export interface GazeState {
  center: Position
  size: number
  rotation: number
}

export interface GameMode {
  demolish: boolean
  building: BuildingType | null
}

// Battle system types
export type SoldierType = 'infantry' | 'archer' | 'cavalry'
export type EnemyType =
  | 'skeleton_warrior_1' | 'skeleton_warrior_2' | 'skeleton_warrior_3'
  | 'skeleton_crusader_1' | 'skeleton_crusader_2' | 'skeleton_crusader_3'
  | 'fallen_angels_1' | 'fallen_angels_2' | 'fallen_angels_3'
  | 'reaper_man_1' | 'reaper_man_2' | 'reaper_man_3'
  | 'necromancer_of_the_shadow_1' | 'necromancer_of_the_shadow_2' | 'necromancer_of_the_shadow_3'
  | 'dark_oracle_1' | 'dark_oracle_2' | 'dark_oracle_3'
  | 'zombie_villager_1' | 'zombie_villager_2' | 'zombie_villager_3'
  | 'wraith_01' | 'wraith_02' | 'wraith_03'
  | 'valkyrie_1' | 'valkyrie_2' | 'valkyrie_3'
  | 'golem_1' | 'golem_2' | 'golem_3'
  | 'minotaur_1' | 'minotaur_2' | 'minotaur_3'
  | 'goblin'
  | 'ogre' | 'orc' | 'troll'
export type UnitState = 'idle' | 'moving' | 'attacking' | 'dead' | 'hurt'

export interface Unit extends GameEntity {
  health: number
  maxHealth: number
  attack: number
  speed: number
  state: UnitState
  target?: Unit
  sprite?: Phaser.GameObjects.Graphics | Phaser.GameObjects.Sprite
  healthBar?: Phaser.GameObjects.Graphics
  takeDamage(damage: number): void
  update(deltaTime: number, gameSpeed: number): void
  destroy(): void
  createSprite(scene: Phaser.Scene): void
  createAnimatedSprite?(scene: Phaser.Scene): void
}

export interface Soldier extends Unit {
  type: SoldierType
  faction: 'player'
  setEnemies(enemies: Enemy[]): void
}

export interface Enemy extends Unit {
  type: EnemyType
  faction: 'enemy'
  reward: number
  setSoldiers(soldiers: Soldier[]): void
}

export interface BattleStats {
  soldierKills: number
  enemyKills: number
  totalBattles: number
  goldEarned: number
}

export interface Wave {
  number: number
  enemyCount: number
  enemyTypes: EnemyType[]
  difficultyMultiplier: number
  reward: number
  status: 'pending' | 'active' | 'completed' | 'failed'
  spawned?: boolean
}

export interface KingdomWall {
  currentHP: number
  maxHP: number
  sprite?: Phaser.GameObjects.Graphics
  hpBar?: Phaser.GameObjects.Graphics
  hpText?: Phaser.GameObjects.Text
  isDestroyed: boolean
}

export interface BattleArenaState {
  soldiers: Soldier[]
  enemies: Enemy[]
  currentWave: Wave | null
  nextWaveTime: number
  battleInProgress: boolean
  totalWaves: number
  stats: BattleStats
  kingdomWall: KingdomWall
  gameOver: boolean
}

export interface EventData {
  resource_changed: { type: keyof Resources, amount: number }
  resource_produced: { type: string, amount: number, building: Building }
  gaze_moved: { position: Position }
  gaze_rotated: { rotation: number }
  building_placed: { building: Building }
  building_removed: { position: Position }
  unit_spawned: { unit: Unit }
  unit_died: { unit: Unit, killer?: Unit }
  battle_started: { position: Position }
  battle_ended: { winner: 'player' | 'enemy' | 'draw' }
}

// Sprite System Types
export interface SpriteMetadata {
  name: string
  folderPath: string
  animations: AnimationData[]
}

export interface AnimationData {
  name: string
  frames: string[]
  frameRate: number
  repeat: boolean
}

export interface EnemyConfig {
  type: EnemyType
  spriteKey: string
  health: number
  attack: number
  speed: number
  reward: number
  description: string
}