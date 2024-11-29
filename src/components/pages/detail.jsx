import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StarRatingComponent from 'react-rating-stars-component';
import { FaHeart, FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../assert/detailpage.css';


// 리뷰 작성 모달
const ReviewModal = ({ isOpen, onClose, onSubmit, onChange, ratingChanged, newReview }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3 className="form-title">리뷰를 작성해주세요</h3>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="rating">평점</label>
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
            <label htmlFor="content">리뷰 내용</label>
            <textarea
              id="content"
              name="content"
              rows="4"
              value={newReview.content}
              onChange={onChange}
              placeholder="리뷰를 작성해주세요"
              className="form-control"
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="attachment">첨부 파일</label>
            <input
              type="file"
              id="attachment"
              name="attachment"
              onChange={(e) =>
                onChange({ target: { name: 'attachment', value: e.target.files[0] } })
              }
              className="form-control"
            />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>취소</button>
            <button type="submit" className="btn btn-primary">작성</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Detail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]); 
  const [newReview, setNewReview] = useState({ rating: 5, content: '', attachment: null });
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [sortOption, setSortOption] = useState('latest');


  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`/courses/${id}`);
        if (!response.ok) throw new Error('강의 정보를 불러오지 못했습니다.');
        const data = await response.json();
        setCourse(data);
      } catch (error) {
        console.error(error);
        toast.error('강의 정보를 불러오는 중 문제가 발생했습니다.');
      }
    };
    fetchCourse();
  }, [id]);


  const fetchReviews = async () => {
    try {
      const response = await fetch(`/reviews/${id}?sort=${sortOption}`);
      if (!response.ok) throw new Error('리뷰를 불러오지 못했습니다.');
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error(error);
      toast.error('리뷰를 불러오는 중 문제가 발생했습니다.');
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [id, sortOption]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('로그인이 필요합니다.');
      navigate('/kakao/kakaologin');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('rating', newReview.rating);
      formData.append('contents', newReview.content);
      if (newReview.attachment) formData.append('certification', newReview.attachment);

      const response = await fetch(`/reviews/${id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error('리뷰 작성에 실패했습니다.');

      toast.success('리뷰가 성공적으로 등록되었습니다!');
      fetchReviews();
      setShowReviewModal(false);
    } catch (error) {
      console.error(error);
      toast.error('리뷰 작성 중 문제가 발생했습니다.');
    }
  };


  const handleLikeToggle = async (reviewId, likedByUser) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('로그인이 필요합니다.');
      navigate('/kakao/kakaologin');
      return;
    }
  
    try {
      const method = likedByUser ? 'DELETE' : 'POST'; 
      const response = await fetch(`/reviews/${reviewId}/like`, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!response.ok) {
        throw new Error(likedByUser ? '좋아요 취소 실패' : '좋아요 처리 실패');
      }
  
      fetchReviews(); 
    } catch (error) {
      console.error(error);
      toast.error(likedByUser ? '좋아요 취소 중 문제가 발생했습니다.' : '좋아요 처리 중 문제가 발생했습니다.');
    }
  };

  const handleDislikeToggle = async (reviewId, dislikedByUser) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('로그인이 필요합니다.');
      navigate('/kakao/kakaologin');
      return;
    }
  
    try {
      const method = dislikedByUser ? 'DELETE' : 'POST'; 
      const response = await fetch(`/reviews/${reviewId}/dislike`, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (!response.ok) {
        throw new Error(dislikedByUser ? '싫어요 취소 실패' : '싫어요 처리 실패');
      }
  
      fetchReviews(); 
    } catch (error) {
      console.error(error);
      toast.error(dislikedByUser ? '싫어요 취소 중 문제가 발생했습니다.' : '싫어요 처리 중 문제가 발생했습니다.');
    }
  };  

  if (!course) return <div>로딩 중...</div>;

  return (
    <div className="detail-page">
      <header className="header-section">
        <h2>{course.title}</h2>
        <p>강사: {course.teacher}</p>
        <img src={course.thumbnail_image} alt="강의 썸네일" />
      </header>
      <section className="review-section">
        <button onClick={() => setShowReviewModal(true)} className="btn btn-primary">리뷰 작성</button>
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="latest">최신순</option>
          <option value="likes">좋아요순</option>
        </select>
        {reviews.map((review) => (
          <div key={review.id} className="review-item">
            <p>{review.nickName}</p>
            <p>{review.contents}</p>
            <p>{review.rating}점</p>
            <button onClick={() => handleLikeToggle(review.id, review.likedByUser)}>
                <FaThumbsUp color={review.likedByUser ? 'red' : 'black'} /> {review.likes}
            </button>
            <button onClick={() => handleDislikeToggle(review.id, review.dislikedByUser)}>
                <FaThumbsDown color={review.dislikedByUser ? 'blue' : 'black'} /> {review.dislikes}
            </button>
          </div>
        ))}
      </section>
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        onSubmit={handleSubmit}
        onChange={(e) => setNewReview((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
        ratingChanged={(rating) => setNewReview((prev) => ({ ...prev, rating }))}
        newReview={newReview}
      />
    </div>
  );
};

export default Detail;
