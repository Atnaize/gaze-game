import React, { useState, useEffect } from 'react'
import { GameCanvas } from './GameCanvas'
import { GameUI } from './GameUI'
import GameControls from './GameControls'
import { BattleArena } from './BattleArena'
import { GameOverMenu } from './GameOverMenu'
import { AchievementsPanel } from './AchievementsPanel'
import { AchievementNotifications } from './AchievementNotification'
import { useBattleStore } from '../stores/battleStore'
import { useBuildingStore } from '../stores/buildingStore'
import { useGameStore } from '../stores/gameStore'
import { useAchievementStore } from '../stores/achievementStore'
import { ACHIEVEMENTS } from '../game/achievements/achievementDefinitions'
import { AchievementHelper } from '../game/achievements/achievementHelper'
import { BattleStats } from '../types'

interface GameContainerProps {
  title?: string
}

export const GameContainer: React.FC<GameContainerProps> = ({
  title = 'Work peasant - React Version'
}) => {
  const [showGameOver, setShowGameOver] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)
  const [gameOverData, setGameOverData] = useState<{
    totalWaves: number
    stats: BattleStats
  } | null>(null)

  const resetArena = useBattleStore(state => state.resetArena)
  const resetGame = useGameStore(state => state.resetGame)
  const { checkAchievements, notifications, dismissNotification } = useAchievementStore()

  useEffect(() => {
    // Listen for game over events from Phaser
    const handleGameOver = (event: CustomEvent) => {
      console.log('React received game over event:', event.detail)
      setGameOverData(event.detail)
      setShowGameOver(true)

      // Check achievements when game is over
      checkGameAchievements()
    }

    // Use custom event since we can't directly listen to Phaser events in React
    window.addEventListener('phaser_game_over' as any, handleGameOver)

    return () => {
      window.removeEventListener('phaser_game_over' as any, handleGameOver)
    }
  }, [])

  // Periodically check achievements
  useEffect(() => {
    const interval = setInterval(() => {
      checkGameAchievements()
    }, 5000) // Check every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const checkGameAchievements = () => {
    const gameState = useGameStore.getState()
    const battleState = useBattleStore.getState()
    const buildingState = useBuildingStore.getState()

    const snapshot = AchievementHelper.createGameStateSnapshot({
      resources: gameState.resources,
      buildings: buildingState.getAllBuildings(),
      battleStats: battleState.stats,
      totalWaves: battleState.totalWaves,
      gameOver: battleState.gameOver,
      gazeUpgrades: gameState.gazeUpgrades,
      totalPlayTime: gameState.totalPlayTime + (Date.now() - gameState.sessionStartTime),
      highestWave: gameState.highestWave,
      totalGoldEarned: battleState.stats.goldEarned
    })

    checkAchievements(ACHIEVEMENTS, snapshot)
  }

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
          <button
            onClick={() => setShowAchievements(true)}
            style={{
              padding: '8px 16px',
              background: '#9b59b6',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              marginLeft: '12px'
            }}
          >
            🏆 Achievements
          </button>
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

      <div className="info-footer">
        <div className="footer-content">
          <a
            href="https://github.com/Atnaize/gaze-game"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            GitHub
          </a>
          <span className="footer-separator">•</span>
          <span className="footer-copyright">
            © {new Date().getFullYear()}
          </span>
          <span className="footer-separator">•</span>
          <a
            href="https://ed-solutions.be/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            ed-solutions.be
          </a>
        </div>
      </div>

      {gameOverData && (
        <GameOverMenu
          isVisible={showGameOver}
          stats={gameOverData.stats}
          totalWaves={gameOverData.totalWaves}
          onRestart={handleRestart}
          onMainMenu={handleMainMenu}
        />
      )}

      <AchievementsPanel
        isVisible={showAchievements}
        onClose={() => setShowAchievements(false)}
      />

      <AchievementNotifications
        notifications={notifications}
        onDismiss={dismissNotification}
      />
    </div>
  )
}