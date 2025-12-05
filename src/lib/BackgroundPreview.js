import React, { useState, useEffect } from 'react';
import Lightning from '../effects/Lightning';
import Hyperspeed from '../effects/Hyperspeed';
import LiquidEther from '../effects/LiquidEther';
import FloatingLines from '../effects/FloatingLines';
import Galaxy from '../effects/Galaxy';
import LightRays from '../effects/LightRays';
import ColorBends from '../effects/ColorBends';
import Plasma from '../effects/Plasma';
import Aurora from '../effects/Aurora';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import Prism from '../effects/Prism';
import DarkVeil from '../effects/DarkVeil';
import LightPillar from '../effects/LightPillar';
import Iridescence from '../effects/Iridescence';
import LiquidChrome from '../effects/LiquidChrome';
import { getWebGLContextPool } from '../utils/WebGLContextPool';

// This array must match the BACKGROUNDS in App.js
// Whenever a new background is added to App.js, it will automatically appear here
const BACKGROUNDS = [
  { id: 'lightrays-white', label: 'Light Rays (White)', component: LightRays, props: { raysColor: '#ffffff' } },
  { id: 'lightrays-blue', label: 'Light Rays (Blue)', component: LightRays, props: { raysColor: '#0099ff', saturation: 1.8, lightSpread: 1.5, rayLength: 3, fadeDistance: 0.6 } },
  { id: 'lightning', label: 'Lightning', component: Lightning },
  { id: 'hyperspeed', label: 'Hyperspeed', component: Hyperspeed },
  { id: 'liquidether', label: 'Liquid Ether', component: LiquidEther },
  { id: 'floatinglines', label: 'Floating Lines', component: FloatingLines },
  { id: 'galaxy', label: 'Galaxy', component: Galaxy },
  { id: 'colorbends', label: 'Color Bends', component: ColorBends },
  { id: 'plasma', label: 'Plasma', component: Plasma },
  { id: 'aurora', label: 'Aurora', component: Aurora },
  { id: 'prism', label: 'Prism', component: Prism },
  { id: 'darkveil', label: 'Dark Veil', component: DarkVeil },
  { id: 'lightpillar', label: 'Light Pillar', component: LightPillar, props: { topColor: '#FF9FFC', bottomColor: '#5227FF', intensity: 1.0, rotationSpeed: 0.3, glowAmount: 0.005, pillarWidth: 3.0, pillarHeight: 0.4, noiseIntensity: 0.5 } },
  { id: 'iridescence', label: 'Iridescence', component: Iridescence, props: { color: [1, 1, 1], mouseReact: false, amplitude: 0.1, speed: 1.0 } },
  { id: 'liquidchrome', label: 'Liquid Chrome', component: LiquidChrome, props: { baseColor: [0.1, 0.1, 0.1], speed: 0.2, amplitude: 0.3, interactive: false } }
];

function BackgroundPreview() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);

  // Initialize WebGL context pool for background rendering
  useEffect(() => {
    getWebGLContextPool(4);
  }, []);

  useEffect(() => {
    if (!autoRotate) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BACKGROUNDS.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [autoRotate]);

  const currentBg = BACKGROUNDS[currentIndex];
  const CurrentComponent = currentBg.component;
  const currentBgProps = currentBg.props || {};

  const goToPrevious = () => {
    setAutoRotate(false);
    setCurrentIndex((prev) => (prev - 1 + BACKGROUNDS.length) % BACKGROUNDS.length);
  };

  const goToNext = () => {
    setAutoRotate(false);
    setCurrentIndex((prev) => (prev + 1) % BACKGROUNDS.length);
  };

  const goToIndex = (index) => {
    setAutoRotate(false);
    setCurrentIndex(index);
  };

  const handleMouseEnter = () => {
    setAutoRotate(false);
  };

  const handleMouseLeave = () => {
    setAutoRotate(true);
  };

  return (
    <div 
      className="background-preview-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="preview-header">
        <h3>Background Preview</h3>
      </div>

      <div className="preview-showcase">
        <div className="preview-main">
          <div className="preview-canvas" key={currentBg.id}>
            {CurrentComponent && <CurrentComponent key={currentBg.id} {...currentBgProps} />}
          </div>
          <div className="preview-label">{currentBg.label}</div>
        </div>

        {/* Navigation Arrows */}
        <button 
          className="preview-nav-btn prev"
          onClick={goToPrevious}
          aria-label="Previous background"
        >
          <BiChevronLeft className="nav-chevron" />
        </button>
        <button 
          className="preview-nav-btn next"
          onClick={goToNext}
          aria-label="Next background"
        >
          <BiChevronRight className="nav-chevron" />
        </button>
      </div>

      {/* Thumbnail Navigation */}
      <div className="preview-thumbnails">
        {BACKGROUNDS.map((bg, index) => (
          <button
            key={bg.id}
            className={`thumbnail ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToIndex(index)}
            aria-label={`Show ${bg.label}`}
            title={bg.label}
          >
            <span className="thumbnail-label">{bg.label}</span>
          </button>
        ))}
      </div>

      {/* Auto-rotate Indicator */}
      <div className="preview-indicator">
        {autoRotate && <div className="auto-rotate-badge">Auto-rotating</div>}
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{
              animation: autoRotate ? 'progress 4.5s linear infinite' : 'none'
            }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default BackgroundPreview;
