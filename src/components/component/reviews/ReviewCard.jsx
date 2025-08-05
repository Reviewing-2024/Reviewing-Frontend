import React from 'react';
import { FaThumbsDown, FaThumbsUp, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { FiLoader } from "react-icons/fi";

import { FaRegTrashAlt } from "react-icons/fa";

const ReviewCard = ({ review, handleLike, likedloading, handleDislike, dislikedloading, myReview, onDeleteRequest }) => {
  return (
    <div className="review-card">
      <div className="review-header">
        <p className="review-author">{review.nickname}</p>
        <div className="review-rating">
          {Array.from({ length: 5 }, (_, index) => {
            const starValue = index + 1;
            if (review.rating >= starValue) {
              return <FaStar key={index} color="#ffd700" />;
            } else if (review.rating >= starValue - 0.5) {
              return <FaStarHalfAlt key={index} color="#ffd700" />;
            } else {
              return <FaRegStar key={index} color="#ffd700" />;
            }
          })}
        </div>
      </div>
      <div className="review-content">{review.contents}</div>
      <p className="review-createdAt">{review.createdAt}</p>
      <div className="review-actions">
        <button
          className={`btn-icon ${review.liked ? "like" : ""}`}
          onClick={() => handleLike(review.id, review.liked)}
          disabled={likedloading}
        >
          {likedloading ? <FiLoader /> : <><FaThumbsUp /> {review.likes}</>}
        </button>
        <button
          className={`btn-icon ${review.disliked ? "dislike" : ""}`}
          onClick={() => handleDislike(review.id, review.disliked)}
          disabled={dislikedloading}
        >
          {dislikedloading ? <FiLoader /> : <><FaThumbsDown /> {review.dislikes}</>}
        </button>
        { myReview == true && (
          <span className='review-delete'>
            <FaRegTrashAlt onClick={() => onDeleteRequest(review)} style={{ cursor: 'pointer' }}/>
          </span>
        )}
        </div>
      </div>
  );
};

export default ReviewCard;