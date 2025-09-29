import React, { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import { KingdomScene } from '../game/KingdomScene'
import { GameConfig } from '../config/GameConfig'
import { useGameStore } from '../stores/gameStore'

interface GameCanvasProps {
  width?: number
  height?: number
  className?: string
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  width,
  height,
  className = ''
}) => {
  const gameRef = useRef<Phaser.Game | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const sceneRef = useRef<KingdomScene | null>(null)

  const { gridWidth, gridHeight } = useGameStore()

  // Calculate canvas dimensions based on grid size
  const canvasWidth = width || (gridWidth * GameConfig.GRID_SIZE)
  const canvasHeight = height || (gridHeight * GameConfig.GRID_SIZE)

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: canvasWidth,
      height: canvasHeight,
      parent: containerRef.current,
      backgroundColor: '#34495e',
      scene: KingdomScene,
      physics: {
        default: 'arcade'
      },
      input: {
        mouse: true,
        keyboard: true
      }
    }

    gameRef.current = new Phaser.Game(config)

    // Store reference to the scene for resizing
    sceneRef.current = gameRef.current.scene.getScene('KingdomGame') as KingdomScene

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true)
        gameRef.current = null
        sceneRef.current = null
      }
    }
  }, [])

  // Listen for game restart events
  useEffect(() => {
    const handleGameRestart = () => {
      console.log('GameCanvas: Received restart event - refreshing scene')

      // Simply refresh the scene by calling scene restart if available
      if (sceneRef.current && sceneRef.current.scene.isActive()) {
        sceneRef.current.scene.restart()
        console.log('Kingdom scene restarted')
      }
    }

    window.addEventListener('phaser_game_restart' as any, handleGameRestart)

    return () => {
      window.removeEventListener('phaser_game_restart' as any, handleGameRestart)
    }
  }, [])

  // Handle grid size changes by resizing the canvas
  useEffect(() => {
    console.log(`Canvas size change: ${canvasWidth}x${canvasHeight}, gridSize: ${gridWidth}x${gridHeight}`)
    if (gameRef.current && sceneRef.current) {
      console.log('Resizing Phaser canvas and updating input bounds')
      gameRef.current.scale.resize(canvasWidth, canvasHeight)

      // Force update the input manager after resize
      if (gameRef.current.input) {
        console.log('Input manager refreshed after resize')
      }

      // Also trigger a scene refresh
      if (sceneRef.current && typeof (sceneRef.current as any).refreshBounds === 'function') {
        (sceneRef.current as any).refreshBounds()
      }
    } else {
      console.log('GameRef or SceneRef not available for resize')
    }
  }, [canvasWidth, canvasHeight, gridWidth, gridHeight])

  return (
    <div
      ref={containerRef}
      className={`game-canvas ${className}`}
      style={{
        backgroundColor: '#34495e' // Ensure container has correct background
      }}
    />
  )
}