import { useEffect, useRef } from 'react';
export const useWebGLCleanup = (setupFn, dependencies = []) => {
  const cleanupFnsRef = useRef([]);
  const isUnmountingRef = useRef(false);

  useEffect(() => {
    isUnmountingRef.current = false;
    cleanupFnsRef.current = [];

    const cleanup = setupFn((fn) => {
      cleanupFnsRef.current.push(fn);
    });

    if (cleanup) {
      cleanupFnsRef.current.push(cleanup);
    }

    return () => {
      isUnmountingRef.current = true;
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
