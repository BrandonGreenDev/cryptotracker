import { useState, useEffect } from 'react'
import { usePortfolio } from '../context/PortfolioContext'
import { getCryptoList } from '../services/coingecko'
import { Crypto } from '../types/crypto'
import PortfolioItem from './PortfolioItem'

const Portfolio = () => {
  const { holdings, getTotalValue, getTotalProfitLoss } = usePortfolio()
  const [cryptoPrices, setCryptoPrices] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const data = await getCryptoList('usd', 250)
        const prices: Record<string, number> = {}
        data.forEach((crypto: Crypto) => {
          prices[crypto.id] = crypto.current_price
        })
        setCryptoPrices(prices)
      } catch (error) {
        console.error('Error fetching prices:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPrices()
    // Refresh prices every 60 seconds
    const interval = setInterval(fetchPrices, 60000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-accent-dark">Loading portfolio...</p>
        </div>
      </div>
    )
  }

  const totalValue = getTotalValue(cryptoPrices)
  const totalProfitLoss = getTotalProfitLoss(cryptoPrices)
  const totalProfitLossPercent =
    holdings.reduce((sum, h) => sum + h.quantity * h.purchasePrice, 0) > 0
      ? (totalProfitLoss /
          holdings.reduce((sum, h) => sum + h.quantity * h.purchasePrice, 0)) *
        100
      : 0

  const isProfitable = totalProfitLoss >= 0

  if (holdings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📊</div>
        <h2 className="text-2xl font-bold text-accent mb-2">
          Your Portfolio is Empty
        </h2>
        <p className="text-accent-dark mb-6">
          Start building your portfolio by adding cryptocurrencies from the Markets tab
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="bg-gradient-to-r from-secondary to-tertiary rounded-lg p-8 mb-8 shadow-xl border border-accent/20">
        <h2 className="text-3xl font-bold text-accent mb-6">Portfolio Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-primary/50 rounded-lg p-6 backdrop-blur-sm border border-accent/30">
            <p className="text-accent-dark text-sm mb-2">Total Value</p>
            <p className="text-3xl font-bold text-white">
              ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-primary/50 rounded-lg p-6 backdrop-blur-sm border border-accent/30">
            <p className="text-accent-dark text-sm mb-2">Total Profit/Loss</p>
            <p
              className={`text-3xl font-bold ${
                isProfitable ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {isProfitable ? '+' : ''}$
              {totalProfitLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-primary/50 rounded-lg p-6 backdrop-blur-sm border border-accent/30">
            <p className="text-accent-dark text-sm mb-2">Total Return</p>
            <p
              className={`text-3xl font-bold ${
                isProfitable ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {isProfitable ? '+' : ''}
              {totalProfitLossPercent.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-bold text-accent mb-4">Holdings</h3>
        <div className="space-y-4">
          {holdings.map((holding) => (
            <PortfolioItem
              key={holding.id}
              holding={holding}
              currentPrice={cryptoPrices[holding.cryptoId] || 0}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Portfolio
