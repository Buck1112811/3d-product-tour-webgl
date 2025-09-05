import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { Moon, Sun, Menu } from 'lucide-react';

import '../../styles/layout/header.css';

export interface HeaderProps {
  isMenuOpen?: boolean;
  toggleMenu?: () => void;
}

/**
 * Header component for the 3D landing page.
 * Displays the site logo and navigation links.
 */
const Header: React.FC<HeaderProps> = React.memo(({ isMenuOpen, toggleMenu }) => {
  Header.displayName = 'Header';
  const { isDarkMode, toggleTheme } = useTheme();

  const handleToggle = useCallback(() => {
    toggleTheme();
  }, [toggleTheme]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMenuOpen) {
        toggleMenu?.();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [toggleMenu, isMenuOpen]);

  return (
    <header className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src="/favicon.svg" alt="Site Logo" className="mr-2 h-8 w-8" />
          <span className="font-bold">SaaS Product</span>
        </Link>
        <nav className="hidden md:flex items-center">
          <Link to="/about" className="mr-4 hover:text-blue-500">
            About
          </Link>
          <Link to="/models" className="mr-4 hover:text-blue-500">
            Models
          </Link>
          <Link to="/experience" className="mr-4 hover:text-blue-500">
            Experience
          </Link>
          <Link to="/contact" className="mr-4 hover:text-blue-500">
            Contact
          </Link>
          <button onClick={handleToggle} className="focus:outline-none">
            {isDarkMode ? <Sun /> : <Moon />}
          </button>
        </nav>
        <button
          onClick={toggleMenu}
          className="md:hidden focus:outline-none"
          aria-label="Toggle Menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
});

export default Header;