
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { items } from '../../data/data';
import StarRatingComponent from 'react-rating-stars-component';  
import '../../assert/detailpage.css';    
import { GoReport } from "react-icons/go";
import { FaHeart, FaCartPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ReviewModal = ({ isOpen, onClose, onSubmit, onChange, ratingChanged, newReview }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="form-title">리뷰를 작성해주세요</h3>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="rating">Rating</label>
            <StarRatingComponent
              count={5}
              onChange={ratingChanged}
              size={24}
              isHalf={true}
              value={newReview.rating}
              activeColor="#ffd700"
            />
          </div>
          <div className="form-group">
            <label htmlFor="content">Feedback</label>
            <textarea
              id="content"
              name="content"
              rows="4"
              value={newReview.content}
              onChange={onChange}
              placeholder="Write your review here"
              className="form-control"
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="attachment">Attachment</label>
            <input
              type="file"
              id="attachment"
              name="attachment"
              onChange={(e) => onChange({ target: { name: 'attachment', value: e.target.files[0] } })}
              className="form-control"
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>취소</button>
            <button type="submit" className="btn btn-primary">게시하기</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 신고하기 모달
const ReportModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>신고 사유</h3>
        <textarea placeholder="신고 사유를 작성해주세요" rows="4" className="report-textarea"></textarea>
        <div className="form-actions">
          <button onClick={onClose} className="btn btn-primary">제출</button>
          <button onClick={onClose} className="btn btn-secondary">닫기</button>
        </div>
      </div>
    </div>
  );
};

const Detail = () => {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reviews, setReviews] = useState([
    { user: 'User1', content: '정말 집에가고 싶은 강의네요.', likes: 350, date: new Date(2023, 5, 12) },
    { user: 'User2', content: '이번 강의는 마음에 들어요 다른 강의도 들어보고 싶어여', likes: 50, date: new Date(2023, 6, 15) },
    { user: 'User3', content: '정말 형편없는 강의네요', likes: 35, date: new Date(2023, 7, 20) },
  ]);
  const [newReview, setNewReview] = useState({ rating: 5, content: '', attachment: null });
  const [sortOption, setSortOption] = useState('latest');
  const { id } = useParams();
  const item = items.find((item) => item.id === parseInt(id));

  const toggleReviewModal = () => setShowReviewModal(!showReviewModal);
  const toggleReportModal = () => setShowReportModal(!showReportModal);

  const handleSortChange = (e) => {
    const option = e.target.value;
    setSortOption(option);

    const sortedReviews = [...reviews];
    if (option === 'latest') {
      sortedReviews.sort((a, b) => b.date - a.date);
    } else if (option === 'likes') {
      sortedReviews.sort((a, b) => b.likes - a.likes);
    }
    setReviews(sortedReviews);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setReviews([...reviews, { user: 'New User', content: newReview.content, likes: 0, date: new Date() }]);
    setNewReview({ rating: 5, content: '', attachment: null });
    setShowReviewModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

  const ratingChanged = (newRating) => setNewReview((prev) => ({ ...prev, rating: newRating }));

  useEffect(() => {
    const initPattern = () => {
      const canvas = document.getElementById('canvas');
      const context = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = 300;

      const spacingX = 55;
      const spacingY = 35;
      const offsetVariance = 13;
      const baseRadius = 55;
      const points = [];

      const preparePoints = () => {
        for (let i = spacingY; i < canvas.height; i += spacingY) {
          const pointSet = [];
          for (let j = spacingX; j < canvas.width; j += spacingX) {
            const offsetX = Math.round(Math.random() * offsetVariance * 2 - offsetVariance);
            const offsetY = Math.round(Math.random() * offsetVariance * 2 - offsetVariance);
            const offsetR = Math.round(Math.random() * offsetVariance * 2 - offsetVariance);
            pointSet.push({ x: j + offsetX, y: i + offsetY, radius: baseRadius + offsetR });
          }
          points.push(pointSet);
        }
      };

      const createPattern = () => {
        points.forEach((pointSet) => {
          pointSet.forEach((point) => {
            for (let k = point.radius; k > 0; k -= 3) {
              context.beginPath();
              context.arc(point.x, point.y, k, 0, Math.PI * 2, true);
              context.closePath();
              context.fillStyle = '#ffffff';
              context.strokeStyle = '#9FCFE3';
              context.fill();
              context.stroke();
            }
          });
        });
      };

      preparePoints();
      createPattern();
    };

    initPattern();
  }, []);

  return (
    <div className="detail-page">
      <header className="header-section">
        <canvas id="canvas" className="canvas-background"></canvas>
        <div className="header-content">
          <img src={item.src} alt="Course Thumbnail" className="course-image" />
          <div className="header-meta">
            <h2 className="course-title">{item.title}</h2>
            <div className="instructor-info">
              <h3 className="instructor-name">강사명: {item.instructor}</h3>
            </div>
            <div className="action-buttons">
              <span className="like-count">
                <FaHeart /> {item.likes}
              </span>
              <button onClick={() => toast('위시리스트에 저장했습니다')} className="Cart-icon-button">
                <FaCartPlus />
              </button>
            </div>
            <a href={item.link} className="course-link">
              강의로 이동
            </a>
          </div>
        </div>
      </header>
      <section className="review-section">
        <div className="review-write">
          <span className="review-count">총 {reviews.length}개 리뷰</span>
          <button onClick={toggleReviewModal} className="btn btn-primary">리뷰 작성</button>
          <select value={sortOption} onChange={handleSortChange} className="sort-select">
            <option value="latest">최신순</option>
            <option value="likes">좋아요순</option>
          </select>
        </div>

        <div className="review-list">
          {reviews.map((review, index) => (
            <div key={index} className="review-item">
              <div className="review-user">{review.user}</div>
              <div className="review-content">{review.content}</div>
              <div className="review-likes">
                <FaHeart /> {review.likes}
                <button onClick={toggleReportModal} className="report-icon-button">
                  <GoReport />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ReviewModal
        isOpen={showReviewModal}
        onClose={toggleReviewModal}
        onSubmit={handleSubmit}
        onChange={handleChange}
        ratingChanged={ratingChanged}
        newReview={newReview}
      />

      <ReportModal
        isOpen={showReportModal}
        onClose={toggleReportModal}
      />
    </div>
  );
};

export default Detail;

