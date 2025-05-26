import React, { memo, useCallback, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useTheme } from './context/ThemeContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import LandingHero from './components/sections/LandingHero';
import ModelShowcasePage from './pages/ModelShowcasePage';
import ExperiencePage from './pages/ExperiencePage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import * as THREE from 'three';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

interface AppProps {}

const App: React.FC<AppProps> = memo(() => {
  App.displayName = 'App';
  const { isDarkMode } = useTheme();

  return (
    <BrowserRouter>
      <div
        className={`flex flex-col min-h-screen ${
          isDarkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'
        }`}
      >
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingHero
                title="Engaging 3D Landing Page"
                subtitle="Interactive 3D models and parallax scrolling effects."
                ctaLabel="Learn More"
                ctaLink="/experience"
            />} />
            <Route path="/models" element={<ModelShowcasePage />} />
            <Route path="/experience" element={<ExperiencePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
});

export default App;