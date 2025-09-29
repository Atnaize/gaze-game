import React from 'react'
import { BuildingType, Resources } from '../types'
import { BuildingRegistry } from '../game/buildings/BuildingRegistry'

interface BuildingTooltipProps {
  buildingType: BuildingType
  canAfford: boolean
}

export const BuildingTooltip: React.FC<BuildingTooltipProps> = ({
  buildingType,
  canAfford
}) => {
  const registry = BuildingRegistry.getInstance()
  const building = registry.getBuilding(buildingType)

  const formatTime = (ms: number): string => {
    const seconds = ms / 1000
    return seconds < 60 ? `${seconds}s` : `${Math.floor(seconds / 60)}m ${seconds % 60}s`
  }

  const getResourceIcon = (resourceType: keyof Resources): string => {
    switch (resourceType) {
      case 'gold':
        return '💰'
      case 'food':
        return '🌾'
      case 'stone':
        return '🪨'
      case 'soldiers':
        return '⚔️'
      default:
        return '❓'
    }
  }

  const getResourceName = (resourceType: keyof Resources): string => {
    return resourceType.charAt(0).toUpperCase() + resourceType.slice(1)
  }

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(44, 62, 80, 0.98) 0%, rgba(52, 73, 94, 0.98) 100%)',
        border: canAfford ? '2px solid #2ecc71' : '2px solid #e74c3c',
        borderRadius: '8px',
        padding: '12px',
        minWidth: '250px',
        maxWidth: '320px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
        color: '#ecf0f1',
        fontSize: '0.9rem',
        lineHeight: '1.4'
      }}
    >
      {/* Header */}
      <div
        style={{
          fontSize: '1.1rem',
          fontWeight: 'bold',
          marginBottom: '8px',
          paddingBottom: '8px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          color: canAfford ? '#2ecc71' : '#e74c3c'
        }}
      >
        {building.label}
      </div>

      {/* Cost Section */}
      <div style={{ marginBottom: '12px' }}>
        <div
          style={{
            fontSize: '0.8rem',
            color: '#95a5a6',
            marginBottom: '4px',
            textTransform: 'uppercase',
            fontWeight: 'bold'
          }}
        >
          Cost
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {Object.entries(building.cost).map(([resource, amount]) => (
            <div
              key={resource}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'rgba(0, 0, 0, 0.3)',
                padding: '4px 8px',
                borderRadius: '4px'
              }}
            >
              <span>{getResourceIcon(resource as keyof Resources)}</span>
              <span style={{ fontWeight: 'bold' }}>{amount}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Production Section */}
      <div style={{ marginBottom: '12px' }}>
        <div
          style={{
            fontSize: '0.8rem',
            color: '#95a5a6',
            marginBottom: '4px',
            textTransform: 'uppercase',
            fontWeight: 'bold'
          }}
        >
          Production
        </div>
        {building.production.resources.map((prod, index) => (
          <div
            key={index}
            style={{
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '8px',
              borderRadius: '4px',
              marginBottom: index < building.production.resources.length - 1 ? '6px' : '0'
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                marginBottom: '6px'
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>
                {getResourceIcon(prod.resourceType as keyof Resources)}
              </span>
              <span style={{ fontWeight: 'bold', color: '#3498db' }}>
                {getResourceName(prod.resourceType as keyof Resources)}
              </span>
            </div>

            {/* Base Production */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '4px',
                fontSize: '0.85rem'
              }}
            >
              <span style={{ color: '#bdc3c7' }}>Without Gaze:</span>
              <span>
                <span style={{ color: '#e67e22', fontWeight: 'bold' }}>+{prod.baseAmount}</span>
                <span style={{ color: '#7f8c8d', marginLeft: '4px' }}>
                  / {formatTime(building.baseCooldown)}
                </span>
              </span>
            </div>

            {/* Gaze Production */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '4px',
                fontSize: '0.85rem'
              }}
            >
              <span style={{ color: '#bdc3c7' }}>With Gaze:</span>
              <span>
                <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>+{prod.gazeAmount}</span>
                <span style={{ color: '#7f8c8d', marginLeft: '4px' }}>
                  / {formatTime(building.gazeCooldown)}
                </span>
              </span>
            </div>

            {/* Max Output */}
            {prod.maxOutput && (
              <div
                style={{
                  fontSize: '0.75rem',
                  color: '#95a5a6',
                  marginTop: '4px',
                  fontStyle: 'italic'
                }}
              >
                Max stored: {prod.maxOutput}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Special Info for Barracks */}
      {buildingType === 'barracks' && (
        <div
          style={{
            background: 'rgba(155, 89, 182, 0.2)',
            border: '1px solid rgba(155, 89, 182, 0.5)',
            padding: '8px',
            borderRadius: '4px',
            fontSize: '0.85rem'
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#9b59b6' }}>
            ⚔️ Combat Building
          </div>
          <div style={{ color: '#bdc3c7' }}>
            Spawns soldiers to battle arena. Max {(building as any).getMaxUnits()} soldiers per barracks.
          </div>
        </div>
      )}

      {/* Affordability Message */}
      {!canAfford && (
        <div
          style={{
            marginTop: '12px',
            padding: '8px',
            background: 'rgba(231, 76, 60, 0.2)',
            border: '1px solid rgba(231, 76, 60, 0.5)',
            borderRadius: '4px',
            fontSize: '0.85rem',
            color: '#e74c3c',
            textAlign: 'center',
            fontWeight: 'bold'
          }}
        >
          Insufficient Resources
        </div>
      )}
    </div>
  )
}