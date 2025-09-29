import { Position } from '../../types'
import { LShapeGaze } from '../strategies/GazeStrategy'
import { GameConfig } from '../../config/GameConfig'
import { useGameStore } from '../../stores/gameStore'

// Helper function to check if a gaze pattern fits within grid boundaries
export const isGazePatternValid = (center: Position, gazeSize: number, rotation: number): boolean => {
  const gazeStrategy = new LShapeGaze()
  const pattern = gazeStrategy.getPattern(gazeSize, rotation)
  const { gridWidth, gridHeight } = useGameStore.getState()

  return pattern.every(offset => {
    const tileX = center.x + offset.x
    const tileY = center.y + offset.y
    return tileX >= 0 && tileX < gridWidth && tileY >= 0 && tileY < gridHeight
  })
}

// Helper function to find the best gaze placement (position + rotation) for a clicked position
export const findBestGazePlacement = (clickedPosition: Position, gazeSize: number, currentRotation: number): { position: Position, rotation: number } => {
  const { gridWidth, gridHeight } = useGameStore.getState()

  // First try the current rotation at the clicked position
  if (isGazePatternValid(clickedPosition, gazeSize, currentRotation)) {
    return { position: clickedPosition, rotation: currentRotation }
  }

  // Try all rotations at the clicked position
  for (let rotation = 0; rotation < 4; rotation++) {
    if (isGazePatternValid(clickedPosition, gazeSize, rotation)) {
      return { position: clickedPosition, rotation }
    }
  }

  // If no rotation fits at clicked position, try nearby positions
  const searchDistance = 1
  for (let dx = -searchDistance; dx <= searchDistance; dx++) {
    for (let dy = -searchDistance; dy <= searchDistance; dy++) {
      if (dx === 0 && dy === 0) continue // Skip clicked position (already tried)

      const nearbyPosition = {
        x: clickedPosition.x + dx,
        y: clickedPosition.y + dy
      }

      // Skip if nearby position is outside grid
      if (nearbyPosition.x < 0 || nearbyPosition.x >= gridWidth ||
          nearbyPosition.y < 0 || nearbyPosition.y >= gridHeight) {
        continue
      }

      // Try current rotation first at nearby position
      if (isGazePatternValid(nearbyPosition, gazeSize, currentRotation)) {
        return { position: nearbyPosition, rotation: currentRotation }
      }

      // Try all rotations at nearby position
      for (let rotation = 0; rotation < 4; rotation++) {
        if (isGazePatternValid(nearbyPosition, gazeSize, rotation)) {
          return { position: nearbyPosition, rotation }
        }
      }
    }
  }

  // Fallback: constrain to grid center if nothing else works
  return { position: { x: 1, y: 1 }, rotation: currentRotation }
}