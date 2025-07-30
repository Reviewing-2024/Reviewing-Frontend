import React from "react";
import { FaStar } from "react-icons/fa";
import '../../../assert/StarRatingInput.css';

const HalfStar = ({ fill = 0 }) => (
  <div className="half-star-wrapper">
    <FaStar className="star-base" color="lightgray" />
    <div className="star-overlay" style={{ width: `${fill * 100}%` }}>
      <FaStar className="star-clip" color="gold" />
    </div>
  </div>
);

export default HalfStar;
