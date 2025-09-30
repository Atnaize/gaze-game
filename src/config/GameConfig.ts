export class GameConfig {
  // Grid Configuration
  static readonly GRID_SIZE = 90
  static readonly INITIAL_GRID_WIDTH = 6
  static readonly INITIAL_GRID_HEIGHT = 6
  static readonly MAX_GRID_WIDTH = 10
  static readonly MAX_GRID_HEIGHT = 10

  // Legacy grid values (will be replaced by dynamic values)
  static readonly GRID_WIDTH = 6
  static readonly GRID_HEIGHT = 6

  // Canvas Configuration (will be dynamic)
  static readonly CANVAS_WIDTH = this.GRID_WIDTH * this.GRID_SIZE
  static readonly CANVAS_HEIGHT = this.GRID_HEIGHT * this.GRID_SIZE

  // Gaze Configuration
  static readonly INITIAL_GAZE_CENTER = { x: 1, y: 1 }
  static readonly INITIAL_GAZE_SIZE = 3
  static readonly INITIAL_GAZE_ROTATION = 0
  static readonly GAZE_UPGRADE_COST = 50
  static readonly MAX_GAZE_SIZE = 6

  // Resource Configuration
  static readonly INITIAL_RESOURCES = {
    gold: 1000,
    food: 10,
    stone: 5,
    soldiers: 0
  }

  // Visual Configuration
  static readonly GAZE_BORDER_COLOR = 0xffd700
  static readonly GAZE_BORDER_WIDTH = 3
  static readonly GRID_LINE_COLOR = 0x444444
  static readonly GRID_LINE_WIDTH = 1

  // Building Visual States
  static readonly BUILDING_ACTIVE_TINT = 0xffffff
  static readonly BUILDING_INACTIVE_TINT = 0xaaaaaa

  // Barracks Max Capacity Indicator
  static readonly BARRACKS_FULL_COLOR = 0xff0000
  static readonly BARRACKS_FULL_ALPHA = 0.8
  static readonly BARRACKS_INDICATOR_COLOR = 0xffffff
  static readonly BARRACKS_INDICATOR_SIZE = 8

  // Game Control Configuration
  static readonly DEFAULT_GAME_SPEED = 1
  static readonly SPEED_OPTIONS = [0.5, 1, 2, 5, 10]

  // Battle Configuration
  static readonly BATTLE_AREA_WIDTH = 400
  static readonly BATTLE_AREA_HEIGHT = 600
  static readonly SPAWN_RATE = 2000
  static readonly ATTACK_RANGE = 20

  // Wave System Configuration
  static readonly INITIAL_WAVE_SIZE = 1
  static readonly WAVE_SIZE_INCREASE = 2
  static readonly WAVE_INTERVAL = 60000
  static readonly WAVE_DIFFICULTY_MULTIPLIER = 1.2
  static readonly BASE_WAVE_REWARD = 50

  // Battle Arena Positioning
  static readonly SOLDIER_SPAWN_X = 50
  static readonly ENEMY_SPAWN_X = 350
  static readonly BATTLE_CENTER_Y = 300

  // Sprite Configuration
  static readonly ENEMY_SPRITE_SCALE = 0.1
  static readonly SPRITE_BASE_URL = 'sprites'

  // Animation Configuration
  static readonly SPRITE_IDLE_FRAME_RATE = 8
  static readonly SPRITE_WALK_FRAME_RATE = 20
  static readonly SPRITE_RUN_FRAME_RATE = 20
  static readonly SPRITE_ATTACK_FRAME_RATE = 20
  static readonly SPRITE_HURT_FRAME_RATE = 20
  static readonly SPRITE_DEATH_FRAME_RATE = 20
  static readonly MAX_FRAMES_PER_ANIMATION = 15

  // Enemy Configuration
  static readonly ENEMY_HEALTH_MULTIPLIER = 1.0
  static readonly ENEMY_SPEED_MULTIPLIER = 1.0
  static readonly ENEMY_ATTACK_MULTIPLIER = 1.0
  static readonly ENEMY_REWARD_MULTIPLIER = 1.0

  // Death Animation Configuration
  static readonly DEATH_FADE_DELAY = 2000 // 2 seconds before starting fade
  static readonly DEATH_FADE_DURATION = 1500 // 1.5 seconds to fade out

  // Kingdom Wall Configuration
  static readonly KINGDOM_WALL_MAX_HP = 1000
  static readonly KINGDOM_WALL_X = 25 // Left side of battle area
  static readonly KINGDOM_WALL_WIDTH = 20
  static readonly KINGDOM_WALL_HEIGHT = 400
  static readonly KINGDOM_WALL_Y = 100 // Center vertically in battle area

  // Kingdom Wall Visual States
  static readonly WALL_FULL_COLOR = 0x8B4513 // Brown - strong wall
  static readonly WALL_DAMAGED_COLOR = 0x654321 // Darker brown - damaged
  static readonly WALL_CRITICAL_COLOR = 0x2F1B14 // Very dark brown - nearly destroyed
  static readonly WALL_CRACK_COLOR = 0x000000 // Black cracks

  // Wall Damage Thresholds
  static readonly WALL_DAMAGED_THRESHOLD = 0.66 // 66% HP
  static readonly WALL_CRITICAL_THRESHOLD = 0.33 // 33% HP

  // Unit Collision Configuration
  static readonly UNIT_COLLISION_RADIUS = 30 // Minimum distance between units
  static readonly UNIT_SEPARATION_FORCE = 1 // Strength of collision avoidance

  // Ally Wandering Behavior (when no enemies present)
  static readonly ALLY_WANDER_RADIUS = 150 // How far from wall allies can wander
  static readonly ALLY_WANDER_IDLE_MIN = 2000 // Min time (ms) to idle at a spot
  static readonly ALLY_WANDER_IDLE_MAX = 4000 // Max time (ms) to idle at a spot
  static readonly ALLY_WANDER_SPEED_MULTIPLIER = 0.5 // Slower movement when wandering

  // Combat System Configuration
  static readonly ATTACK_COOLDOWN = 1000 // Time (ms) between attacks for all units
}