import { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { getCryptoChart, getDaysFromTimeRange } from '../services/coingecko'
import { TimeRange } from '../types/crypto'

interface PriceChartProps {
  cryptoId: string
}

interface ChartDataPoint {
  time: string
  price: number
  timestamp: number
}

const PriceChart = ({ cryptoId }: PriceChartProps) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('7d')
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true)
        setError(null)
        const days = getDaysFromTimeRange(timeRange)
        const data = await getCryptoChart(cryptoId, days)

        const formattedData: ChartDataPoint[] = data.prices.map(
          ([timestamp, price]) => ({
            timestamp,
            time: formatTime(timestamp, timeRange),
            price: parseFloat(price.toFixed(2)),
          })
        )

        setChartData(formattedData)
      } catch (err) {
        setError('Failed to load chart data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchChartData()
  }, [cryptoId, timeRange])

  const formatTime = (timestamp: number, range: TimeRange): string => {
    const date = new Date(timestamp)
    if (range === '24h') {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    } else if (range === '7d' || range === '30d') {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    }
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-secondary-light border border-accent rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">${data.price.toLocaleString()}</p>
          <p className="text-accent-dark text-sm">{data.time}</p>
        </div>
      )
    }
    return null
  }

  const timeRanges: TimeRange[] = ['24h', '7d', '30d', '1y']

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center bg-secondary-light rounded-lg">
        <div className="text-accent-dark">Loading chart...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-64 flex items-center justify-center bg-secondary-light rounded-lg">
        <div className="text-red-400">{error}</div>
      </div>
    )
  }

  const minPrice = Math.min(...chartData.map((d) => d.price))
  const maxPrice = Math.max(...chartData.map((d) => d.price))
  const isPositive =
    chartData.length > 0 &&
    chartData[chartData.length - 1].price > chartData[0].price

  return (
    <div className="bg-secondary-light rounded-lg p-4 border border-tertiary">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-accent font-medium">Price Chart</h4>
        <div className="flex space-x-2">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-tertiary text-white'
                  : 'bg-primary text-accent hover:bg-primary-dark'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#A3485A" />
          <XAxis
            dataKey="time"
            stroke="#F5DAA7"
            tick={{ fill: '#e8c987', fontSize: 12 }}
            tickLine={{ stroke: '#A3485A' }}
          />
          <YAxis
            domain={[minPrice * 0.99, maxPrice * 1.01]}
            stroke="#F5DAA7"
            tick={{ fill: '#e8c987', fontSize: 12 }}
            tickLine={{ stroke: '#A3485A' }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="price"
            stroke={isPositive ? '#10B981' : '#EF4444'}
            strokeWidth={2}
            dot={false}
            animationDuration={300}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PriceChart
