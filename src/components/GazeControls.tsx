import React from 'react'
import { useGameStore } from '../stores/gameStore'
import { GazeSystem } from '../game/systems/GazeSystem'
import { GameConfig } from '../config/GameConfig'

export const GazeControls: React.FC = () => {
  const {
    gazeSize,
    gridWidth,
    gridHeight,
    resources,
    upgradeGaze
  } = useGameStore()

  const canUpgradeGaze = GazeSystem.canUpgrade(gazeSize, resources.gold)

  const handleUpgradeGaze = () => {
    upgradeGaze()
  }

  return (
    <div className="panel-section">
      <h3>🔮 Gaze Controls</h3>
      <div className="button-group">
        <button
          className="game-button"
          onClick={handleUpgradeGaze}
          disabled={!canUpgradeGaze}
          title={!canUpgradeGaze ? 'Not enough gold or max level reached' : 'Upgrade gaze size'}
        >
          {GazeSystem.getUpgradeLabel(gazeSize)}
        </button>
      </div>
    </div>
  )
}