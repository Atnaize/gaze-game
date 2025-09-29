import React, { useState } from 'react'
import { OverlayMenu } from './OverlayMenu'
import { useAchievementStore } from '../stores/achievementStore'
import { ACHIEVEMENTS } from '../game/achievements/achievementDefinitions'
import { AchievementCategory, AchievementRarity } from '../types'

interface AchievementsPanelProps {
  isVisible: boolean
  onClose: () => void
}

export const AchievementsPanel: React.FC<AchievementsPanelProps> = ({
  isVisible,
  onClose
}) => {
  const { unlockedAchievements, achievementProgress } = useAchievementStore()
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all')
  const [selectedRarity, setSelectedRarity] = useState<AchievementRarity | 'all'>('all')

  const filteredAchievements = ACHIEVEMENTS.filter(achievement => {
    if (selectedCategory !== 'all' && achievement.category !== selectedCategory) return false
    if (selectedRarity !== 'all' && achievement.rarity !== selectedRarity) return false
    return true
  })

  const unlockedCount = unlockedAchievements.length
  const totalCount = ACHIEVEMENTS.filter(a => !a.hidden).length
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100)

  const getRarityColor = (rarity: AchievementRarity) => {
    switch (rarity) {
      case 'common':
        return '#95a5a6'
      case 'rare':
        return '#3498db'
      case 'epic':
        return '#9b59b6'
      case 'legendary':
        return '#f39c12'
    }
  }

  const getCategoryIcon = (category: AchievementCategory) => {
    switch (category) {
      case 'combat':
        return '⚔️'
      case 'economy':
        return '💰'
      case 'building':
        return '🏗️'
      case 'survival':
        return '🛡️'
      case 'misc':
        return '🎯'
    }
  }

  return (
    <OverlayMenu
      isVisible={isVisible}
      onClose={onClose}
      title="Achievements"
      showCloseButton={true}
    >
      <div style={{ minWidth: '600px', maxWidth: '800px' }}>
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px' }}>
            {unlockedCount} / {totalCount}
          </div>
          <div style={{ marginBottom: '8px' }}>
            <div
              style={{
                width: '100%',
                height: '24px',
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '2px solid #34495e'
              }}
            >
              <div
                style={{
                  width: `${completionPercentage}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #3498db 0%, #2ecc71 100%)',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
          </div>
          <div style={{ fontSize: '0.9rem', color: '#95a5a6' }}>
            {completionPercentage}% Complete
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setSelectedCategory('all')}
            style={{
              padding: '8px 16px',
              background: selectedCategory === 'all' ? '#3498db' : 'rgba(52, 73, 94, 0.5)',
              border: '1px solid #34495e',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.9rem'
            }}
          >
            All
          </button>
          {(['combat', 'economy', 'building', 'survival', 'misc'] as AchievementCategory[]).map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: '8px 16px',
                background: selectedCategory === category ? '#3498db' : 'rgba(52, 73, 94, 0.5)',
                border: '1px solid #34495e',
                borderRadius: '4px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              {getCategoryIcon(category)} {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <div
          style={{
            maxHeight: '400px',
            overflowY: 'auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '12px',
            padding: '4px'
          }}
        >
          {filteredAchievements.map(achievement => {
            const isUnlocked = unlockedAchievements.includes(achievement.id)
            const progress = achievementProgress[achievement.id]
            const isHidden = achievement.hidden && !isUnlocked

            return (
              <div
                key={achievement.id}
                style={{
                  background: isUnlocked
                    ? 'linear-gradient(135deg, rgba(52, 152, 219, 0.2) 0%, rgba(46, 204, 113, 0.2) 100%)'
                    : 'rgba(44, 62, 80, 0.5)',
                  border: `2px solid ${isUnlocked ? getRarityColor(achievement.rarity) : '#34495e'}`,
                  borderRadius: '8px',
                  padding: '12px',
                  opacity: isHidden ? 0.3 : 1,
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', gap: '12px', marginBottom: '8px' }}>
                  <div style={{ fontSize: '2rem', filter: isUnlocked ? 'none' : 'grayscale(100%)' }}>
                    {isHidden ? '❓' : achievement.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        color: getRarityColor(achievement.rarity),
                        textTransform: 'uppercase',
                        fontWeight: 'bold',
                        marginBottom: '4px'
                      }}
                    >
                      {achievement.rarity}
                    </div>
                    <div
                      style={{
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        color: isUnlocked ? '#ecf0f1' : '#7f8c8d',
                        marginBottom: '4px'
                      }}
                    >
                      {isHidden ? '???' : achievement.name}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    fontSize: '0.85rem',
                    color: isUnlocked ? '#bdc3c7' : '#7f8c8d',
                    lineHeight: 1.4,
                    marginBottom: progress ? '8px' : '0'
                  }}
                >
                  {isHidden ? 'Hidden achievement' : achievement.description}
                </div>
                {progress && !isUnlocked && (
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '0.75rem',
                        color: '#95a5a6',
                        marginBottom: '4px'
                      }}
                    >
                      <span>Progress</span>
                      <span>
                        {progress.current} / {progress.required}
                      </span>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '6px',
                        background: 'rgba(0, 0, 0, 0.3)',
                        borderRadius: '3px',
                        overflow: 'hidden'
                      }}
                    >
                      <div
                        style={{
                          width: `${Math.min(100, (progress.current / progress.required) * 100)}%`,
                          height: '100%',
                          background: getRarityColor(achievement.rarity),
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </OverlayMenu>
  )
}