import React from 'react'
import { useBattleStore } from '../stores/battleStore'

interface BattleUIProps {
  className?: string
}

export const BattleUI: React.FC<BattleUIProps> = ({ className }) => {
  const {
    currentWave,
    nextWaveTime,
    battleInProgress,
    totalWaves,
    soldiers,
    enemies,
    stats
  } = useBattleStore()


  const getTimeToNextWave = () => {
    if (currentWave) return 'Battle in progress'
    const timeLeft = nextWaveTime
    if (timeLeft <= 0) return 'Wave incoming!'

    const secondsLeft = Math.ceil(timeLeft / 1000)
    return `Next wave in ${secondsLeft}s`
  }

  const getWaveDescription = () => {
    if (!currentWave) return 'Preparing for battle...'

    const getEnemyDisplayName = (type: string) => {
      return type.split('_').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    }

    const typeList = currentWave.enemyTypes.map(type => getEnemyDisplayName(type)).join(', ')
    return `Wave ${currentWave.number}: ${currentWave.enemyCount} ${typeList}`
  }

  return (
    <div className={`battle-ui ${className || ''}`}>
      <div className="panel-section">
        <h3>⚔️ Battle Arena</h3>

        <div className="battle-status">
          <div className="wave-info">
            <div className="wave-description">{getWaveDescription()}</div>
            <div className="wave-timer">{getTimeToNextWave()}</div>
          </div>

          <div className="unit-counts">
            <div className="unit-count soldiers">
              <span className="unit-label">👥 Soldiers:</span>
              <span className="unit-number">{soldiers.filter(s => s.state !== 'dead').length}</span>
            </div>
            <div className="unit-count enemies">
              <span className="unit-label">🐺 Enemies:</span>
              <span className="unit-number">{enemies.filter(e => e.state !== 'dead').length}</span>
            </div>
          </div>

          <div className="wave-progress">
            {currentWave ? (
              <>
                <div className="progress-label">Wave Progress</div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${Math.max(0, (1 - enemies.filter(e => e.state !== 'dead').length / currentWave.enemyCount) * 100)}%`
                    }}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="progress-label">Awaiting Battle</div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '0%' }} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="panel-section">
        <h3>📊 Battle Stats</h3>
        <div className="battle-stats">
          <div className="stat-item">
            <span className="stat-label">Waves Completed:</span>
            <span className="stat-value">{totalWaves}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Enemies Defeated:</span>
            <span className="stat-value">{stats.enemyKills}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Soldiers Lost:</span>
            <span className="stat-value">{stats.soldierKills}</span>
          </div>
        </div>
      </div>
    </div>
  )
}