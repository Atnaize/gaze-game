# Game Systems Documentation

## Building System

### Overview
The building system manages the creation, placement, and behavior of all game structures. It uses a combination of Factory, Registry, and Strategy patterns for maximum flexibility and maintainability.

### Architecture Components

#### 1. AbstractBuilding (Base Class)
```typescript
// src/game/buildings/AbstractBuilding.ts
export abstract class AbstractBuilding {
  protected type: BuildingType
  protected cost: Partial<Resources>
  protected baseProduction: ProductionInfo
  protected gazeProduction: ProductionInfo
  protected baseCooldown: number
  protected gazeCooldown: number
  protected maxOutput: number

  // Core methods that concrete buildings implement
  abstract getProductionInfo(): ProductionInfo
  abstract getCooldownInfo(): CooldownInfo
}
```

**Key Properties:**
- `type`: Building identifier
- `cost`: Resource requirements for construction
- `baseProduction`/`gazeProduction`: Output when unwatched/watched
- `baseCooldown`/`gazeCooldown`: Production intervals
- `maxOutput`: Maximum lifetime production

#### 2. BuildingRegistry (Singleton Pattern)
```typescript
// src/game/buildings/BuildingRegistry.ts
export class BuildingRegistry {
  private static instance: BuildingRegistry
  private buildings: Map<BuildingType, AbstractBuilding> = new Map()

  static getInstance(): BuildingRegistry {
    if (!BuildingRegistry.instance) {
      BuildingRegistry.instance = new BuildingRegistry()
    }
    return BuildingRegistry.instance
  }

  getBuilding(type: BuildingType): AbstractBuilding {
    const building = this.buildings.get(type)
    if (!building) {
      throw new Error(`Building type ${type} not found`)
    }
    return building
  }
}
```

**Responsibilities:**
- Centralized building definitions
- Type-safe building lookup
- Singleton access pattern
- Configuration management

#### 3. BuildingFactory (Factory Pattern)
```typescript
// src/game/factories/BuildingFactory.ts
export class BuildingFactory {
  static createBuilding(type: BuildingType, x: number, y: number): Building {
    const id = `${type}_${x}_${y}_${Date.now()}`
    const buildingDef = BuildingRegistry.getInstance().getBuilding(type)

    return {
      id,
      type,
      x,
      y,
      isWatched: false,
      productionCooldown: buildingDef.getBaseCooldown(),
      totalOutput: 0,
      // Phaser objects added by scene
      sprite: null,
      text: null,
      cooldownCircle: null,
      capacityIndicator: null,
      // Building-specific properties
      ...this.getTypeSpecificProperties(type)
    }
  }
}
```

**Features:**
- Unique ID generation
- Type-specific property assignment
- Phaser object initialization
- Cost and color management

### Building Types

#### Farm Building
```typescript
// src/game/buildings/FarmBuilding.ts
export class FarmBuilding extends AbstractBuilding {
  constructor() {
    super()
    this.type = 'farm'
    this.cost = { gold: 20 }
    this.baseProduction = { resourceType: 'food', amount: 1 }
    this.gazeProduction = { resourceType: 'food', amount: 3 }
    this.baseCooldown = 3000  // 3 seconds
    this.gazeCooldown = 1000  // 1 second
    this.maxOutput = 50
  }
}
```

#### Mine Building
```typescript
// src/game/buildings/MineBuilding.ts
export class MineBuilding extends AbstractBuilding {
  constructor() {
    super()
    this.type = 'mine'
    this.cost = { gold: 30 }
    this.baseProduction = { resourceType: 'stone', amount: 1 }
    this.gazeProduction = { resourceType: 'stone', amount: 2 }
    this.baseCooldown = 4000  // 4 seconds
    this.gazeCooldown = 2000  // 2 seconds
    this.maxOutput = 30
  }
}
```

#### Barracks Building
```typescript
// src/game/buildings/BarracksBuilding.ts
export class BarracksBuilding extends AbstractBuilding {
  private maxUnits: number = 5

  constructor() {
    super()
    this.type = 'barracks'
    this.cost = { gold: 50, stone: 10 }
    this.baseProduction = { resourceType: 'soldiers', amount: 1 }
    this.gazeProduction = { resourceType: 'soldiers', amount: 1 }
    this.baseCooldown = 8000  // 8 seconds
    this.gazeCooldown = 5000  // 5 seconds
    this.maxOutput = 25
  }
}
```

### Production System

#### Production Flow
1. **Timer Update**: Buildings have production cooldowns that decrease each frame
2. **Production Trigger**: When cooldown reaches 0, production occurs
3. **Resource Generation**: Based on watched/unwatched status
4. **Capacity Check**: Respect maximum output limits
5. **Cooldown Reset**: Set next production timer

#### Visual Indicators
- **Cooldown Circle**: Shows production progress
- **Capacity Indicator**: Shows lifetime output progress
- **Building Tint**: Different colors for watched/unwatched/maxed states

## Gaze System

### Overview
The gaze system is the core mechanic that affects building productivity. It uses Strategy pattern for different gaze shapes and provides visual feedback for placement.

### Components

#### 1. GazeStrategy (Strategy Pattern)
```typescript
// src/game/strategies/GazeStrategy.ts
export interface GazeStrategy {
  getPattern(size: number, rotation: number): Position[]
}

export class LShapeGaze implements GazeStrategy {
  getPattern(size: number, rotation: number): Position[] {
    // Generate L-shaped pattern based on size and rotation
    // Rotation: 0=right-down, 1=down-left, 2=left-up, 3=up-right
  }
}
```

#### 2. GazeSystem (Upgrade Logic)
```typescript
// src/game/systems/GazeSystem.ts
export class GazeSystem {
  static getUpgradeCost(currentSize: number): number {
    return GameConfig.GAZE_UPGRADE_COST * Math.pow(2, currentSize - 3)
  }

  static canUpgrade(currentSize: number, gold: number): boolean {
    return currentSize < GameConfig.MAX_GAZE_SIZE &&
           gold >= this.getUpgradeCost(currentSize)
  }
}
```

#### 3. Gaze Utilities
```typescript
// src/game/utils/gazeUtils.ts
export function isGazePatternValid(center: Position, size: number, rotation: number): boolean {
  const strategy = new LShapeGaze()
  const pattern = strategy.getPattern(size, rotation)

  return pattern.every(offset => {
    const pos = { x: center.x + offset.x, y: center.y + offset.y }
    return pos.x >= 0 && pos.x < GameConfig.GRID_WIDTH &&
           pos.y >= 0 && pos.y < GameConfig.GRID_HEIGHT
  })
}

export function findBestGazePlacement(clickedPosition: Position, size: number, preferredRotation: number) {
  // Try preferred rotation first
  if (isGazePatternValid(clickedPosition, size, preferredRotation)) {
    return { position: clickedPosition, rotation: preferredRotation }
  }

  // Try other rotations
  for (let rotation = 0; rotation < 4; rotation++) {
    if (rotation !== preferredRotation && isGazePatternValid(clickedPosition, size, rotation)) {
      return { position: clickedPosition, rotation }
    }
  }

  // Find alternative positions near clicked position
  // Implementation details...
}
```

### Two-Stage Rotation System

#### Preview Stage
1. Press `R` key to rotate preview
2. Preview shows white outline of proposed gaze
3. Preview rotation independent of actual gaze
4. Player can see effect before committing

#### Commit Stage
1. Click to place gaze with preview rotation
2. System finds best valid position for preview rotation
3. Actual gaze updates to new position and rotation
4. Preview syncs with actual gaze

### Visual System
- **Gaze Border**: Yellow outline showing active gaze area
- **Preview Border**: White outline showing proposed gaze
- **Building Effects**: Tint changes for watched buildings

## Resource System

### Resource Types
```typescript
// src/types/index.ts
export interface Resources {
  gold: number    // Primary currency
  food: number    // Farm production
  stone: number   // Mine production
  soldiers: number // Barracks production
}
```

### Resource Management
```typescript
// src/stores/gameStore.ts
const useGameStore = create<GameState>((set, get) => ({
  resources: GameConfig.INITIAL_RESOURCES,

  updateResource: (type, amount) => set((state) => ({
    resources: {
      ...state.resources,
      [type]: Math.max(0, state.resources[type] + amount)
    }
  })),

  consumeResource: (type, amount) => {
    const state = get()
    if (state.resources[type] >= amount) {
      set((prevState) => ({
        resources: {
          ...prevState.resources,
          [type]: prevState.resources[type] - amount
        }
      }))
      return true
    }
    return false
  },

  canAfford: (cost) => {
    const { resources } = get()
    return Object.entries(cost).every(([type, amount]) =>
      resources[type as keyof Resources] >= (amount || 0)
    )
  }
}))
```

### Resource Flow
1. **Building Production**: Generate resources over time
2. **Gaze Enhancement**: Increase production rate when watched
3. **Consumption**: Spend resources on buildings and upgrades
4. **Validation**: Check affordability before purchases

## Preview System

### PreviewManager
```typescript
// src/game/managers/PreviewManager.ts
export class PreviewManager {
  private scene: Phaser.Scene
  private previewGraphics: Phaser.GameObjects.Graphics
  private currentStrategy: PreviewStrategy | null = null

  setGazePreview(rotation?: number): void {
    this.currentStrategy = new GazePreviewStrategy(rotation)
  }

  setBuildingPreview(type: BuildingType): void {
    this.currentStrategy = new BuildingPreviewStrategy(type)
  }

  setDemolishPreview(): void {
    this.currentStrategy = new DemolishPreviewStrategy()
  }

  updatePreview(x: number, y: number): void {
    this.clearPreview()

    if (this.currentStrategy && x >= 0 && y >= 0) {
      this.currentStrategy.drawPreview(
        this.previewGraphics,
        { x, y },
        this.gridSize
      )
    }
  }
}
```

### Preview Strategies
- **GazePreviewStrategy**: Shows gaze pattern outline
- **BuildingPreviewStrategy**: Shows building placement
- **DemolishPreviewStrategy**: Shows demolish target

## State Management

### Store Architecture
```typescript
// Stores follow similar patterns
interface StoreState {
  // State properties
  data: SomeType

  // Actions
  updateData: (newData: SomeType) => void
  resetData: () => void
}
```

### GameStore (Main Game State)
- Resources management
- Gaze state (center, size, rotation)
- Game modes (building, demolish)
- Game controls (pause, speed)

### BuildingStore (Building Management)
- Building instances and states
- Building placement/removal
- Building state updates (watched, production)

### EventStore (Game Events)
- Event emission and subscription
- Resource production notifications
- Game state change events

## Input System

### Input Handling Flow
1. **Phaser Input**: Raw pointer/keyboard events
2. **Scene Processing**: Convert to game coordinates
3. **Mode Detection**: Determine current game mode
4. **Action Execution**: Building placement, gaze movement, etc.
5. **State Updates**: Update relevant stores
6. **Visual Feedback**: Update previews and UI

### Input Modes
- **Gaze Mode**: Move and rotate gaze (default)
- **Building Mode**: Place selected building type
- **Demolish Mode**: Remove buildings

### Keyboard Controls
- `R`: Rotate gaze preview
- `D`: Toggle demolish mode
- `ESC`: Reset to gaze mode

## Game Controls

### Pause/Resume System
```typescript
// Game loop respects pause state
update(_time: number, delta: number) {
  const { isPaused, gameSpeed } = useGameStore.getState()

  if (isPaused) {
    return // Skip all updates when paused
  }

  const adjustedDelta = delta * gameSpeed
  this.updateBuildingProduction(adjustedDelta)
}
```

### Speed Control
- **0.5x**: Slow mode for careful planning
- **1x**: Normal speed (default)
- **2x**: Fast mode for quick progression
- **3x**: Very fast mode for late game

## Performance Optimization

### Rendering Optimization
- Use Phaser Graphics API for complex shapes
- Minimize object creation in update loops
- Efficient border rendering with segments
- Conditional visual updates

### Memory Management
- Proper cleanup of Phaser objects
- Store subscription cleanup
- Event listener removal
- Object pooling for frequently used objects

### Update Loop Efficiency
- Delta time-based updates
- Early returns for paused state
- Efficient collision detection
- Minimal state updates

## Error Handling

### Common Patterns
```typescript
// Scene validation
if (!this.add || !this.gazeGraphics) {
  return
}

// Try-catch for Phaser operations
try {
  // Phaser operations
} catch {
  // Scene was destroyed during execution, ignore silently
}

// Null checks before object access
if (building.sprite) {
  building.sprite.tint = 0xffffff
}
```

### Defensive Programming
- Always validate scene state
- Check object existence before use
- Graceful degradation on errors
- Proper cleanup in all code paths

This system architecture provides a solid foundation for the game while maintaining flexibility for future enhancements and ensuring high code quality.