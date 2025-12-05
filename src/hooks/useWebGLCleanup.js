import { useEffect, useRef } from 'react';

/**
 * Custom hook to manage cleanup for WebGL/Canvas components
 * Ensures proper resource disposal when component unmounts or dependencies change
 */
export const useWebGLCleanup = (setupFn, dependencies = []) => {
  const cleanupFnsRef = useRef([]);
  const isUnmountingRef = useRef(false);

  useEffect(() => {
    isUnmountingRef.current = false;
    cleanupFnsRef.current = [];

    const cleanup = setupFn((fn) => {
      // Register a cleanup function
      cleanupFnsRef.current.push(fn);
    });

    if (cleanup) {
      cleanupFnsRef.current.push(cleanup);
    }

    return () => {
      isUnmountingRef.current = true;
      
      // Execute all cleanup functions in reverse order
      for (let i = cleanupFnsRef.current.length - 1; i >= 0; i--) {
        try {
          const fn = cleanupFnsRef.current[i];
          if (typeof fn === 'function') {
            fn();
          }
        } catch (e) {
          console.error('Cleanup error:', e);
        }
      }
      
      cleanupFnsRef.current = [];
    };
  }, dependencies);

  return isUnmountingRef;
};
