import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import StarRatingComponent from 'react-rating-stars-component';
import { FaThumbsDown, FaThumbsUp, FaCartPlus } from 'react-icons/fa';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { MdScreenSearchDesktop } from 'react-icons/md';
import '../../assert/detailpage.css';
import axios from 'axios';

const Reviews = () => {
  const { slug } = useParams();
  const location = useLocation();
  const { item } = location.state || {};
  const [course, setCourse] = useState(item || null);
  const [reviews, setReviews] = useState([]);
  const [sortOption, setSortOption] = useState('latest');
  const [likedReviews, setLikedReviews] = useState({});
  const [dislikedReviews, setDislikedReviews] = useState({});
  const [newReview, setNewReview] = useState({ rating: 0, comments: '', file: null });
  const [showReviewModal, setShowReviewModal] = useState(false);

  const isUserLoggedIn = () => {
    const token = localStorage.getItem('Authorization');
    console.log('저장된 토큰:', token); 
    if (!token || token.trim() === '') {
      alert('로그인을 하셔야 해당 기능을 사용할 수 있습니다!');
      return false;
    }
    return true;
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/courses/${slug}`);
        setCourse(response.data);
      } catch (error) {
        console.error(error);
        alert('강의 정보를 불러오는 중 문제가 발생했습니다.');
      }
    };

    if (!course) fetchCourse();
  }, [slug, course]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/reviews/${course.id}`);
        setReviews(response.data);
      } catch (error) {
        console.error(error);
        alert('리뷰를 불러오는 중 문제가 발생했습니다.');
      }
    };

    fetchReviews();
  }, [slug]);

  const handleCreateReview = async () => {
    // 수정된 토큰 가져오기
    const token = localStorage.getItem('Authorization');
    if (!token) {
      alert('로그인을 하셔야 해당 기능을 사용할 수 있습니다!');
      return;
    }
  
    if (!course || !course.id) {
      alert('강의 정보가 없습니다. 다시 시도해주세요.');
      return;
    }
  
    // FormData 생성
    const formData = new FormData();
  
    // reviewRequestDto를 JSON으로 추가
    const reviewRequestDto = {
      rating: newReview.rating, // 명세에 따른 필드 이름
      comment: newReview.comments, // 명세에 따른 필드 이름
    };
    formData.append('reviewRequestDto', new Blob([JSON.stringify(reviewRequestDto)], { type: 'application/json' }));
  
    // 파일 추가
    if (newReview.file) {
      formData.append('certificationFile', newReview.file);
    }
  
    try {
      // 요청 전송
      const response = await axios.post(
        `http://localhost:8080/reviews/${course.id}`,
        formData,
        {
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      console.log('리뷰 작성 성공:', response.data);
      alert('리뷰가 작성되었습니다!');
      setReviews((prev) => [...prev, response.data]); // 리뷰 목록 갱신
      setShowReviewModal(false); // 모달 닫기
      setNewReview({ rating: 0, comments: '', file: null }); // 입력값 초기화
    } catch (error) {
      console.error('리뷰 작성 에러:', error.response?.data || error.message);
      alert('리뷰 작성 중 문제가 발생했습니다: ' + (error.response?.data?.message || error.message));
    }
  };
  
  
  const handleCart = () => {
    if (!isUserLoggedIn()) return;
    alert('강의가 찜 목록에 추가되었습니다!');
  };

  const handleView = () => {
    window.open(course.url, '_blank');
  };

  const handleLikeDislike = async (reviewId, type, isLiked) => {
    if (!isUserLoggedIn()) return;

    const method = isLiked ? 'DELETE' : 'POST';
    try {
      await axios({
        method,
        url: `/reviews/${reviewId}/${type}`,
        headers: { Authorization: `Bearer ${localStorage.getItem('Token')}` },
      });

      setReviews((prev) =>
        prev.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                likes: type === 'like' ? review.likes + (isLiked ? -1 : 1) : review.likes,
                dislikes: type === 'dislike' ? review.dislikes + (isLiked ? -1 : 1) : review.dislikes,
                likedByUser: type === 'like' ? !isLiked : review.likedByUser,
                dislikedByUser: type === 'dislike' ? !isLiked : review.dislikedByUser,
              }
            : review
        )
      );
    } catch (error) {
      console.error(error);
      alert(`${type === 'like' ? '좋아요' : '싫어요'} 처리 중 문제가 발생했습니다.`);
    }
  };

  if (!course) return <div>로딩 중...</div>;

  return (
    <div className="detail-page">
      <header className="header-section">
        <div className="course-thumbnail">
          <img src={course.thumbnailImage || '/img/nothing.png'} alt="강의 썸네일" className="course-image" />
        </div>
        <div className="course-info">
          <h2 className="course-title">{course.title}</h2>
          <p className="instructor-name">{course.teacher || '강사 없음'} 강사</p>
          <div className="course-actions">
            <button className="btn btn-cart" onClick={handleCart}>
              <FaCartPlus />
            </button>
            <button className="btn btn-view" onClick={handleView}>
              <MdScreenSearchDesktop />
            </button>
          </div>
        </div>
      </header>
      <section className="review-section">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <button className="btn btn-primary" onClick={() => setShowReviewModal(true)}>
            리뷰 작성
          </button>
        </div>
        <div className="review-list">
          {reviews.map((review) => (
            <div key={review.id} className="review-item">
              <p>{review.nickname}</p>
              <p>{review.comments}</p>
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
          ))}
        </div>
      </section>

      {showReviewModal && (
        <div className="review-modal">
          <h3>리뷰 작성</h3>
          <textarea
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comments: e.target.value })}
            placeholder="리뷰 내용을 입력하세요."
          />
          <StarRatingComponent
            value={newReview.rating}
            onStarClick={(nextValue) => setNewReview({ ...newReview, rating: nextValue })}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewReview({ ...newReview, file: e.target.files[0] })}
          />
          <button onClick={handleCreateReview}>리뷰 제출</button>
          <button onClick={() => setShowReviewModal(false)}>취소</button>
        </div>
      )}
    </div>
  );
};

export default Reviews;
