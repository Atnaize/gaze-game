import React, { useEffect, useState } from 'react'
import { Achievement } from '../types'

interface AchievementNotificationProps {
  achievement: Achievement
  onDismiss: () => void
}

export const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  onDismiss
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 50)

    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onDismiss, 300)
    }, 5000)

    return () => clearTimeout(timer)
  }, [onDismiss])

  const getRarityColor = () => {
    switch (achievement.rarity) {
      case 'common':
        return '#95a5a6'
      case 'rare':
        return '#3498db'
      case 'epic':
        return '#9b59b6'
      case 'legendary':
        return '#f39c12'
      default:
        return '#95a5a6'
    }
  }

  const getRarityGlow = () => {
    switch (achievement.rarity) {
      case 'rare':
        return '0 0 20px rgba(52, 152, 219, 0.5)'
      case 'epic':
        return '0 0 20px rgba(155, 89, 182, 0.5)'
      case 'legendary':
        return '0 0 30px rgba(243, 156, 18, 0.8), 0 0 60px rgba(243, 156, 18, 0.4)'
      default:
        return 'none'
    }
  }

  return (
    <div
      className="achievement-notification"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
        transition: 'all 0.3s ease-out',
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 10000,
        background: 'linear-gradient(135deg, rgba(44, 62, 80, 0.95) 0%, rgba(52, 73, 94, 0.95) 100%)',
        border: `2px solid ${getRarityColor()}`,
        borderRadius: '8px',
        padding: '16px',
        minWidth: '300px',
        maxWidth: '400px',
        boxShadow: `0 4px 12px rgba(0, 0, 0, 0.3), ${getRarityGlow()}`,
        cursor: 'pointer'
      }}
      onClick={() => {
        setIsVisible(false)
        setTimeout(onDismiss, 300)
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            fontSize: '2rem',
            lineHeight: 1
          }}
        >
          {achievement.icon}
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              color: getRarityColor(),
              fontWeight: 'bold',
              marginBottom: '4px'
            }}
          >
            Achievement Unlocked
          </div>
          <div
            style={{
              fontSize: '1rem',
              fontWeight: 'bold',
              color: '#ecf0f1',
              marginBottom: '4px'
            }}
          >
            {achievement.name}
          </div>
          <div
            style={{
              fontSize: '0.85rem',
              color: '#bdc3c7',
              lineHeight: 1.3
            }}
          >
            {achievement.description}
          </div>
        </div>
      </div>
    </div>
  )
}

interface AchievementNotificationsProps {
  notifications: Array<{ id: string, achievement: Achievement, timestamp: number }>
  onDismiss: (id: string) => void
}

export const AchievementNotifications: React.FC<AchievementNotificationsProps> = ({
  notifications,
  onDismiss
}) => {
  return (
    <div style={{ position: 'fixed', top: 0, right: 0, zIndex: 10000 }}>
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          style={{
            marginTop: index > 0 ? '80px' : '0'
          }}
        >
          <AchievementNotification
            achievement={notification.achievement}
            onDismiss={() => onDismiss(notification.id)}
          />
        </div>
      ))}
    </div>
  )
}