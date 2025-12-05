import React, { useEffect, useRef, useState } from 'react';

/**
 * BackgroundPreviewImage - Renders a background once and captures it as an image
 * Prevents multiple WebGL contexts from being created in the modal
 */
function BackgroundPreviewImage({ bg, label }) {
  const canvasRef = useRef(null);
  const [imageData, setImageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (canvasRef.current) {
        try {
          // Get the canvas image data and convert to blob
          const imageUrl = canvasRef.current.toDataURL('image/png');
          setImageData(imageUrl);
        } catch (e) {
          console.warn('Failed to capture preview:', e);
        }
      }
      setIsLoading(false);
    }, 500); // Give component time to render

    return () => clearTimeout(timeout);
  }, []);

  const BgComponent = bg.component;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Hidden component that renders once */}
      <div
        ref={canvasRef}
        style={{
          position: 'absolute',
          visibility: 'hidden',
          width: '200px',
          height: '200px',
          pointerEvents: 'none'
        }}
      >
        <BgComponent {...(bg.props || {})} />
      </div>

      {/* Display either captured image or loading state */}
      {imageData ? (
        <img
          src={imageData}
          alt={label}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#1a1a1a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#666'
          }}
        >
          {isLoading ? 'Loading...' : 'No preview'}
        </div>
      )}
    </div>
  );
}

export default BackgroundPreviewImage;
