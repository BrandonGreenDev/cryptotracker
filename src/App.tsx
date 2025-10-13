import { useState } from 'react'
import { PortfolioProvider } from './context/PortfolioContext'
import { DarkModeProvider } from './context/DarkModeContext'
import { ToastProvider } from './context/ToastContext'
import Header from './components/Header'
import CryptoList from './components/CryptoList'
import Portfolio from './components/Portfolio'

function App() {
  const [showPortfolio, setShowPortfolio] = useState(false)

  return (
    <DarkModeProvider>
      <ToastProvider>
        <PortfolioProvider>
          <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-white">
            <Header
              showPortfolio={showPortfolio}
              setShowPortfolio={setShowPortfolio}
            />
            <main className="container mx-auto px-4 py-8">
              {showPortfolio ? <Portfolio /> : <CryptoList />}
            </main>
          </div>
        </PortfolioProvider>
      </ToastProvider>
    </DarkModeProvider>
  )
}

export default App
