import React, { useState } from 'react';
import './StarRating.css';

/**
 * Props:
 *  - value (number 1-5)
 *  - onChange (fn) — if provided, renders interactive stars
 *  - size ('sm' | 'md' | 'lg')
 */
export default function StarRating({ value = 0, onChange, size = 'md' }) {
  const [hovered, setHovered] = useState(0);
  const interactive = !!onChange;
  const display = interactive ? (hovered || value) : value;

  return (
    <div className={`stars stars--${size} ${interactive ? 'stars--interactive' : ''}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= display ? 'star--filled' : 'star--empty'}`}
          onClick={() => interactive && onChange(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}
