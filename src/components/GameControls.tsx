import React from 'react'
import { useGameStore } from '../stores/gameStore'
import { GameConfig } from '../config/GameConfig'

const GameControls: React.FC = () => {
  const { isPaused, gameSpeed, pauseGame, resumeGame, setGameSpeed } = useGameStore()

  const speedOptions = GameConfig.SPEED_OPTIONS.map(speed => ({
    value: speed,
    label: `${speed}x`
  }))

  return (
    <div className="game-controls">
      <div className="pause-controls">
        {isPaused ? (
          <button onClick={resumeGame} className="control-button resume-button">
            ▶️ Resume
          </button>
        ) : (
          <button onClick={pauseGame} className="control-button pause-button">
            ⏸️ Pause
          </button>
        )}
      </div>

      <div className="speed-controls">
        <span className="speed-label">Speed:</span>
        {speedOptions.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setGameSpeed(value)}
            className={`control-button speed-button ${gameSpeed === value ? 'active' : ''}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default GameControls