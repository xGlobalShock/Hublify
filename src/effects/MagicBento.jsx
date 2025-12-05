import React, { useState } from 'react';
import './MagicBento.css';

const MagicBento = ({ children }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className="magic-bento-container">
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          className={`bento-item bento-item-${index}`}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          style={{
            opacity: hoveredIndex === null || hoveredIndex === index ? 1 : 0.6,
            transform: hoveredIndex === index ? 'scale(1.02)' : 'scale(1)',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          <div className="bento-item-inner">
            {child}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MagicBento;
