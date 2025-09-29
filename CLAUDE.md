# King Gaze Game - Claude AI Assistant Configuration

## Project Overview
King Gaze Game is a React + Phaser.js tower defense-style resource management game where players place buildings, manage resources, and control a "gaze" system that activates buildings within its coverage area.

**Key Features:**
- Real-time resource production (gold, food, stone, soldiers)
- Strategic building placement with gaze optimization
- L-shaped gaze pattern with rotation mechanics
- Pause/resume and speed control (0.5x to 3x)
- Visual feedback systems and production indicators

## Core Architecture Principles

### Design Philosophy
- **Configuration-Driven**: All values in `GameConfig.ts`, zero hardcoded constants
- **Type Safety First**: Strict TypeScript, no `any` types, comprehensive interfaces
- **Pattern-Based**: Factory, Registry, Strategy, Observer patterns throughout
- **Phaser-Optimized**: Maximum use of Phaser capabilities, efficient rendering
- **Modular & Reusable**: Single responsibility, DRY principles, composition over inheritance

### Critical Patterns to Follow
1. **Config First**: Always add constants to `GameConfig.ts` before implementation
2. **Type Safety**: Define interfaces in `types/index.ts` before coding
3. **No Hardcoding**: All magic numbers must be configurable
4. **Phaser Graphics API**: Use for complex visual elements (borders, indicators)
5. **Zustand Stores**: Reactive state management with proper patterns

## Project Structure (Essential Locations)

```
src/
├── config/GameConfig.ts          # 🎯 ALL game constants here
├── types/index.ts                # 🎯 ALL TypeScript interfaces
├── stores/                       # 🎯 Zustand state management
│   ├── gameStore.ts             # Resources, gaze, game controls
│   ├── buildingStore.ts         # Building instances and states
│   └── eventStore.ts            # Game events system
├── game/                        # 🎯 Core Phaser game logic
│   ├── KingGazeScene.ts         # Main scene with game loop
│   ├── buildings/               # Building system (Factory + Registry)
│   ├── strategies/              # Gaze patterns (Strategy pattern)
│   ├── systems/                 # Game systems (GazeSystem)
│   └── utils/                   # Pure functions and utilities
├── components/                  # React UI layer
│   ├── GameContainer.tsx        # Main layout
│   ├── GameControls.tsx         # Pause/speed controls
│   └── [Building/Gaze/Resource]Controls.tsx
└── docs/                        # 📚 Comprehensive documentation
    ├── ARCHITECTURE.md          # System architecture
    ├── GAME_SYSTEMS.md          # Detailed game mechanics
    └── API_REFERENCE.md         # Development guidelines
```

## Critical System Knowledge

### 1. Building System Architecture
```typescript
AbstractBuilding (base) → Concrete Buildings → BuildingRegistry (definitions) → BuildingFactory (creation)
```
- **Adding Buildings**: Extend `AbstractBuilding`, register in `BuildingRegistry`, update `BuildingFactory`
- **Production Logic**: Base vs Gaze production rates, cooldowns, max output limits
- **Visual System**: Sprites, cooldown circles, capacity indicators

### 2. Gaze System (Core Mechanic)
- **L-Shaped Pattern**: Strategic coverage area that affects building productivity
- **Two-Stage Rotation**: Preview rotation (`R` key) → Commit on click
- **Smart Placement**: Auto-finds valid positions with preferred rotation
- **Visual Feedback**: Yellow border (active), white border (preview)

### 3. State Management (Zustand)
```typescript
// Pattern for all store actions
const updateSomething = (data) => set((state) => ({
  property: newValue
}))
```
- **gameStore**: Resources, gaze state, game modes, pause/speed
- **buildingStore**: Building instances, watched states, production
- **eventStore**: Game events and notifications

### 4. Configuration Management
```typescript
// GameConfig.ts - Single source of truth
export class GameConfig {
  static readonly SOME_VALUE = 100  // Always use static readonly
  static readonly BUILDING_COSTS = { farm: { gold: 20 } }  // Nested configs OK
}
```

## Development Workflow

### When Adding Features
1. **Read Documentation First**: Check `docs/` for existing patterns
2. **Config Phase**: Add all constants to `GameConfig.ts`
3. **Type Phase**: Define interfaces in `types/index.ts`
4. **Implementation Phase**: Use existing patterns and systems
5. **Integration Phase**: Update stores and UI components
6. **Documentation Phase**: Update relevant docs if architectural changes

### When Debugging Issues
1. **Scene Validity**: Always check `if (!this.add || !this.scene)` for Phaser operations
2. **State Inspection**: Use Zustand devtools for store debugging
3. **Performance**: Check for object creation in update loops
4. **Memory Leaks**: Verify cleanup in component unmount and scene shutdown

### Key File Locations for Common Tasks

#### Adding New Building Type
1. `src/game/buildings/NewBuilding.ts` - Create class extending `AbstractBuilding`
2. `src/game/buildings/BuildingRegistry.ts` - Register in constructor
3. `src/game/factories/BuildingFactory.ts` - Add creation logic
4. `src/types/index.ts` - Add to `BuildingType` union

#### Modifying Gaze Behavior
1. `src/game/strategies/GazeStrategy.ts` - Pattern logic
2. `src/game/utils/gazeUtils.ts` - Placement and validation
3. `src/game/KingGazeScene.ts` - Visual rendering and interaction

#### Adding UI Features
1. `src/components/` - React components
2. `src/styles/game.css` - Styling
3. `src/stores/` - State management if needed

#### Changing Game Balance
1. `src/config/GameConfig.ts` - Modify constants
2. `src/game/buildings/` - Update building definitions if needed

## Critical Implementation Details

### Phaser Integration Best Practices
```typescript
// Always validate scene state
if (!this.add || !this.gazeGraphics) return

// Use try-catch for Phaser operations
try {
  // Phaser operations
} catch {
  // Scene destroyed, ignore silently
}

// Use Graphics API for complex shapes
this.gazeGraphics.lineStyle(width, color)
this.gazeGraphics.strokeRect(x, y, width, height)
```

### Performance Requirements
- **No Console Logs**: Remove all `console.log` statements
- **Delta Time**: Use `deltaTime * gameSpeed` for time-based updates
- **Object Pooling**: Reuse Phaser objects when possible
- **Efficient Updates**: Early returns for paused state

### Error Handling Patterns
```typescript
// Store operations
const { building } = useBuildingStore.getState()
if (!building) return

// Null safety for Phaser objects
if (building.sprite) {
  building.sprite.tint = 0xffffff
}

// Resource validation
if (!canAfford(cost)) return false
```

## Code Quality Standards

### Naming Conventions
- **Classes/Interfaces/Components**: `PascalCase` (`BuildingFactory`, `GameStore`)
- **Functions/Variables**: `camelCase` (`updateResource`, `gazeCenter`)
- **Constants**: `SCREAMING_SNAKE_CASE` (`GRID_SIZE`, `MAX_GAZE_SIZE`)
- **Files**: Match class name or descriptive camelCase

### TypeScript Requirements
- **Strict Mode**: No `any` types allowed
- **Interface First**: Define types before implementation
- **Null Safety**: Handle `undefined`/`null` explicitly
- **Generic Types**: Use where appropriate

### Architecture Rules
- **Single Responsibility**: One clear purpose per class/component
- **No Duplication**: Extract common logic to utilities
- **Configuration**: Use `GameConfig.ts` for all constants
- **Separation**: React UI ↔ Phaser Game ↔ Business Logic

## Testing and Validation

### Build Commands
```bash
npm run build     # TypeScript compilation and Vite build
npm run lint      # ESLint code quality check
npm run dev       # Development server
```

### Common Issues to Check
- **TypeScript Errors**: Run `npm run build` to catch type issues
- **Linting Issues**: Run `npm run lint` for code quality
- **Memory Leaks**: Check component cleanup and store subscriptions
- **Performance**: Monitor frame rates and object creation

## Documentation Maintenance

### When to Update Documentation
- **New Systems**: Any new game mechanics or architectural patterns
- **API Changes**: Modifications to existing interfaces or methods
- **Configuration**: New constants or config structure changes
- **Patterns**: Introduction of new design patterns or practices

### Documentation Files to Update
- **CLAUDE.md**: This file - high-level guidance and workflows
- **docs/ARCHITECTURE.md**: System architecture and design patterns
- **docs/GAME_SYSTEMS.md**: Detailed game mechanics and implementation
- **docs/API_REFERENCE.md**: Development guidelines and code examples

## Quick Reference

### Essential Commands
- `R` key: Rotate gaze preview
- `D` key: Toggle demolish mode
- Click: Place building/move gaze
- Pause/Speed controls: Top of game interface

### Key Constants Location
```typescript
// src/config/GameConfig.ts
GRID_SIZE, GRID_WIDTH, GRID_HEIGHT         // World dimensions
INITIAL_RESOURCES, GAZE_UPGRADE_COST       // Game balance
BUILDING_COSTS (via BuildingRegistry)      // Economic balance
SPEED_OPTIONS, DEFAULT_GAME_SPEED          // Game controls
```

### Store Access Patterns
```typescript
// Reading state
const { resources, gazeCenter } = useGameStore()

// Updating state
const { updateResource, moveGaze } = useGameStore()

// Getting current state in non-React code
const state = useGameStore.getState()
```

This configuration provides everything needed to effectively work with the King Gaze Game codebase while maintaining code quality and architectural consistency.