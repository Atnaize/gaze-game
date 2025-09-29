import React, { useState, useEffect } from 'react'
import { GameCanvas } from './GameCanvas'
import { GameUI } from './GameUI'
import GameControls from './GameControls'
import { BattleArena } from './BattleArena'
import { GameOverMenu } from './GameOverMenu'
import { useBattleStore } from '../stores/battleStore'
import { useBuildingStore } from '../stores/buildingStore'
import { useGameStore } from '../stores/gameStore'
import { BattleStats } from '../types'

interface GameContainerProps {
  title?: string
}

export const GameContainer: React.FC<GameContainerProps> = ({
  title = 'Work peasant - React Version'
}) => {
  const [showGameOver, setShowGameOver] = useState(false)
  const [gameOverData, setGameOverData] = useState<{
    totalWaves: number
    stats: BattleStats
  } | null>(null)

  const resetArena = useBattleStore(state => state.resetArena)
  const resetGame = useGameStore(state => state.resetGame)

  useEffect(() => {
    // Listen for game over events from Phaser
    const handleGameOver = (event: CustomEvent) => {
      console.log('React received game over event:', event.detail)
      setGameOverData(event.detail)
      setShowGameOver(true)
    }

    // Use custom event since we can't directly listen to Phaser events in React
    window.addEventListener('phaser_game_over' as any, handleGameOver)

    return () => {
      window.removeEventListener('phaser_game_over' as any, handleGameOver)
    }
  }, [])

  const handleRestart = () => {
    setShowGameOver(false)
    setGameOverData(null)

    // Reset all game state
    resetArena()
    resetGame()

    // Clear all buildings
    const { clearBuildings } = useBuildingStore.getState()
    clearBuildings()

    // Restart the Phaser scenes by sending a custom event
    const restartEvent = new CustomEvent('phaser_game_restart')
    window.dispatchEvent(restartEvent)

    console.log('Game restarted - all state reset')
  }

  const handleMainMenu = () => {
    setShowGameOver(false)
    setGameOverData(null)

    // TODO: Navigate to main menu
    console.log('Going to main menu...')
  }

  return (
    <div className="game-app">
      <header className="game-header">
        <div className="header-content">
          <h1 className="game-title">{title}</h1>
          <GameControls />
        </div>
      </header>

      <main className="game-main">
        <div className="game-world-layout">
          <div className="kingdom-section">
            <GameCanvas className="game-canvas-wrapper" />
          </div>
          <div className="battle-section">
            <BattleArena className="battle-arena-wrapper" />
          </div>
        </div>
      </main>

      <footer className="game-footer">
        <GameUI className="game-ui-panel" />
      </footer>

      {gameOverData && (
        <GameOverMenu
          isVisible={showGameOver}
          stats={gameOverData.stats}
          totalWaves={gameOverData.totalWaves}
          onRestart={handleRestart}
          onMainMenu={handleMainMenu}
        />
      )}
    </div>
  )
}