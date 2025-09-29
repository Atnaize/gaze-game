import React from 'react'
import { useGameStore } from '../stores/gameStore'
import { BuildingFactory } from '../game/factories/BuildingFactory'
import { BuildingRegistry } from '../game/buildings'
import { BuildingType } from '../types'
import { Tooltip } from './Tooltip'
import { BuildingTooltip } from './BuildingTooltip'

interface BuildingButtonProps {
  type: BuildingType
  label: string
  isActive?: boolean
  onClick: () => void
  disabled?: boolean
}

const BuildingButton: React.FC<BuildingButtonProps> = ({
  type,
  label,
  isActive = false,
  onClick,
  disabled = false
}) => {
  return (
    <Tooltip
      content={<BuildingTooltip buildingType={type} canAfford={!disabled} />}
      delay={200}
      position="right"
    >
      <button
        className={`game-button ${isActive ? 'active' : ''}`}
        onClick={onClick}
        disabled={disabled}
      >
        {label}
      </button>
    </Tooltip>
  )
}

export const BuildingControls: React.FC = () => {
  const gameMode = useGameStore(state => state.gameMode)
  const setBuildingMode = useGameStore(state => state.setBuildingMode)
  const resources = useGameStore(state => state.resources)
  const setDemolishMode = useGameStore(state => state.setDemolishMode)
  const rotateGaze = useGameStore(state => state.rotateGaze)

  const canAfford = (cost: any) => {
    return Object.entries(cost).every(([resourceType, amount]) =>
      resources[resourceType as keyof typeof resources] >= (amount as number || 0)
    )
  }

  const buildings = BuildingRegistry.getInstance().getAllBuildings().map(building => ({
    type: building.getType(),
    label: building.getDisplayLabel()
  }))

  const handleBuildingClick = (type: BuildingType) => {
    if (gameMode.building === type) {
      setBuildingMode(null) // Cancel if clicking same building
    } else {
      setBuildingMode(type)
    }
  }

  const handleDemolishClick = () => {
    setDemolishMode(!gameMode.demolish)
  }

  const handleRotateGaze = () => {
    rotateGaze()
  }

  return (
    <div className="panel-section">
      <h3>Buildings</h3>
      
      <div className="button-group">
        {buildings.map(({ type, label }) => (
          <BuildingButton
            key={type}
            type={type}
            label={label}
            isActive={gameMode.building === type}
            onClick={() => handleBuildingClick(type)}
            disabled={!canAfford(BuildingFactory.getBuildingCost(type))}
          />
        ))}
      </div>
      
      <div className="panel-section">
        <h3>Actions</h3>

        <div className="button-group">
          <button
            className={`game-button ${gameMode.demolish ? 'demolish-active' : ''}`}
            onClick={handleDemolishClick}
            title="Toggle demolish mode (D key)"
          >
            {gameMode.demolish ? 'Cancel Demolish' : 'Demolish Building (D)'}
          </button>

          <button
            className="game-button"
            onClick={handleRotateGaze}
            title="Rotate gaze pattern (R key)"
          >
            Rotate Gaze (R)
          </button>
        </div>
      </div>
    </div>
  )
}