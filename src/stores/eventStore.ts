import { create } from 'zustand'
import { EventData } from '../types'

type EventType = keyof EventData
type EventListener<T extends EventType> = (data: EventData[T]) => void

interface EventState {
  listeners: Map<string, Map<string, EventListener<any>>>
  
  // Actions
  on: <T extends EventType>(event: T, callback: EventListener<T>) => string
  off: (event: EventType, listenerId: string) => void
  emit: <T extends EventType>(event: T, data: EventData[T]) => void
  clear: () => void
}

export const useEventStore = create<EventState>((set, get) => ({
  listeners: new Map(),

  on: <T extends EventType>(event: T, callback: EventListener<T>) => {
    const listenerId = Math.random().toString(36).substr(2, 9)
    
    set((state) => {
      const newListeners = new Map(state.listeners)
      if (!newListeners.has(event)) {
        newListeners.set(event, new Map())
      }
      const eventListeners = new Map(newListeners.get(event)!)
      eventListeners.set(listenerId, callback)
      newListeners.set(event, eventListeners)
      
      return { listeners: newListeners }
    })
    
    return listenerId
  },

  off: (event, listenerId) => {
    set((state) => {
      const newListeners = new Map(state.listeners)
      const eventListeners = newListeners.get(event)
      
      if (eventListeners) {
        const updatedEventListeners = new Map(eventListeners)
        updatedEventListeners.delete(listenerId)
        
        if (updatedEventListeners.size === 0) {
          newListeners.delete(event)
        } else {
          newListeners.set(event, updatedEventListeners)
        }
      }
      
      return { listeners: newListeners }
    })
  },

  emit: <T extends EventType>(event: T, data: EventData[T]) => {
    const { listeners } = get()
    const eventListeners = listeners.get(event)
    
    if (eventListeners) {
      eventListeners.forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error)
        }
      })
    }
  },

  clear: () => set(() => ({ listeners: new Map() }))
}))

// Custom hook for easy event listening in React components
export const useEventListener = <T extends EventType>(
  event: T, 
  callback: EventListener<T>,
  deps: React.DependencyList = []
) => {
  const { on, off } = useEventStore()
  
  React.useEffect(() => {
    const listenerId = on(event, callback)
    return () => off(event, listenerId)
  }, deps)
}

// Re-export React for the hook
import React from 'react'