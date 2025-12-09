import React, { useState, useRef, useEffect } from 'react';
import './BackgroundCategoryModal.css';

// Legacy render limiting removed — unused variables cleaned up

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.props.onError && this.props.onError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ width: '100%', height: '100%', backgroundColor: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: '11px', textAlign: 'center', padding: '4px' }}>
          Preview unavailable
        </div>
      );
    }

    return this.props.children;
  }
}

// Categories: kept in design but not currently used

// Isolated wrapper that renders background once and never updates
const IsolatedBackground = React.memo(({ BackgroundComponent, props }) => {
  return <BackgroundComponent {...props} />;
}, () => true); // Always return true to prevent ANY re-renders

const BackgroundCard = React.memo(({ bg, onClick, isSelected, getModalProps, isCategorySelected }) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef(null);
  const isolationRef = useRef(null);

  // Cleanup function when component unmounts or re-renders
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    return () => {
      // Clean up WebGL contexts and cancel animation frames
      // eslint-disable-next-line react-hooks/exhaustive-deps
      const isolationElement = isolationRef.current;
      if (isolationElement) {
        try {
          const canvases = isolationElement.querySelectorAll('canvas');
          canvases.forEach(canvas => {
            const gl = canvas.getContext('webgl') || canvas.getContext('webgl2') || canvas.getContext('experimental-webgl');
            if (gl) {
              const loseContextExt = gl.getExtension('WEBGL_lose_context');
              if (loseContextExt) {
                loseContextExt.loseContext();
              }
            }
          });
          // Clear the container
          isolationElement.innerHTML = '';
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, []); // Only run on unmount, not on re-renders

  // Block ALL events on the isolation layer - prevents background components from receiving any events
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const isolationElement = isolationRef.current;
    if (!isolationElement) return;
    
    const blockEvent = (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    };

    const events = [
      'mousemove', 'mouseenter', 'mouseleave', 'mousedown', 'mouseup', 
      'click', 'dblclick', 'contextmenu', 'mouseout', 'mouseover',
      'touchstart', 'touchmove', 'touchend', 'touchcancel',
      'pointerdown', 'pointermove', 'pointerup', 'pointercancel',
      'wheel', 'drag', 'dragstart', 'dragend'
    ];

    
    events.forEach(eventName => {
      isolationElement.addEventListener(eventName, blockEvent, { 
        capture: true, 
        passive: false 
      });
    });

    // Also block events on all child elements as they're created
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            events.forEach(eventName => {
              node.addEventListener(eventName, blockEvent, { 
                capture: true, 
                passive: false 
              });
            });
          }
        });
      });
    });

    observer.observe(isolationElement, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      events.forEach(eventName => {
        isolationElement.removeEventListener(eventName, blockEvent, { 
          capture: true 
        });
      });
    };
  }, []);

  useEffect(() => {
    // Very conservative staggered rendering to prevent context exhaustion
    // Each preview gets a longer delay to space out context creation
    const delay = Math.random() * 1000 + 200; // Random delay 200-1200ms
    
    const timer = setTimeout(() => {
      setShouldRender(true);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleError = () => {
    setHasError(true);
  };

  return (
    <div 
      ref={containerRef} 
      className={`bg-modal-card ${isSelected ? 'selected' : ''}`} 
      onClick={() => onClick(bg.id)}
    >
      <div className="bg-modal-preview">
        {shouldRender ? (
          hasError ? (
            <div style={{ width: '100%', height: '100%', backgroundColor: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: '11px', textAlign: 'center', padding: '4px' }}>
              Preview unavailable
            </div>
          ) : (
            <ErrorBoundary onError={handleError}>
              {/* Double-wrapped isolation to prevent any events from reaching background components */}
              <div 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  position: 'relative',
                  overflow: 'hidden',
                  isolation: 'isolate'
                }}
              >
                {/* Background component container - isolated from events */}
                <div 
                  ref={isolationRef}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    overflow: 'hidden',
                    userSelect: 'none',
                    touchAction: 'none',
                    zIndex: 1
                  }}
                >
                  {/* Completely isolated - never re-renders after initial mount */}
                  <IsolatedBackground 
                    BackgroundComponent={bg.component}
                    props={getModalProps(bg)}
                  />
                </div>
                {/* Full-coverage event blocker overlay - MUST sit above and actively block events */}
                <div 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 10,
                    userSelect: 'none',
                    background: 'transparent',
                    cursor: 'pointer'
                  }}
                  onMouseDown={(e) => { e.preventDefault(); e.stopImmediatePropagation(); return false; }}
                  onMouseUp={(e) => { e.preventDefault(); e.stopImmediatePropagation(); return false; }}
                  onMouseMove={(e) => { e.preventDefault(); e.stopImmediatePropagation(); return false; }}
                  onMouseEnter={(e) => { e.preventDefault(); e.stopImmediatePropagation(); return false; }}
                  onMouseLeave={(e) => { e.preventDefault(); e.stopImmediatePropagation(); return false; }}
                  onMouseOut={(e) => { e.preventDefault(); e.stopImmediatePropagation(); return false; }}
                  onClick={(e) => { e.preventDefault(); e.stopImmediatePropagation(); return false; }}
                  onDoubleClick={(e) => { e.preventDefault(); e.stopImmediatePropagation(); return false; }}
                  onContextMenu={(e) => { e.preventDefault(); e.stopImmediatePropagation(); return false; }}
                  onTouchStart={(e) => { e.preventDefault(); e.stopImmediatePropagation(); return false; }}
                  onTouchMove={(e) => { e.preventDefault(); e.stopImmediatePropagation(); return false; }}
                  onTouchEnd={(e) => { e.preventDefault(); e.stopImmediatePropagation(); return false; }}
                  onTouchCancel={(e) => { e.preventDefault(); e.stopImmediatePropagation(); return false; }}
                  onPointerDown={(e) => { e.preventDefault(); e.stopImmediatePropagation(); return false; }}
                  onPointerMove={(e) => { e.preventDefault(); e.stopImmediatePropagation(); return false; }}
                  onPointerUp={(e) => { e.preventDefault(); e.stopImmediatePropagation(); return false; }}
                  onPointerCancel={(e) => { e.preventDefault(); e.stopImmediatePropagation(); return false; }}
                />
              </div>
            </ErrorBoundary>
          )
        ) : null}
      </div>
      <div className="bg-modal-label">{bg.label}</div>
      {isSelected && <div className="bg-modal-selected-indicator">✓ Selected</div>}
    </div>
  );
}, (prevProps, nextProps) => {
  // Only re-render if isSelected changes or bg.id changes
  return prevProps.isSelected === nextProps.isSelected && prevProps.bg.id === nextProps.bg.id;
});

export default function BackgroundCategoryModal({ backgrounds, onSelect, onClose }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedBackground, setSelectedBackground] = useState(null);
  const selectionTimerRef = useRef(null);

  const backgroundsPerPage = 8;
  const totalPages = Math.ceil(backgrounds.length / backgroundsPerPage);

  const getBackgroundsForPage = (page) => {
    const start = page * backgroundsPerPage;
    const end = start + backgroundsPerPage;
    return backgrounds.slice(start, end);
  };

  // Completely disable all interactions for backgrounds in modal
  const getModalProps = (bg) => {
    const baseProps = bg.props || {};
    
    // Filter out ALL interaction-related props to prevent React DOM warnings
    // The event blocking layer will handle preventing interactions
    const filteredProps = Object.keys(baseProps).reduce((acc, key) => {
      const lowerKey = key.toLowerCase();
      // Skip any props related to interaction/mouse behavior
      if (lowerKey.includes('mouse') || 
          lowerKey.includes('interact') || 
          lowerKey.includes('repulsion') ||
          lowerKey.includes('follow')) {
        return acc;
      }
      acc[key] = baseProps[key];
      return acc;
    }, {});
    
    // Explicitly disable any mouse/interaction features
    return {
      ...filteredProps,
      followMouse: false,
      mouseInfluence: 0,
      interactive: false
    };
  };

  const handleBackgroundSelect = (bgId) => {
    // Debounce selection to prevent rapid clicks from causing issues
    if (selectionTimerRef.current) {
      clearTimeout(selectionTimerRef.current);
    }
    
    selectionTimerRef.current = setTimeout(() => {
      setSelectedBackground(bgId);
    }, 50);
  };

  const handleApply = () => {
    if (selectedBackground) {
      onSelect(selectedBackground);
      onClose();
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (selectionTimerRef.current) {
        clearTimeout(selectionTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-modal-overlay">
      <div className="bg-modal">
        <div className="bg-modal-backgrounds">
          <div className="bg-modal-header">
            <h2 className="bg-modal-title">Choose a Background</h2>
            <button className="bg-modal-close" onClick={onClose}>Close</button>
          </div>
          <div className="bg-modal-preview-list">
            {getBackgroundsForPage(currentPage).map(bg => (
              <BackgroundCard 
                key={bg.id} 
                bg={bg} 
                onClick={handleBackgroundSelect}
                isSelected={selectedBackground === bg.id}
                getModalProps={getModalProps}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="bg-modal-pagination">
              {currentPage > 0 && (
                <button 
                  className="bg-modal-page-btn" 
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                >
                  &larr; Previous
                </button>
              )}
              <span className="bg-modal-page-info">
                Page {currentPage + 1} of {totalPages}
              </span>
              {currentPage < totalPages - 1 && (
                <button 
                  className="bg-modal-page-btn" 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                >
                  Next &rarr;
                </button>
              )}
            </div>
          )}
          {selectedBackground && (
            <div className="bg-modal-footer">
              <button className="bg-modal-apply-btn" onClick={handleApply}>
                Apply Background
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
