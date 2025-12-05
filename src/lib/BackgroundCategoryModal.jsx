import React, { useState } from 'react';
import './BackgroundCategoryModal.css';

const CATEGORIES = [
  { id: 'space', label: 'Space Backgrounds' },
  { id: 'fun', label: 'Fun Backgrounds' }
];

export default function BackgroundCategoryModal({ backgrounds, onSelect, onClose }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const getBackgroundsForCategory = (catId) => {
    if (catId === 'space') {
      return backgrounds.slice(0, 8);
    }
    if (catId === 'fun') {
      return backgrounds.slice(8, 16);
    }
    return [];
  };

  return (
    <div className="bg-modal-overlay">
      <div className="bg-modal">
        {!selectedCategory ? (
          <div className="bg-modal-categories">
            <h2 className="bg-modal-title">Select Background Category</h2>
            <div className="bg-modal-category-list">
              {CATEGORIES.map(cat => (
                <button key={cat.id} className="bg-modal-category-btn" onClick={() => setSelectedCategory(cat.id)}>
                  {cat.label}
                </button>
              ))}
            </div>
            <button className="bg-modal-close" onClick={onClose}>Close</button>
          </div>
        ) : (
          <div className="bg-modal-backgrounds">
            <div className="bg-modal-header">
              <button className="bg-modal-back" onClick={() => setSelectedCategory(null)}>&larr; Back</button>
              <h2 className="bg-modal-title">Choose a Background</h2>
              <button className="bg-modal-close" onClick={onClose}>Close</button>
            </div>
            <div className="bg-modal-preview-list">
              {getBackgroundsForCategory(selectedCategory).map(bg => (
                <div key={bg.id} className="bg-modal-card" onClick={() => onSelect(bg.id)}>
                  <div className="bg-modal-preview">
                    <bg.component {...(bg.props || {})} />
                  </div>
                  <div className="bg-modal-label">{bg.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
