import axios from 'axios'
import { Crypto, ChartData } from '../types/crypto'

const BASE_URL = 'https://api.coingecko.com/api/v3'

// CoinGecko free API has rate limits, so we'll handle errors gracefully
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
})

export const getCryptoList = async (
  currency: string = 'usd',
  perPage: number = 100,
  page: number = 1
): Promise<Crypto[]> => {
  try {
    const response = await api.get('/coins/markets', {
      params: {
        vs_currency: currency,
        order: 'market_cap_desc',
        per_page: perPage,
        page: page,
        sparkline: false,
        price_change_percentage: '7d',
      },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching crypto list:', error)
    throw error
  }
}

export const getCryptoDetails = async (id: string): Promise<any> => {
  try {
    const response = await api.get(`/coins/${id}`, {
      params: {
        localization: false,
        tickers: false,
        community_data: false,
        developer_data: false,
      },
    })
    return response.data
  } catch (error) {
    console.error(`Error fetching details for ${id}:`, error)
    throw error
  }
}

export const getCryptoChart = async (
  id: string,
  days: string = '7',
  currency: string = 'usd'
): Promise<ChartData> => {
  try {
    const response = await api.get(`/coins/${id}/market_chart`, {
      params: {
        vs_currency: currency,
        days: days,
        interval: days === '1' ? 'hourly' : 'daily',
      },
    })
    return response.data
  } catch (error) {
    console.error(`Error fetching chart for ${id}:`, error)
    throw error
  }
}

export const searchCrypto = async (query: string): Promise<any> => {
  try {
    const response = await api.get('/search', {
      params: {
        query: query,
      },
    })
    return response.data
  } catch (error) {
    console.error(`Error searching for ${query}:`, error)
    throw error
  }
}

// Helper function to convert days to API format
export const getDaysFromTimeRange = (timeRange: string): string => {
  switch (timeRange) {
    case '24h':
      return '1'
    case '7d':
      return '7'
    case '30d':
      return '30'
    case '1y':
      return '365'
    default:
      return '7'
  }
}
