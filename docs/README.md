# King Gaze Game - Documentation

## Overview
Comprehensive documentation for the King Gaze Game project - a React + Phaser.js tower defense-style resource management game.

## Documentation Structure

### 📚 [Architecture Documentation](./ARCHITECTURE.md)
High-level system architecture, design patterns, and project structure.

**What you'll find:**
- Core architecture principles and design philosophy
- Complete project structure breakdown
- Key systems overview (Building, Gaze, Resource, State Management)
- Performance optimization strategies
- Development workflows and debugging guidelines

**Best for:** Understanding the overall system design and getting oriented with the codebase.

### 🎮 [Game Systems Documentation](./GAME_SYSTEMS.md)
Detailed technical documentation of all game mechanics and systems.

**What you'll find:**
- Building system architecture (AbstractBuilding, Registry, Factory patterns)
- Gaze system mechanics (Strategy pattern, two-stage rotation)
- Resource production and management flows
- Preview system and visual feedback
- State management patterns (Zustand stores)
- Input handling and game controls

**Best for:** Deep diving into specific game mechanics and understanding implementation details.

### 🔧 [API Reference & Development Guidelines](./API_REFERENCE.md)
Complete API documentation and practical development patterns.

**What you'll find:**
- Core APIs (GameConfig, Type definitions)
- Store APIs (GameStore, BuildingStore, EventStore)
- Building System APIs (AbstractBuilding, Registry, Factory)
- Gaze System APIs (Strategy, System, Utilities)
- Step-by-step development patterns
- Testing guidelines and performance best practices

**Best for:** Hands-on development work, adding new features, and following established patterns.

## Quick Start for Developers

### New to the Project?
1. Start with [ARCHITECTURE.md](./ARCHITECTURE.md) - Get the big picture
2. Read [GAME_SYSTEMS.md](./GAME_SYSTEMS.md) - Understand the mechanics
3. Reference [API_REFERENCE.md](./API_REFERENCE.md) - Start coding

### Working on Specific Features?
- **Adding Buildings**: See API_REFERENCE.md → "Adding New Building Types"
- **Modifying Gaze**: See GAME_SYSTEMS.md → "Gaze System"
- **UI Changes**: See API_REFERENCE.md → "Adding New UI Components"
- **Configuration**: See ARCHITECTURE.md → "Configuration System"

### Need Quick Reference?
- **Constants**: `src/config/GameConfig.ts`
- **Types**: `src/types/index.ts`
- **Stores**: `src/stores/` (gameStore, buildingStore, eventStore)
- **Main Scene**: `src/game/KingGazeScene.ts`

## Project Commands

```bash
# Development
npm run dev       # Start development server
npm run build     # Build for production
npm run lint      # Check code quality
npm run preview   # Preview production build

# Testing (when implemented)
npm test          # Run unit tests
npm run test:e2e  # Run end-to-end tests
```

## Claude AI Assistant Setup

The project includes a comprehensive Claude configuration in [CLAUDE.md](../CLAUDE.md) that provides:
- Project overview and key features
- Core architecture principles and critical patterns
- Development workflows and debugging guidelines
- File locations for common tasks
- Code quality standards and performance requirements

This configuration enables the Claude AI assistant to effectively work with the codebase while maintaining architectural consistency.

## Key Design Principles

### Configuration-Driven Development
- All constants in `GameConfig.ts`
- Zero hardcoded values
- Easy balancing and tweaking

### Type Safety First
- Strict TypeScript with no `any` types
- Comprehensive interfaces
- Compile-time error catching

### Pattern-Based Architecture
- Factory Pattern for building creation
- Registry Pattern for definitions
- Strategy Pattern for gaze shapes
- Observer Pattern for state management

### Phaser-Optimized Performance
- Graphics API for complex rendering
- Object pooling for frequent operations
- Efficient update loops with delta time
- Proper memory management

## Contributing Guidelines

1. **Read Documentation First**: Understand existing patterns before implementing
2. **Follow Established Patterns**: Use Factory, Registry, and Strategy patterns consistently
3. **Configuration-Driven**: Add all constants to GameConfig.ts
4. **Type Safety**: Define interfaces before implementation
5. **Test Coverage**: Add tests for new features
6. **Documentation**: Update docs when adding new systems or architectural changes

## Architecture at a Glance

```
React UI Layer ←→ Zustand Stores ←→ Phaser Game Layer
       ↓               ↓                    ↓
  Components    State Management      Game Systems
       ↓               ↓                    ↓
   Styling      Event Handling        Visual Rendering
       ↓               ↓                    ↓
  game.css      eventStore.ts        KingGazeScene.ts
```

## Support and Maintenance

### Getting Help
- Check documentation first (this folder)
- Review existing code patterns
- Use TypeScript compiler for type checking
- Test changes with `npm run build` and `npm run lint`

### Reporting Issues
When reporting issues, include:
- Steps to reproduce
- Expected vs actual behavior
- Browser and environment details
- Relevant code snippets

### Making Changes
1. Create feature branch
2. Follow documentation guidelines
3. Update relevant docs if needed
4. Test thoroughly
5. Submit pull request with clear description

This documentation provides everything needed to understand, develop, and maintain the King Gaze Game effectively.