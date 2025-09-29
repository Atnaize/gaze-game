import React from 'react'
import { useGameStore } from '../stores/gameStore'
import { useBattleStore } from '../stores/battleStore'
import { Resources } from '../types'

interface ResourceItemProps {
  type: keyof Resources
  amount: number
}

const ResourceItem: React.FC<ResourceItemProps> = ({ type, amount }) => (
  <div className="resource-item">
    <span>{type.charAt(0).toUpperCase() + type.slice(1)}:</span>
    <span>{amount}</span>
  </div>
)

export const ResourcePanel: React.FC = () => {
  const gameResources = useGameStore(state => state.resources)
  const battleSoldiers = useBattleStore(state => state.soldiers)

  // Get current alive soldiers count from battle arena
  const aliveSoldiersCount = battleSoldiers.filter(soldier => soldier.state !== 'dead').length

  // Create resources object with live soldier count
  const resources = {
    ...gameResources,
    soldiers: aliveSoldiersCount
  }

  return (
    <div className="panel-section">
      <h3>Resources</h3>
      <div className="resources-list">
        {Object.entries(resources).map(([type, amount]) => (
          <ResourceItem
            key={type}
            type={type as keyof Resources}
            amount={amount}
          />
        ))}
      </div>
    </div>
  )
}