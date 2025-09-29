# API Reference & Development Guidelines

## Table of Contents
1. [Core APIs](#core-apis)
2. [Store APIs](#store-apis)
3. [Building System APIs](#building-system-apis)
4. [Gaze System APIs](#gaze-system-apis)
5. [Development Patterns](#development-patterns)
6. [Testing Guidelines](#testing-guidelines)
7. [Performance Best Practices](#performance-best-practices)

## Core APIs

### GameConfig
Central configuration class containing all game constants.

```typescript
export class GameConfig {
  // Grid Configuration
  static readonly GRID_SIZE = 60
  static readonly GRID_WIDTH = 4
  static readonly GRID_HEIGHT = 4
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
  static readonly BUILDING_ACTIVE_TINT = 0xffffff
  static readonly BUILDING_INACTIVE_TINT = 0xaaaaaa

  // Game Control Configuration
  static readonly DEFAULT_GAME_SPEED = 1
  static readonly SPEED_OPTIONS = [0.5, 1, 2, 3]
}
```

### Type Definitions
Core TypeScript interfaces and types.

```typescript
// src/types/index.ts

export interface Position {
  x: number
  y: number
}

export interface Resources {
  gold: number
  food: number
  stone: number
  soldiers: number
}

export type BuildingType = 'farm' | 'mine' | 'barracks'

export interface Building {
  id: string
  type: BuildingType
  x: number
  y: number
  isWatched: boolean
  productionCooldown: number
  totalOutput: number
  // Phaser objects
  sprite: Phaser.GameObjects.Rectangle | null
  text: Phaser.GameObjects.Text | null
  cooldownCircle: Phaser.GameObjects.Graphics | null
  capacityIndicator: Phaser.GameObjects.Graphics | null
}

export interface Barracks extends Building {
  type: 'barracks'
  unitCount: number
  maxUnits: number
}

export interface ProductionInfo {
  resourceType: keyof Resources
  amount: number
}

export interface GameMode {
  demolish: boolean
  building: BuildingType | null
}
```

## Store APIs

### GameStore
Main game state management with resources, gaze, and game controls.

```typescript
interface GameState {
  // State
  resources: Resources
  gazeCenter: Position
  gazeSize: number
  gazeRotation: number
  gameMode: GameMode
  isPaused: boolean
  gameSpeed: number

  // Resource Actions
  updateResource: (type: keyof Resources, amount: number) => void
  consumeResource: (type: keyof Resources, amount: number) => boolean
  canAfford: (cost: Partial<Resources>) => boolean

  // Gaze Actions
  moveGaze: (position: Position) => void
  rotateGaze: () => void
  upgradeGaze: () => boolean

  // Mode Actions
  setDemolishMode: (active: boolean) => void
  setBuildingMode: (type: BuildingType | null) => void
  resetModes: () => void

  // Game Control Actions
  pauseGame: () => void
  resumeGame: () => void
  setGameSpeed: (speed: number) => void
}

// Usage Examples
const useGameStoreExample = () => {
  // Reading state
  const { resources, gazeCenter, isPaused } = useGameStore()

  // Using actions
  const { updateResource, moveGaze, pauseGame } = useGameStore()

  // In event handlers
  const handlePause = () => pauseGame()
  const handleResourceUpdate = () => updateResource('gold', 50)

  return { resources, handlePause, handleResourceUpdate }
}
```

### BuildingStore
Building instance management and state tracking.

```typescript
interface BuildingState {
  // State
  buildings: Building[]

  // Query Actions
  getAllBuildings: () => Building[]
  getBuildingAt: (x: number, y: number) => Building | undefined
  getBuildingById: (id: string) => Building | undefined

  // Mutation Actions
  addBuilding: (building: Building) => void
  removeBuilding: (position: Position) => void
  updateBuilding: (id: string, updates: Partial<Building>) => void
  updateBuildingStates: (gazePositions: Position[]) => void
}

// Usage Examples
const useBuildingStoreExample = () => {
  const { buildings, addBuilding, getBuildingAt } = useBuildingStore()

  const placeFarm = (x: number, y: number) => {
    const existing = getBuildingAt(x, y)
    if (!existing) {
      const farm = BuildingFactory.createBuilding('farm', x, y)
      addBuilding(farm)
    }
  }

  return { buildings, placeFarm }
}
```

### EventStore
Game event system for notifications and logging.

```typescript
interface EventState {
  // State
  events: GameEvent[]

  // Actions
  emit: (type: string, data: any) => void
  getEvents: () => GameEvent[]
  clearEvents: () => void
  useEventListener: (event: string, callback: (data: any) => void) => void
}

// Usage Examples
const useEventStoreExample = () => {
  const { emit, useEventListener } = useEventStore()

  // Emit events
  const handleResourceProduction = (building: Building) => {
    emit('resource_produced', {
      type: 'gold',
      amount: 10,
      building
    })
  }

  // Listen to events
  useEventListener('resource_produced', (data) => {
  })

  return { handleResourceProduction }
}
```

## Building System APIs

### AbstractBuilding
Base class for all building types.

```typescript
export abstract class AbstractBuilding {
  protected type: BuildingType
  protected cost: Partial<Resources>
  protected baseProduction: ProductionInfo
  protected gazeProduction: ProductionInfo
  protected baseCooldown: number
  protected gazeCooldown: number
  protected maxOutput: number

  // Getters
  getType(): BuildingType
  getCost(): Partial<Resources>
  getBaseProduction(): ProductionInfo
  getGazeProduction(): ProductionInfo
  getBaseCooldown(): number
  getGazeCooldown(): number
  getMaxOutput(): number

  // Abstract methods (implement in concrete classes)
  abstract getProductionInfo(): ProductionInfo
  abstract getCooldownInfo(): { base: number; gaze: number }
}

// Implementation Example
export class FarmBuilding extends AbstractBuilding {
  constructor() {
    super()
    this.type = 'farm'
    this.cost = { gold: 20 }
    this.baseProduction = { resourceType: 'food', amount: 1 }
    this.gazeProduction = { resourceType: 'food', amount: 3 }
    this.baseCooldown = 3000
    this.gazeCooldown = 1000
    this.maxOutput = 50
  }

  getProductionInfo(): ProductionInfo {
    return this.baseProduction
  }

  getCooldownInfo() {
    return {
      base: this.baseCooldown,
      gaze: this.gazeCooldown
    }
  }
}
```

### BuildingRegistry
Singleton registry for building definitions.

```typescript
export class BuildingRegistry {
  private static instance: BuildingRegistry
  private buildings: Map<BuildingType, AbstractBuilding> = new Map()

  static getInstance(): BuildingRegistry
  getBuilding(type: BuildingType): AbstractBuilding
  getAllBuildingTypes(): BuildingType[]

  // Usage
  const registry = BuildingRegistry.getInstance()
  const farmDef = registry.getBuilding('farm')
  const cost = farmDef.getCost()
}
```

### BuildingFactory
Factory for creating building instances.

```typescript
export class BuildingFactory {
  static createBuilding(type: BuildingType, x: number, y: number): Building
  static getBuildingCost(type: BuildingType): Partial<Resources>
  static getBuildingColor(type: BuildingType): number
  static getBuildingLabel(type: BuildingType): string

  // Usage
  const farm = BuildingFactory.createBuilding('farm', 2, 1)
  const cost = BuildingFactory.getBuildingCost('farm')
  const color = BuildingFactory.getBuildingColor('farm')
}
```

## Gaze System APIs

### GazeStrategy
Strategy pattern for different gaze shapes.

```typescript
export interface GazeStrategy {
  getPattern(size: number, rotation: number): Position[]
}

export class LShapeGaze implements GazeStrategy {
  getPattern(size: number, rotation: number): Position[] {
    // Returns array of relative positions forming L-shape
    // Rotation: 0=right-down, 1=down-left, 2=left-up, 3=up-right
  }
}

// Usage
const strategy = new LShapeGaze()
const pattern = strategy.getPattern(3, 0) // Size 3, no rotation
```

### GazeSystem
Gaze upgrade and validation logic.

```typescript
export class GazeSystem {
  static getUpgradeCost(currentSize: number): number
  static canUpgrade(currentSize: number, gold: number): boolean
  static getMaxSize(): number

  // Usage
  const currentSize = 3
  const cost = GazeSystem.getUpgradeCost(currentSize) // 100 gold
  const canUpgrade = GazeSystem.canUpgrade(currentSize, 150) // true
}
```

### Gaze Utilities
Utility functions for gaze placement and validation.

```typescript
// src/game/utils/gazeUtils.ts

export function isGazePatternValid(
  center: Position,
  size: number,
  rotation: number
): boolean

export function findBestGazePlacement(
  clickedPosition: Position,
  size: number,
  preferredRotation: number
): { position: Position; rotation: number }

export function getGazePositions(
  center: Position,
  size: number,
  rotation: number
): Position[]

// Usage Examples
const isValid = isGazePatternValid({ x: 1, y: 1 }, 3, 0)
const placement = findBestGazePlacement({ x: 2, y: 2 }, 3, 1)
const positions = getGazePositions({ x: 1, y: 1 }, 3, 0)
```

## Development Patterns

### Adding New Building Types

1. **Create Building Class**
```typescript
// src/game/buildings/NewBuilding.ts
export class NewBuilding extends AbstractBuilding {
  constructor() {
    super()
    this.type = 'newBuilding' // Add to BuildingType union first
    this.cost = { gold: 100, stone: 20 }
    this.baseProduction = { resourceType: 'newResource', amount: 2 }
    this.gazeProduction = { resourceType: 'newResource', amount: 5 }
    this.baseCooldown = 5000
    this.gazeCooldown = 2000
    this.maxOutput = 40
  }

  getProductionInfo(): ProductionInfo {
    return this.baseProduction
  }

  getCooldownInfo() {
    return { base: this.baseCooldown, gaze: this.gazeCooldown }
  }
}
```

2. **Register Building**
```typescript
// src/game/buildings/BuildingRegistry.ts
constructor() {
  this.buildings.set('farm', new FarmBuilding())
  this.buildings.set('mine', new MineBuilding())
  this.buildings.set('barracks', new BarracksBuilding())
  this.buildings.set('newBuilding', new NewBuilding()) // Add here
}
```

3. **Update Factory**
```typescript
// src/game/factories/BuildingFactory.ts
static getBuildingColor(type: BuildingType): number {
  switch (type) {
    case 'farm': return 0x90EE90
    case 'mine': return 0x8B4513
    case 'barracks': return 0xFF6347
    case 'newBuilding': return 0x9370DB // Add color
    default: return 0xFFFFFF
  }
}
```

4. **Update Types**
```typescript
// src/types/index.ts
export type BuildingType = 'farm' | 'mine' | 'barracks' | 'newBuilding'
```

### Adding New UI Components

1. **Create Component**
```typescript
// src/components/NewComponent.tsx
import React from 'react'
import { useGameStore } from '../stores/gameStore'

interface NewComponentProps {
  title?: string
  onAction?: () => void
}

const NewComponent: React.FC<NewComponentProps> = ({
  title = 'Default Title',
  onAction
}) => {
  const { resources } = useGameStore()

  const handleClick = () => {
    onAction?.()
  }

  return (
    <div className="new-component">
      <h3>{title}</h3>
      <p>Gold: {resources.gold}</p>
      <button onClick={handleClick}>Action</button>
    </div>
  )
}

export default NewComponent
```

2. **Add Styles**
```css
/* src/styles/game.css */
.new-component {
  background: rgba(0, 0, 0, 0.8);
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.new-component h3 {
  margin: 0 0 10px 0;
  color: #3498db;
}

.new-component button {
  background: #27ae60;
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}
```

3. **Integrate Component**
```typescript
// src/components/GameContainer.tsx
import NewComponent from './NewComponent'

export const GameContainer: React.FC = () => {
  return (
    <div className="game-app">
      <GameControls />
      <NewComponent onAction={() => console.log('Action!')} />
      {/* Other components */}
    </div>
  )
}
```

### Configuration Pattern

1. **Add Constants**
```typescript
// src/config/GameConfig.ts
export class GameConfig {
  // Existing constants...

  // New Feature Configuration
  static readonly NEW_FEATURE_ENABLED = true
  static readonly NEW_FEATURE_COOLDOWN = 5000
  static readonly NEW_FEATURE_COST = 100
}
```

2. **Use in Implementation**
```typescript
// Any implementation file
import { GameConfig } from '../config/GameConfig'

if (GameConfig.NEW_FEATURE_ENABLED) {
  // Feature logic using GameConfig.NEW_FEATURE_COOLDOWN
}
```

## Testing Guidelines

### Unit Testing Pattern
```typescript
// tests/utils/gazeUtils.test.ts
import { isGazePatternValid, findBestGazePlacement } from '../src/game/utils/gazeUtils'

describe('gazeUtils', () => {
  describe('isGazePatternValid', () => {
    it('should return true for valid gaze placement', () => {
      const result = isGazePatternValid({ x: 1, y: 1 }, 3, 0)
      expect(result).toBe(true)
    })

    it('should return false for out-of-bounds placement', () => {
      const result = isGazePatternValid({ x: 3, y: 3 }, 3, 0)
      expect(result).toBe(false)
    })
  })

  describe('findBestGazePlacement', () => {
    it('should find valid placement for given parameters', () => {
      const result = findBestGazePlacement({ x: 2, y: 2 }, 3, 1)
      expect(result).toHaveProperty('position')
      expect(result).toHaveProperty('rotation')
    })
  })
})
```

### Component Testing Pattern
```typescript
// tests/components/GameControls.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import GameControls from '../src/components/GameControls'

describe('GameControls', () => {
  it('should render pause button when game is running', () => {
    render(<GameControls />)
    expect(screen.getByText('⏸️ Pause')).toBeInTheDocument()
  })

  it('should toggle to resume button when clicked', () => {
    render(<GameControls />)
    const pauseButton = screen.getByText('⏸️ Pause')
    fireEvent.click(pauseButton)
    expect(screen.getByText('▶️ Resume')).toBeInTheDocument()
  })
})
```

## Performance Best Practices

### Phaser Optimization
```typescript
// Efficient rendering patterns
class KingGazeScene extends Phaser.Scene {
  // Use object pooling for frequently created objects
  private rectanglePool: Phaser.GameObjects.Rectangle[] = []

  getPooledRectangle(): Phaser.GameObjects.Rectangle {
    return this.rectanglePool.pop() || this.add.rectangle(0, 0, 0, 0)
  }

  returnToPool(rect: Phaser.GameObjects.Rectangle) {
    rect.setVisible(false)
    this.rectanglePool.push(rect)
  }

  // Efficient update loop
  update(_time: number, delta: number) {
    const { isPaused, gameSpeed } = useGameStore.getState()

    // Early return for paused state
    if (isPaused) return

    // Apply speed modifier
    const adjustedDelta = delta * gameSpeed

    // Batch operations
    this.updateBuildingProduction(adjustedDelta)
  }

  // Use Graphics API for complex shapes
  private drawComplexShape() {
    this.graphics.clear()
    this.graphics.lineStyle(2, 0xffffff)
    this.graphics.strokeRect(x, y, width, height)
  }
}
```

### React Optimization
```typescript
// Memoization for expensive calculations
const ExpensiveComponent: React.FC<Props> = ({ data }) => {
  const expensiveValue = useMemo(() => {
    return complexCalculation(data)
  }, [data])

  return <div>{expensiveValue}</div>
}

// Component memoization
const MemoizedComponent = React.memo(ExpensiveComponent)

// Custom hook for complex state logic
const useOptimizedGameState = () => {
  const resources = useGameStore(state => state.resources)
  const updateResource = useGameStore(state => state.updateResource)

  // Only re-render when resources change
  return useMemo(() => ({
    resources,
    updateResource
  }), [resources, updateResource])
}
```

### Memory Management
```typescript
// Proper cleanup patterns
const useCleanup = () => {
  useEffect(() => {
    const unsubscribe = useGameStore.subscribe((state) => {
      // Handle state changes
    })

    return () => {
      unsubscribe() // Cleanup subscription
    }
  }, [])
}

// Phaser cleanup
class KingGazeScene extends Phaser.Scene {
  shutdown() {
    // Cleanup store subscriptions
    this.storeUnsubscribe?.()

    // Cleanup managers
    this.previewManager?.destroy()

    // Phaser handles sprite cleanup automatically
  }
}
```

This API reference provides comprehensive coverage of all major systems and patterns used in the King Gaze Game, enabling efficient development and maintenance.