import { useDarkMode } from '../context/DarkModeContext'

interface HeaderProps {
  showPortfolio: boolean
  setShowPortfolio: (show: boolean) => void
}

const Header = ({ showPortfolio, setShowPortfolio }: HeaderProps) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode()

  return (
    <header className="bg-sky-200 dark:bg-secondary shadow-lg border-b border-sky-300 dark:border-tertiary">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="text-3xl text-sky-700 dark:text-accent">₿</div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Crypto Tracker
            </h1>
          </div>
          <nav className="flex items-center space-x-4">
            <button
              onClick={() => setShowPortfolio(false)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                !showPortfolio
                  ? 'bg-sky-400 dark:bg-tertiary text-white'
                  : 'text-sky-700 dark:text-accent hover:bg-sky-300 dark:hover:bg-secondary-light'
              }`}
            >
              Markets
            </button>
            <button
              onClick={() => setShowPortfolio(true)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                showPortfolio
                  ? 'bg-sky-400 dark:bg-tertiary text-white'
                  : 'text-sky-700 dark:text-accent hover:bg-sky-300 dark:hover:bg-secondary-light'
              }`}
            >
              Portfolio
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg text-sky-700 dark:text-accent hover:bg-sky-300 dark:hover:bg-secondary-light transition-colors"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
