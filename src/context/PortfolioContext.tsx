import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { PortfolioHolding, PortfolioContextType } from '../types/crypto'

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined)

const STORAGE_KEY = 'crypto-portfolio'

export const usePortfolio = () => {
  const context = useContext(PortfolioContext)
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider')
  }
  return context
}

interface PortfolioProviderProps {
  children: ReactNode
}

export const PortfolioProvider = ({ children }: PortfolioProviderProps) => {
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([])

  // Load holdings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setHoldings(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Error loading portfolio from localStorage:', error)
    }
  }, [])

  // Save holdings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(holdings))
    } catch (error) {
      console.error('Error saving portfolio to localStorage:', error)
    }
  }, [holdings])

  const addHolding = (holding: Omit<PortfolioHolding, 'id'>) => {
    const newHolding: PortfolioHolding = {
      ...holding,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }
    setHoldings((prev) => [...prev, newHolding])
  }

  const removeHolding = (id: string) => {
    setHoldings((prev) => prev.filter((holding) => holding.id !== id))
  }

  const updateHolding = (id: string, updates: Partial<PortfolioHolding>) => {
    setHoldings((prev) =>
      prev.map((holding) =>
        holding.id === id ? { ...holding, ...updates } : holding
      )
    )
  }

  const getTotalValue = (cryptoPrices: Record<string, number>): number => {
    return holdings.reduce((total, holding) => {
      const currentPrice = cryptoPrices[holding.cryptoId] || 0
      return total + holding.quantity * currentPrice
    }, 0)
  }

  const getTotalProfitLoss = (cryptoPrices: Record<string, number>): number => {
    return holdings.reduce((total, holding) => {
      const currentPrice = cryptoPrices[holding.cryptoId] || 0
      const currentValue = holding.quantity * currentPrice
      const purchaseValue = holding.quantity * holding.purchasePrice
      return total + (currentValue - purchaseValue)
    }, 0)
  }

  const value: PortfolioContextType = {
    holdings,
    addHolding,
    removeHolding,
    updateHolding,
    getTotalValue,
    getTotalProfitLoss,
  }

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  )
}
