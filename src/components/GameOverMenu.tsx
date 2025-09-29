import React from 'react'
import { OverlayMenu } from './OverlayMenu'
import { BattleStats } from '../types'

interface GameOverMenuProps {
  isVisible: boolean
  stats: BattleStats
  totalWaves: number
  onRestart?: () => void
  onMainMenu?: () => void
}

export const GameOverMenu: React.FC<GameOverMenuProps> = ({
  isVisible,
  stats,
  totalWaves,
  onRestart,
  onMainMenu
}) => {
  return (
    <OverlayMenu
      isVisible={isVisible}
      title="Game Over"
      showCloseButton={false}
      backgroundColor="rgba(100, 0, 0, 0.8)"
    >
      <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', textAlign: 'center', color: '#ff6666' }}>
          Your Kingdom Has Fallen
        </h3>

        <div style={{ marginBottom: '1rem' }}>
          <strong>Final Statistics:</strong>
        </div>

        <ul style={{ listStyle: 'none', padding: 0, lineHeight: '1.8' }}>
          <li>🌊 Waves Survived: <strong>{totalWaves}</strong></li>
          <li>⚔️ Enemies Defeated: <strong>{stats.enemyKills}</strong></li>
          <li>💀 Soldiers Lost: <strong>{stats.soldierKills}</strong></li>
          <li>💰 Gold Earned: <strong>{stats.goldEarned}</strong></li>
          <li>🏛️ Total Battles: <strong>{stats.totalBattles}</strong></li>
        </ul>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        {onRestart && (
          <button
            onClick={onRestart}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            Try Again
          </button>
        )}

        {onMainMenu && (
          <button
            onClick={onMainMenu}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#666',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Main Menu
          </button>
        )}
      </div>
    </OverlayMenu>
  )
}