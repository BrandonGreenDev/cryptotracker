export interface Crypto {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  total_volume: number
  price_change_percentage_24h: number
  price_change_percentage_7d_in_currency?: number
  circulating_supply: number
  total_supply: number
  max_supply: number
  ath: number
  ath_date: string
  atl: number
  atl_date: string
  last_updated: string
}

export interface ChartData {
  prices: [number, number][]
  market_caps: [number, number][]
  total_volumes: [number, number][]
}

export interface PortfolioHolding {
  id: string
  cryptoId: string
  symbol: string
  name: string
  quantity: number
  purchasePrice: number
  purchaseDate: string
}

export interface PortfolioContextType {
  holdings: PortfolioHolding[]
  addHolding: (holding: Omit<PortfolioHolding, 'id'>) => void
  removeHolding: (id: string) => void
  updateHolding: (id: string, holding: Partial<PortfolioHolding>) => void
  getTotalValue: (cryptoPrices: Record<string, number>) => number
  getTotalProfitLoss: (cryptoPrices: Record<string, number>) => number
}

export type TimeRange = '24h' | '7d' | '30d' | '1y'
