import React, { useRef, useEffect, useState } from 'react';

function StaggeredBackgroundPreview({ bg, isActive, onClick, index }) {
  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRender(true);
    }, index * 450);

    return () => clearTimeout(timer);
  }, [index]);

  useEffect(() => {
    if (!shouldRender) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '200px'
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
  }, [shouldRender]);

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
          {shouldRender && isVisible ? (
            <BgComponent {...(bg.props || {})} />
          ) : (
            <div style={{ width: '100%', height: '100%', backgroundColor: '#0a0a1a' }} />
          )}
        </div>
        <span className="bg-label">{bg.label}</span>
      </div>
    </button>
  );
}

export default StaggeredBackgroundPreview;
