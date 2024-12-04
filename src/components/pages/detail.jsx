import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import StarRatingComponent from 'react-rating-stars-component';
import { FaThumbsDown, FaThumbsUp, FaCartPlus } from 'react-icons/fa';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { MdScreenSearchDesktop } from 'react-icons/md';
import '../../assert/detailpage.css';
import axios from 'axios';

const Detail = () => {
  const { slug } = useParams();
  const location = useLocation();
  const { item } = location.state || {};
  const [course, setCourse] = useState(item || null);
  const [reviews, setReviews] = useState([]);
  const [sortOption, setSortOption] = useState('latest');
  const [likedReviews, setLikedReviews] = useState({});
  const [dislikedReviews, setDislikedReviews] = useState({});

  const isUserLoggedIn = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인을 하셔야 해당 기능을 사용할 수 있습니다!');
      return false;
    }
    return true;
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(`/courses/${slug}`);
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
        const dummyReviews = [
          {
            id: 1,
            nickname: '유저1',
            contents: '정말 유익한 강의였습니다.',
            rating: 5,
            likes: 10,
            dislikes: 2,
            likedByUser: true,
            dislikedByUser: false,
          },
          {
            id: 2,
            nickname: '유저2',
            contents: '조금 아쉬웠지만 괜찮았어요.',
            rating: 4,
            likes: 5,
            dislikes: 1,
            likedByUser: false,
            dislikedByUser: true,
          },
        ];
        setReviews(dummyReviews);
      } catch (error) {
        console.error(error);
        alert('리뷰를 불러오는 중 문제가 발생했습니다.');
      }
    };

    fetchReviews();
  }, [slug]);

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
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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
<div className="course-rating">
  평점:{" "}
  <div className="course-rating-stars">
    {Array.from({ length: 5 }, (_, index) => {
      const starValue = index + 1;
      const starColor =
        course.rating >= starValue
          ? course.rating >= 4
            ? "#4caf50" 
            : course.rating >= 3
            ? "#ff9800" 
            : "#f44336" 
          : "#ddd"; 
      if (course.rating >= starValue) {
        return <FaStar key={index} color={starColor} />;
      } else if (course.rating >= starValue - 0.5) {
        return <FaStarHalfAlt key={index} color={starColor} />;
      } else {
        return <FaRegStar key={index} color={starColor} />;
      }
    })}
  </div>
</div>
        </div>
      </header>
      <section className="review-section">
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
          <button className="btn btn-primary" onClick={() => alert('로그인을 하셔야 해당 기능을 사용할 수 있습니다!')}>
            리뷰 작성
          </button>
        </div>
        <div className="review-list">
  {reviews.map((review) => (
    <div key={review.id} className="review-item">
      <p>{review.nickname}</p>
      <p>{review.contents}</p>
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
      <div className="review-likes">
        <button onClick={() => handleLikeDislike(review.id, 'like', review.likedByUser)}>
          <FaThumbsUp color={review.likedByUser ? '#88BAF7' : 'black'} /> {review.likes}
        </button>
        <button onClick={() => handleLikeDislike(review.id, 'dislike', review.dislikedByUser)}>
          <FaThumbsDown color={review.dislikedByUser ? '#88BAF7' : 'black'} /> {review.dislikes}
        </button>
      </div>
    </div>
  ))}
</div>
      </section>
    </div>
  );
};

export default Detail;
