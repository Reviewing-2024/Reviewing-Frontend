import React, { useState, useEffect } from 'react';
import HalfStar from './HalfStar';
import '../../../assert/StarRatingInput.css';

const StarRatingInput = ({ value = 0, onChange }) => {
  const [hover, setHover] = useState(value);

  useEffect(() => {
    setHover(value);
  }, [value]);

  const handleClick = (val) => {
    onChange(val);
  };

  const handleHover = (val) => {
    setHover(val);
  };

  const handleLeave = () => {
    setHover(value);
  };

  return (
    <div className="star-row" onMouseLeave={handleLeave}>
      {Array.from({ length: 5 }, (_, idx) => (
        <div className="star-container" key={idx}>
          {hover >= idx + 1 ? (
            <HalfStar fill={1} />
          ) : hover >= idx + 0.5 ? (
            <HalfStar fill={0.5} />
          ) : (
            <HalfStar fill={0} />
          )}
          <div
            className="half left"
            onMouseEnter={() => handleHover(idx + 0.5)}
            onClick={() => handleClick(idx + 0.5)}
          ></div>
          <div
            className="half right"
            onMouseEnter={() => handleHover(idx + 1)}
            onClick={() => handleClick(idx + 1)}
          ></div>
        </div>
      ))}
    </div>
  );
};

export default StarRatingInput;