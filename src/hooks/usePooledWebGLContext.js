import { useEffect, useRef } from 'react';
import { getWebGLContextPool } from '../utils/WebGLContextPool';
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
    };
  }, [canvasRef, poolSize]);

  return contextRef;
}

export default usePooledWebGLContext;
