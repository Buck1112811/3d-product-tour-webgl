import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import '../../styles/layout/footer.css';

export interface FooterProps {}

const Footer: React.FC<FooterProps> = memo(() => {
  Footer.displayName = 'Footer';
  const { isDarkMode } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 py-4`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <span>© {currentYear} Your Company</span>
        <nav>
          <Link to="/privacy" className="mr-4 hover:text-blue-500">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-blue-500">
            Terms of Service
          </Link>
        </nav>
      </div>
    </footer>
  );
});

export default Footer;