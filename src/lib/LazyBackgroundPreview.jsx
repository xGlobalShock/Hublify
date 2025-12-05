import React, { useRef, useEffect, useState } from 'react';

/**
 * LazyBackgroundPreview - Only renders when visible in viewport
 * Prevents WebGL context exhaustion by limiting concurrent renderers
 */
function LazyBackgroundPreview({ bg, isActive, onClick }) {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  const BgComponent = bg.component;

  return (
    <button
      ref={containerRef}
      className={`bg-option ${isActive ? 'active' : ''}`}
      onClick={onClick}
      title={bg.label}
    >
      <div className="bg-preview-container">
        <div className="bg-preview">
          {isVisible ? (
            <BgComponent {...(bg.props || {})} />
          ) : (
            <div style={{ width: '100%', height: '100%', backgroundColor: '#0a0a0a' }} />
          )}
        </div>
        <span className="bg-label">{bg.label}</span>
      </div>
    </button>
  );
}

export default LazyBackgroundPreview;
