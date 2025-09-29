import React from 'react'
import { ResourcePanel } from './ResourcePanel'
import { GazeControls } from './GazeControls'
import { BuildingControls } from './BuildingControls'
import { BattleUI } from './BattleUI'

interface GameUIProps {
  className?: string
}

export const GameUI: React.FC<GameUIProps> = ({ className = '' }) => {
  return (
    <div className={`game-ui ${className}`}>
      <ResourcePanel />
      <GazeControls />
      <BuildingControls />
      <BattleUI />
    </div>
  )
}