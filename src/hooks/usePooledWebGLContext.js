import { useEffect, useRef } from 'react';
import { getWebGLContextPool } from '../utils/WebGLContextPool';

/**
 * Hook to use a pooled WebGL context instead of creating individual contexts
 * This distributes the load across multiple contexts to prevent exhaustion
 */
export function usePooledWebGLContext(canvasRef, poolSize = 4) {
  const contextRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const pool = getWebGLContextPool(poolSize);
    const context = pool.getContext(canvasRef.current);

    if (context) {
      contextRef.current = context;
    }

    return () => {
      // Don't dispose the context - it's managed by the pool
    };
  }, [canvasRef, poolSize]);

  return contextRef;
}

export default usePooledWebGLContext;
