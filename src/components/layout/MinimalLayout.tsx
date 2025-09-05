import React, { memo, ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'
import { useTheme } from '../../context/ThemeContext'

export interface MinimalLayoutProps {
  children: ReactNode
}

/**
 * Provides a basic layout structure for pages with minimal UI elements, emphasizing 3D content.
 *
 * @component
 * @example
 * <MinimalLayout>
 *   <div>Page content</div>
 * </MinimalLayout>
 */
const MinimalLayout: React.FC<MinimalLayoutProps> = memo(({ children }) => {
  MinimalLayout.displayName = 'MinimalLayout'
  const { isDarkMode } = useTheme()

  return (
    <div className={`
      flex flex-col min-h-screen
      ${isDarkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}
    `}
    >
      <Header />
      <main className='flex-grow'>
        {children}
      </main>
      <Footer />
    </div>
  )
})

export default MinimalLayout