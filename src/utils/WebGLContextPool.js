/**
 * WebGL Context Pool Manager
 * Distributes WebGL rendering across multiple contexts to prevent exhaustion
 * Automatically adapts pool size based on device capabilities
 */

class WebGLContextPool {
  constructor(poolSize = null) {
    // Auto-detect optimal pool size if not specified
    this.poolSize = poolSize ?? this.detectOptimalPoolSize();
    this.contexts = [];
    this.inUse = new Map();
    this.contextIndex = 0;
    this.maxContexts = this.detectMaxContexts();
  }

  /**
   * Detect optimal pool size based on device capabilities
   */
  detectOptimalPoolSize() {
    // Check if mobile device
    const isMobile = /mobile|android|iphone|ipad|ipod/i.test(navigator.userAgent);
    
    // Check GPU tier (if available)
    const hasLowEndGPU = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2;
    
    if (isMobile || hasLowEndGPU) {
      return 2; // Mobile/low-end: minimal contexts
    } else if (navigator.hardwareConcurrency && navigator.hardwareConcurrency >= 8) {
      return 6; // High-end desktop: more contexts
    }
    
    return 4; // Default: balanced for most devices
  }

  /**
   * Detect browser's maximum WebGL contexts limit
   */
  detectMaxContexts() {
    // Most browsers support 8-16 contexts
    // Conservative estimate to avoid hitting limits
    return 8;
  }

  getContext(canvas) {
    if (!canvas) return null;

    // Initialize contexts on first use
    if (this.contexts.length === 0) {
      this.initializePool();
    }

    // If we have no contexts (initialization failed), return null
    if (this.contexts.length === 0) {
      console.warn('No WebGL contexts available');
      return null;
    }

    // Round-robin distribution - use next context in sequence
    const context = this.contexts[this.contextIndex % this.contexts.length];
    this.contextIndex++;

    return context;
  }

  initializePool() {
    const successfulContexts = [];
    
    // Create shared offscreen canvases for the context pool
    for (let i = 0; i < this.poolSize; i++) {
      try {
        // Check if we're approaching browser limits
        if (successfulContexts.length >= this.maxContexts) {
          console.warn(`Reached maximum safe context limit (${this.maxContexts})`);
          break;
        }

        const offscreenCanvas = new OffscreenCanvas(1, 1);
        const context = offscreenCanvas.getContext('webgl', {
          alpha: true,
          antialias: false, // Disable for better performance
          depth: false, // Most 2D effects don't need depth buffer
          stencil: false, // Most 2D effects don't need stencil buffer
          preserveDrawingBuffer: false, // Allow browser to optimize
          powerPreference: 'default', // Let browser decide based on workload
          failIfMajorPerformanceCaveat: false // Don't fail on software rendering
        });

        if (context) {
          successfulContexts.push(context);
        }
      } catch (e) {
        console.warn(`Failed to create WebGL context ${i}:`, e);
        // Stop trying if we're hitting errors
        break;
      }
    }

    this.contexts = successfulContexts;
    console.log(`WebGL Context Pool initialized: ${this.contexts.length}/${this.poolSize} contexts (optimized for ${this.getDeviceType()})`);
  }

  /**
   * Get device type for logging
   */
  getDeviceType() {
    if (/mobile|android|iphone|ipad|ipod/i.test(navigator.userAgent)) {
      return 'mobile';
    }
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency >= 8) {
      return 'high-end desktop';
    }
    return 'desktop';
  }

  getStats() {
    return {
      poolSize: this.poolSize,
      activeContexts: this.contexts.length,
      totalRequests: this.contextIndex
    };
  }

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
