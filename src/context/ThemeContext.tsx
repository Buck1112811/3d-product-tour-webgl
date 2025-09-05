import React, { createContext, useContext, useState, ReactNode } from 'react'

interface ThemeContextType {
  isDarkMode: boolean
  toggleTheme: () => void
  colors: {
    primary: string
    secondary: string
    background: string
    text: string
    accent: string
  }
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev)
  }

  const colors = {
    primary: isDarkMode ? '#3b82f6' : '#1e40af',
    secondary: isDarkMode ? '#64748b' : '#475569',
    background: isDarkMode ? '#0f172a' : '#f8fafc',
    text: isDarkMode ? '#f1f5f9' : '#1e293b',
    accent: isDarkMode ? '#f59e0b' : '#d97706'
  }

  const value: ThemeContextType = {
    isDarkMode,
    toggleTheme,
    colors
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
