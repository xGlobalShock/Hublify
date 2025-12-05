/**
 * WebGL Context Pool Manager
 * Distributes WebGL rendering across multiple contexts (default: 4) to prevent exhaustion
 * Think of it like having 4 workers instead of 1 doing all the work
 */

class WebGLContextPool {
  constructor(poolSize = 4) {
    this.poolSize = poolSize;
    this.contexts = [];
    this.inUse = new Map();
    this.contextIndex = 0;
  }

  /**
   * Get the next available context from the pool
   * If no contexts exist yet, create new ones
   */
  getContext(canvas) {
    if (!canvas) return null;

    // Initialize contexts on first use
    if (this.contexts.length === 0) {
      this.initializePool();
    }

    // Round-robin distribution - use next context in sequence
    const context = this.contexts[this.contextIndex % this.poolSize];
    this.contextIndex++;

    return context;
  }

  /**
   * Create a pool of WebGL contexts
   */
  initializePool() {
    // Create shared offscreen canvases for the context pool
    for (let i = 0; i < this.poolSize; i++) {
      try {
        const offscreenCanvas = new OffscreenCanvas(1, 1);
        const context = offscreenCanvas.getContext('webgl', {
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true,
          powerPreference: 'high-performance'
        });

        if (context) {
          this.contexts.push(context);
        }
      } catch (e) {
        console.warn(`Failed to create context ${i}:`, e);
      }
    }

    console.log(`WebGL Context Pool initialized with ${this.contexts.length} contexts`);
  }

  /**
   * Get pool statistics for monitoring
   */
  getStats() {
    return {
      poolSize: this.poolSize,
      activeContexts: this.contexts.length,
      totalRequests: this.contextIndex
    };
  }

  /**
   * Cleanup - release all contexts
   */
  dispose() {
    this.contexts = [];
    this.inUse.clear();
    this.contextIndex = 0;
  }
}

// Singleton instance
let poolInstance = null;

export function getWebGLContextPool(poolSize = 4) {
  if (!poolInstance) {
    poolInstance = new WebGLContextPool(poolSize);
  }
  return poolInstance;
}

export function releaseWebGLContextPool() {
  if (poolInstance) {
    poolInstance.dispose();
    poolInstance = null;
  }
}

export default WebGLContextPool;
