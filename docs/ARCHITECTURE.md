# King Gaze Game - Architecture Documentation

## Overview

King Gaze Game is a React + Phaser.js tower defense-style game where players manage resources, place buildings, and control a "gaze" system that activates buildings within its area. The architecture emphasizes modularity, type safety, and separation of concerns.

## Core Architecture Principles

### 1. **Separation of Concerns**
- **React Layer**: UI components, state management, user interactions
- **Phaser Layer**: Game rendering, physics, visual effects, game loop
- **Business Logic**: Game rules, calculations, building behaviors
- **Configuration**: Centralized constants and settings

### 2. **Design Patterns**
- **Factory Pattern**: Building creation (`BuildingFactory`)
- **Registry Pattern**: Building definitions (`BuildingRegistry`)
- **Strategy Pattern**: Gaze patterns (`GazeStrategy`)
- **Observer Pattern**: State management with Zustand
- **Singleton Pattern**: Registries and game systems

### 3. **Data Flow**
```
User Input → React Components → Zustand Stores → Phaser Scene → Visual Updates
                    ↓                ↓
            Business Logic ← Game Systems ← Building Registry
```

## Project Structure

```
src/
├── components/              # React UI Components
│   ├── GameContainer.tsx       # Main layout container
│   ├── GameCanvas.tsx          # Phaser game wrapper
│   ├── GameControls.tsx        # Pause/speed controls
│   ├── GameUI.tsx              # Resource/control panels
│   ├── ResourcePanel.tsx       # Resource display
│   ├── BuildingControls.tsx    # Building placement UI
│   └── GazeControls.tsx        # Gaze system controls
│
├── config/                  # Configuration
│   └── GameConfig.ts           # All game constants
│
├── game/                    # Phaser Game Logic
│   ├── KingGazeScene.ts        # Main Phaser scene
│   │
│   ├── buildings/              # Building System
│   │   ├── AbstractBuilding.ts     # Base building class
│   │   ├── FarmBuilding.ts         # Farm implementation
│   │   ├── MineBuilding.ts         # Mine implementation
│   │   ├── BarracksBuilding.ts     # Barracks implementation
│   │   ├── BuildingRegistry.ts     # Building registry
│   │   └── index.ts                # Exports
│   │
│   ├── factories/              # Creation Patterns
│   │   └── BuildingFactory.ts      # Building instance factory
│   │
│   ├── managers/               # Game Managers
│   │   └── PreviewManager.ts       # Building placement preview
│   │
│   ├── strategies/             # Strategy Patterns
│   │   ├── GazeStrategy.ts         # Gaze pattern definitions
│   │   └── PreviewStrategy.ts      # Preview display strategies
│   │
│   ├── systems/               # Game Systems
│   │   └── GazeSystem.ts          # Gaze upgrade logic
│   │
│   └── utils/                 # Utilities
│       └── gazeUtils.ts           # Gaze calculation helpers
│
├── hooks/                   # React Hooks
│   ├── useBuildingProduction.ts   # Production logic
│   └── useGameInput.ts            # Input handling
│
├── stores/                  # State Management
│   ├── gameStore.ts               # Game state (resources, gaze)
│   ├── buildingStore.ts           # Building state
│   └── eventStore.ts              # Event system
│
├── styles/                  # Styling
│   └── game.css                   # Game-specific styles
│
└── types/                   # TypeScript Definitions
    └── index.ts                   # All type definitions
```

## Core Systems

### 1. Building System

#### Architecture
```
AbstractBuilding (base class)
    ↓
Concrete Buildings (FarmBuilding, MineBuilding, BarracksBuilding)
    ↓
BuildingRegistry (definitions) ← BuildingFactory (creation)
    ↓
BuildingStore (state management)
```

#### Key Classes
- **AbstractBuilding**: Base class with common properties
- **BuildingRegistry**: Singleton holding building definitions
- **BuildingFactory**: Creates building instances with Phaser sprites
- **BuildingStore**: Zustand store managing building state

#### Adding New Buildings
1. Create class extending `AbstractBuilding`
2. Register in `BuildingRegistry` constructor
3. Add factory logic in `BuildingFactory` if needed
4. Update UI components for new building type

### 2. Gaze System

#### Components
- **GazeStrategy**: Defines different gaze patterns (L-shape, square, etc.)
- **GazeSystem**: Handles upgrade costs and validation
- **gazeUtils**: Placement and validation utilities
- **PreviewManager**: Visual preview system

#### Two-Stage Rotation Design
1. **Preview Stage**: Press `R` to rotate preview (white outline)
2. **Commit Stage**: Click to place gaze with preview rotation

### 3. State Management (Zustand)

#### Stores
- **gameStore**: Resources, gaze state, game controls, modes
- **buildingStore**: Building instances and states
- **eventStore**: Game events and notifications

#### Benefits
- Type-safe state management
- Reactive updates
- Minimal boilerplate
- Easy testing

### 4. Resource System

#### Flow
```
Buildings → Production → Resources → UI Updates
    ↓           ↓           ↓
Gaze Effect → Multipliers → Visual Feedback
```

#### Production Logic
- Base production rate (unwatched buildings)
- Enhanced production rate (watched buildings in gaze)
- Maximum output limits
- Cooldown timers with visual indicators

## Configuration System

### GameConfig.ts
Central configuration file containing all game constants:

```typescript
export class GameConfig {
  // Grid Configuration
  static readonly GRID_SIZE = 60
  static readonly GRID_WIDTH = 4
  static readonly GRID_HEIGHT = 4

  // Resource Configuration
  static readonly INITIAL_RESOURCES = { ... }

  // Visual Configuration
  static readonly GAZE_BORDER_COLOR = 0xffd700

  // Building Costs (via BuildingRegistry)
  // Game Speed Options
  // etc.
}
```

### Benefits
- Single source of truth
- Easy balancing and tweaking
- No hardcoded values
- Type-safe configuration

## Visual System

### Phaser Integration
- **KingGazeScene**: Main Phaser scene
- **Graphics Objects**: Efficient rendering for UI elements
- **Sprite Management**: Building representations
- **Visual Feedback**: Cooldowns, capacity indicators, gaze borders

### Performance Considerations
- Graphics API for complex shapes (gaze borders)
- Object pooling for frequently created/destroyed objects
- Efficient update loops with delta time
- Minimal object creation in render loops

## Input System

### Multi-Modal Input
- **Mouse**: Building placement, gaze movement
- **Keyboard**: Gaze rotation (R), demolish mode (D)
- **UI Controls**: Building selection, game controls

### Preview System
- Real-time preview of building placement
- Gaze rotation preview
- Visual feedback for valid/invalid positions

## Development Guidelines

### Code Quality Standards
1. **TypeScript Strict Mode**: No `any` types, proper interfaces
2. **Single Responsibility**: Each class/component has one purpose
3. **DRY Principle**: No repeated code, centralized configuration
4. **Error Handling**: Graceful degradation, proper cleanup
5. **Performance**: Efficient algorithms, minimal object creation

### Naming Conventions
- **Classes**: PascalCase (`BuildingFactory`)
- **Methods/Variables**: camelCase (`updateResource`)
- **Constants**: SCREAMING_SNAKE_CASE (`GRID_SIZE`)
- **Files**: PascalCase for classes, camelCase for utilities

### Testing Strategy
- **Unit Tests**: Pure functions and business logic
- **Component Tests**: React Testing Library
- **Integration Tests**: Full game flow
- **Performance Tests**: Frame rate monitoring

## Common Patterns

### Adding New Features
1. **Config First**: Add constants to `GameConfig.ts`
2. **Types Second**: Define interfaces in `types/index.ts`
3. **Core Logic**: Implement in appropriate system/class
4. **UI Integration**: Create/update React components
5. **State Management**: Update relevant stores

### Error Handling
```typescript
try {
  // Phaser operations
} catch {
  // Scene was destroyed during execution, ignore silently
}
```

### State Updates
```typescript
// Zustand pattern
const updateResource = (type: keyof Resources, amount: number) =>
  set((state) => ({
    resources: {
      ...state.resources,
      [type]: Math.max(0, state.resources[type] + amount)
    }
  }))
```

## Performance Optimization

### Rendering
- Use Phaser Graphics API for complex shapes
- Minimize state updates in render loops
- Efficient collision detection
- Object pooling for frequently used objects

### Memory Management
- Proper cleanup in component unmount
- Phaser object destruction
- Store subscription cleanup
- Event listener removal

### Update Loops
- Delta time-based updates
- Conditional rendering
- Efficient algorithms for position calculations

## Future Enhancements

### Planned Features
- **Save System**: Game state persistence
- **Audio System**: Sound effects and music
- **Animation System**: Enhanced visual feedback
- **Multiplayer**: State synchronization
- **Mobile Support**: Touch controls

### Scalability Considerations
- Modular architecture supports easy extension
- Configuration-driven design allows rapid iteration
- Type safety prevents regression bugs
- Clean separation of concerns enables team development

## Debugging Guidelines

### Common Issues
- **Null Reference Errors**: Always check scene validity
- **Memory Leaks**: Ensure proper cleanup
- **Performance Issues**: Avoid object creation in loops
- **State Synchronization**: Use proper Zustand patterns

### Debugging Tools
- Phaser DevTools for scene inspection
- React DevTools for component debugging
- Zustand DevTools for state monitoring
- Browser Performance tab for optimization

## Dependencies

### Core Libraries
- **React**: UI framework
- **Phaser**: Game engine
- **Zustand**: State management
- **TypeScript**: Type safety
- **Vite**: Build tool

### Development Tools
- **ESLint**: Code quality
- **Prettier**: Code formatting
- **TypeScript Compiler**: Type checking

This architecture provides a solid foundation for building complex game features while maintaining code quality, performance, and developer experience.