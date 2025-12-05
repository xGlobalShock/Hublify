import React, { useEffect, useRef } from 'react';

/**
 * Wrapper component to ensure proper cleanup of background components
 * when switching between them
 */
const BackgroundWrapper = ({ children }) => {
  const containerRef = useRef(null);
  const cleanupRef = useRef([]);

  useEffect(() => {
    return () => {
      // Clean up any hanging RAF or resources
      if (containerRef.current) {
        try {
          // Clear all children safely
          containerRef.current.innerHTML = '';
        } catch (e) {
          console.warn('Error during cleanup:', e);
        }
      }
      
      // Clear any stored animation frames or timeouts
      cleanupRef.current.forEach(id => {
        try {
          cancelAnimationFrame(id);
          clearTimeout(id);
        } catch (e) {
          // Ignore cleanup errors
        }
      });
      cleanupRef.current = [];
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        inset: 0
      }}
    >
      {children}
    </div>
  );
};

export default BackgroundWrapper;
