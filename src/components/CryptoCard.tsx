import { useState } from 'react'
import { Crypto } from '../types/crypto'
import PriceChart from './PriceChart'
import { usePortfolio } from '../context/PortfolioContext'
import { useToast } from '../context/ToastContext'

interface CryptoCardProps {
  crypto: Crypto
}

const CryptoCard = ({ crypto }: CryptoCardProps) => {
  const [showChart, setShowChart] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [quantity, setQuantity] = useState('')
  const [purchasePrice, setPurchasePrice] = useState(crypto.current_price.toString())
  const { addHolding } = usePortfolio()
  const { showToast } = useToast()

  const priceChange24h = crypto.price_change_percentage_24h || 0
  const isPriceUp = priceChange24h >= 0

  const handleAddToPortfolio = (e: React.FormEvent) => {
    e.preventDefault()
    if (quantity && purchasePrice) {
      addHolding({
        cryptoId: crypto.id,
        symbol: crypto.symbol.toUpperCase(),
        name: crypto.name,
        quantity: parseFloat(quantity),
        purchasePrice: parseFloat(purchasePrice),
        purchaseDate: new Date().toISOString(),
      })
      setShowAddForm(false)
      setQuantity('')
      setPurchasePrice(crypto.current_price.toString())
      showToast(`Added ${quantity} ${crypto.symbol.toUpperCase()} to portfolio!`, 'success')
    }
  }

  return (
    <div className="bg-white dark:bg-secondary rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow border border-sky-300 dark:border-tertiary">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <img src={crypto.image} alt={crypto.name} className="w-12 h-12" />
          <div>
            <h3 className="text-lg font-bold text-sky-700 dark:text-accent">{crypto.name}</h3>
            <p className="text-sm text-sky-600 dark:text-accent-dark uppercase">{crypto.symbol}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-slate-900 dark:text-white">
            ${crypto.current_price.toLocaleString()}
          </p>
          <p
            className={`text-sm font-medium ${
              isPriceUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}
          >
            {isPriceUp ? '↑' : '↓'} {Math.abs(priceChange24h).toFixed(2)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-slate-600 dark:text-accent-dark">Market Cap</p>
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            ${(crypto.market_cap / 1e9).toFixed(2)}B
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-600 dark:text-accent-dark">24h Volume</p>
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            ${(crypto.total_volume / 1e9).toFixed(2)}B
          </p>
        </div>
        {crypto.price_change_percentage_7d_in_currency && (
          <div>
            <p className="text-xs text-slate-600 dark:text-accent-dark">7d Change</p>
            <p
              className={`text-sm font-medium ${
                crypto.price_change_percentage_7d_in_currency >= 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {crypto.price_change_percentage_7d_in_currency.toFixed(2)}%
            </p>
          </div>
        )}
        <div>
          <p className="text-xs text-slate-600 dark:text-accent-dark">Rank</p>
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            #{crypto.market_cap_rank}
          </p>
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => setShowChart(!showChart)}
          className="flex-1 bg-sky-400 dark:bg-tertiary hover:bg-sky-500 dark:hover:bg-tertiary-light text-white py-2 px-4 rounded-lg font-medium transition-colors"
        >
          {showChart ? 'Hide Chart' : 'Show Chart'}
        </button>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex-1 bg-sky-600 dark:bg-accent-dark hover:bg-sky-700 dark:hover:bg-accent text-white dark:text-primary-dark py-2 px-4 rounded-lg font-medium transition-colors"
        >
          Add to Portfolio
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleAddToPortfolio} className="mt-4 p-4 bg-sky-50 dark:bg-secondary-light rounded-lg">
          <div className="mb-3">
            <label className="block text-sm font-medium text-sky-700 dark:text-accent mb-1">
              Quantity
            </label>
            <input
              type="number"
              step="any"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-primary border border-sky-300 dark:border-tertiary rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400 dark:focus:ring-accent"
              placeholder="0.0"
              required
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-sky-700 dark:text-accent mb-1">
              Purchase Price (USD)
            </label>
            <input
              type="number"
              step="any"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-primary border border-sky-300 dark:border-tertiary rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-400 dark:focus:ring-accent"
              placeholder="0.0"
              required
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="flex-1 bg-sky-400 dark:bg-tertiary hover:bg-sky-500 dark:hover:bg-tertiary-light text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {showChart && (
        <div className="mt-4">
          <PriceChart cryptoId={crypto.id} />
        </div>
      )}
    </div>
  )
}

export default CryptoCard
