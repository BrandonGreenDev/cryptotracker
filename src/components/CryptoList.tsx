import { useState, useEffect } from 'react'
import { Crypto } from '../types/crypto'
import { getCryptoList } from '../services/coingecko'
import CryptoCard from './CryptoCard'

type SortOption = 'marketcap' | 'name' | 'price'

const CryptoList = () => {
  const [cryptos, setCryptos] = useState<Crypto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [sortBy, setSortBy] = useState<SortOption>('marketcap')

  const fetchCryptos = async () => {
    try {
      setError(null)
      const data = await getCryptoList('usd', 50)
      setCryptos(data)
    } catch (err) {
      setError('Failed to fetch cryptocurrency data. Please try again later.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCryptos()
  }, [])

  // Auto-refresh every 60 seconds
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      fetchCryptos()
    }, 60000)

    return () => clearInterval(interval)
  }, [autoRefresh])

  const filteredCryptos = cryptos
    .filter(
      (crypto) =>
        crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name)
      } else if (sortBy === 'price') {
        return b.current_price - a.current_price
      } else {
        return b.market_cap - a.market_cap
      }
    })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-sky-500 dark:border-accent mx-auto mb-4"></div>
          <p className="text-sky-600 dark:text-accent-dark">Loading cryptocurrencies...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={fetchCryptos}
            className="bg-sky-400 dark:bg-tertiary hover:bg-sky-500 dark:hover:bg-tertiary-light text-white py-2 px-6 rounded-lg font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <input
          type="text"
          placeholder="Search cryptocurrencies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-96 px-4 py-3 bg-white dark:bg-secondary border border-sky-300 dark:border-tertiary rounded-lg text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-accent-dark focus:outline-none focus:ring-2 focus:ring-sky-400 dark:focus:ring-accent"
        />
        <div className="flex items-center space-x-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-2 bg-white dark:bg-secondary border border-sky-300 dark:border-tertiary rounded-lg text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 dark:focus:ring-accent"
          >
            <option value="marketcap">Sort by Market Cap</option>
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
          </select>
          <label className="flex items-center space-x-2 text-sm text-sky-700 dark:text-accent">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="w-4 h-4 text-sky-500 dark:text-accent bg-white dark:bg-secondary border-sky-300 dark:border-tertiary rounded focus:ring-sky-400 dark:focus:ring-accent"
            />
            <span>Auto-refresh (60s)</span>
          </label>
          <button
            onClick={fetchCryptos}
            className="bg-sky-400 dark:bg-tertiary hover:bg-sky-500 dark:hover:bg-tertiary-light text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCryptos.map((crypto) => (
          <CryptoCard key={crypto.id} crypto={crypto} />
        ))}
      </div>

      {filteredCryptos.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <p className="text-sky-600 dark:text-accent-dark">No cryptocurrencies found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  )
}

export default CryptoList
