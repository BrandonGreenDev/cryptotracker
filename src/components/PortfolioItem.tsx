import { PortfolioHolding } from '../types/crypto'
import { usePortfolio } from '../context/PortfolioContext'

interface PortfolioItemProps {
  holding: PortfolioHolding
  currentPrice: number
}

const PortfolioItem = ({ holding, currentPrice }: PortfolioItemProps) => {
  const { removeHolding } = usePortfolio()

  const currentValue = holding.quantity * currentPrice
  const purchaseValue = holding.quantity * holding.purchasePrice
  const profitLoss = currentValue - purchaseValue
  const profitLossPercent = purchaseValue > 0 ? (profitLoss / purchaseValue) * 100 : 0
  const isProfitable = profitLoss >= 0

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to remove ${holding.quantity} ${holding.symbol} from your portfolio?`
      )
    ) {
      removeHolding(holding.id)
    }
  }

  return (
    <div className="bg-secondary rounded-lg p-6 shadow-lg border border-tertiary hover:border-accent transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-xl font-bold text-accent">{holding.name}</h4>
          <p className="text-sm text-accent-dark">
            {holding.quantity} {holding.symbol}
          </p>
        </div>
        <button
          onClick={handleDelete}
          className="text-red-400 hover:text-red-300 transition-colors"
          title="Remove from portfolio"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-accent-dark mb-1">Purchase Price</p>
          <p className="text-sm font-medium text-white">
            ${holding.purchasePrice.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-accent-dark mb-1">Current Price</p>
          <p className="text-sm font-medium text-white">
            ${currentPrice.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-accent-dark mb-1">Total Value</p>
          <p className="text-sm font-medium text-white">
            ${currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div>
          <p className="text-xs text-accent-dark mb-1">Profit/Loss</p>
          <p
            className={`text-sm font-medium ${
              isProfitable ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {isProfitable ? '+' : ''}$
            {profitLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({isProfitable ? '+' : ''}
            {profitLossPercent.toFixed(2)}%)
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-tertiary">
        <p className="text-xs text-accent-dark/70">
          Added on {new Date(holding.purchaseDate).toLocaleDateString()}
        </p>
      </div>
    </div>
  )
}

export default PortfolioItem
