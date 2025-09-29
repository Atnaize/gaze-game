import React from 'react'

interface OverlayMenuProps {
  isVisible: boolean
  title: string
  children: React.ReactNode
  onClose?: () => void
  showCloseButton?: boolean
  backgroundColor?: string
  textColor?: string
}

export const OverlayMenu: React.FC<OverlayMenuProps> = ({
  isVisible,
  title,
  children,
  onClose,
  showCloseButton = true,
  backgroundColor = 'rgba(0, 0, 0, 0.8)',
  textColor = 'white'
}) => {
  if (!isVisible) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        color: textColor
      }}
    >
      <div
        style={{
          backgroundColor: 'rgba(20, 20, 20, 0.9)',
          border: '2px solid #666',
          borderRadius: '10px',
          padding: '2rem',
          minWidth: '300px',
          maxWidth: '80%',
          textAlign: 'center',
          position: 'relative'
        }}
      >
        {showCloseButton && onClose && (
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '10px',
              right: '15px',
              background: 'transparent',
              border: 'none',
              color: textColor,
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0',
              width: '30px',
              height: '30px'
            }}
          >
            ×
          </button>
        )}

        <h2 style={{
          marginTop: 0,
          marginBottom: '1.5rem',
          color: textColor,
          fontSize: '1.8rem'
        }}>
          {title}
        </h2>

        <div style={{ color: textColor }}>
          {children}
        </div>
      </div>
    </div>
  )
}