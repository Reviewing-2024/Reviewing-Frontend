import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import StarRatingComponent from "react-rating-stars-component";
import { FaThumbsDown, FaThumbsUp, FaCartPlus } from "react-icons/fa";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { MdScreenSearchDesktop } from "react-icons/md";
import "../../assert/detailpage.css";
import axios from "axios";

const Reviews = () => {
  const { slug } = useParams();
  const location = useLocation();
  const { item } = location.state || {};
  const [course, setCourse] = useState(item || null);
  const [reviews, setReviews] = useState([]);
  const [sortOption, setSortOption] = useState("latest");
  const [likedReviews, setLikedReviews] = useState({});
  const [dislikedReviews, setDislikedReviews] = useState({});
  const [newReview, setNewReview] = useState({
    rating: 0,
    contents: "",
    file: null,
  });
  const [showReviewModal, setShowReviewModal] = useState(false);

  const isUserLoggedIn = () => {
    const token = localStorage.getItem("Authorization");
    console.log("저장된 토큰:", token);
    if (!token || token.trim() === "") {
      alert("로그인을 하셔야 해당 기능을 사용할 수 있습니다!");
      return false;
    }
    return true;
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/courses/${slug}`,
        );
        setCourse(response.data);
      } catch (error) {
        console.error(error);
        alert("강의 정보를 불러오는 중 문제가 발생했습니다.");
      }
    };

    if (!course) fetchCourse();
  }, [slug, course]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/reviews/${course.id}`,
        );
        const updatedReviews = response.data.map((review) => ({
          ...review,
          liked: review.liked ?? false,
          disliked: review.disliked ?? false,
        }));
        setReviews(updatedReviews);
      } catch (error) {
        console.error(error);
        alert("리뷰를 불러오는 중 문제가 발생했습니다.");
      }
    };

    fetchReviews();
  }, [course.id]);

  const handleCreateReview = async () => {
    console.log("리뷰 상태 확인:", newReview);
    const token = localStorage.getItem("Authorization");
    if (!token) {
      alert("로그인을 하셔야 해당 기능을 사용할 수 있습니다!");
      return;
    }

    if (!course || !course.id) {
      alert("강의 정보가 없습니다. 다시 시도해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append(
      "reviewRequestDto",
      new Blob(
        [
          JSON.stringify({
            rating: newReview.rating,
            contents: newReview.contents,
          }),
        ],
        { type: "application/json" },
      ),
    );
    if (newReview.file) {
      formData.append("certificationFile", newReview.file);
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/reviews/${course.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `${token}`,
          },
        },
      );

      console.log("리뷰 작성 성공:", response.data);
      alert("리뷰가 작성되었습니다!");
      setReviews((prev) => [...prev, response.data]);
      setShowReviewModal(false);
      setNewReview({ rating: 0, contents: "", file: null });
    } catch (error) {
      console.error("리뷰 작성 에러:", error.response?.data || error.message);
      alert(
        "리뷰 작성 중 문제가 발생했습니다: " +
          (error.response?.data?.message || error.message),
      );
    }
  };

  const handleCart = () => {
    if (!isUserLoggedIn()) return;
    alert("강의가 찜 목록에 추가되었습니다!");
  };

  const handleWish = async (courseId) => {
    const token = localStorage.getItem("Authorization");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      console.log("보낼 wished 상태: false");

      const response = await axios.post(
        `http://localhost:8080/courses/${courseId}/wish`,
        null,
        {
          params: { wished: false },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log("서버 응답:", response.data);

      setCourse((prevCourse) => {
        if (prevCourse && prevCourse.id === courseId) {
          return {
            ...prevCourse,
            wished: response.data.wished,
          };
        }
        return prevCourse;
      });
    } catch (error) {
      console.error(
        "찜하기 처리 중 오류:",
        error.response?.data || error.message,
      );
      alert(
        `찜하기 처리 중 오류가 발생했습니다: ${
          error.response?.data?.message || error.message
        }`,
      );
    }
  };


  const handleView = () => {
    window.open(course.url, "_blank");
  };

  const handleLike = async (reviewId, liked) => {
    const token = localStorage.getItem("Authorization");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/reviews/${reviewId}/like`,
        null,
        {
          params: { liked },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const updatedReview = response.data;
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId ? { ...review, ...updatedReview } : review,
        ),
      );
    } catch (error) {
      console.error("Error updating like status:", error);
      alert("좋아요 상태를 업데이트하는 중 오류가 발생했습니다.");
    }
  };

  const handleDislike = async (reviewId, disliked) => {
    const token = localStorage.getItem("Authorization");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8080/reviews/${reviewId}/dislike`,
        null,
        {
          params: { disliked },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const updatedReview = response.data;
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId ? { ...review, ...updatedReview } : review,
        ),
      );
    } catch (error) {
      console.error("Error updating dislike status:", error);
      alert("싫어요 상태를 업데이트하는 중 오류가 발생했습니다.");
    }
  };

  if (!course) return <div>로딩 중...</div>;

  return (
    <div className="detail-page">
      <header className="header-section">
        <div className="course-thumbnail">
          <img
            src={course.thumbnailImage || "/img/nothing.png"}
            alt="강의 썸네일"
            className="course-image"
          />
        </div>
        <div className="course-info">
          <h2 className="course-title">{course.title}</h2>
          <p className="instructor-name">
            {course.teacher || "강사 없음"} 강사
          </p>
          <div className="course-actions">
          <button
              className="btn btn-wish"
              style={{
                backgroundColor: course.wished ? "#fff" : "#fff",
                border: "1px solid #ffd700",
                borderRadius: "5px",
                padding: "10px",
                cursor: "pointer",
              }}
              onClick={() => handleWish(course.id)}
            >
              {course.wished ? (
                <FaStar color="#ffd700" size={12} />
              ) : (
                <FaRegStar color="#ffd700" size={12} />
              )}
            </button>

            <button className="btn btn-view" onClick={handleView}>
              <MdScreenSearchDesktop />
            </button>
          </div>
        </div>
      </header>
      <section className="review-section">
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "20px",
          }}
        >
          <button
            className="btn btn-primary"
            onClick={() => setShowReviewModal(true)}
          >
            리뷰 작성
          </button>
        </div>
        <div className="review-list">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
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
              <p className="review-content">{review.contents}</p>
              <div className="review-actions">
                <div className="review-actions">
                  <button
                    className={`btn-icon ${review.liked ? "active" : ""}`}
                    onClick={() => handleLike(review.id, review.liked)}
                  >
                    <FaThumbsUp /> 좋아요 {review.likes}
                  </button>
                  <button
                    className={`btn-icon ${review.disliked ? "active" : ""}`}
                    onClick={() => handleDislike(review.id, review.disliked)}
                  >
                    <FaThumbsDown /> 싫어요 {review.dislikes}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {showReviewModal && (
        <div className="review-modal">
          <div className="review-modal-content">
            <h3>리뷰 작성</h3>
            <div className="modal-input-group">
              <label htmlFor="rating">평점:</label>
              <input
                type="number"
                id="rating"
                value={newReview.rating}
                onChange={(e) => {
                  const value = Math.min(
                    5,
                    Math.max(0, parseFloat(e.target.value) || 0),
                  );
                  setNewReview((prev) => ({ ...prev, rating: value }));
                }}
                placeholder="0 ~ 5"
                step="0.5"
                min="0"
                max="5"
              />
            </div>
            <div className="modal-input-group">
              <label htmlFor="contents">리뷰 내용:</label>
              <textarea
                id="contents"
                value={newReview.contents}
                onChange={(e) =>
                  setNewReview({ ...newReview, contents: e.target.value })
                }
                placeholder="리뷰 내용을 입력하세요."
              />
            </div>
            <div className="modal-input-group">
              <label htmlFor="file">파일 선택:</label>
              <input
                type="file"
                id="file"
                accept="image/*"
                onChange={(e) =>
                  setNewReview({ ...newReview, file: e.target.files[0] })
                }
              />
            </div>
            <div className="review-modal-buttons">
              <button className="btn-submit" onClick={handleCreateReview}>
                리뷰 제출
              </button>
              <button
                className="btn-cancel"
                onClick={() => setShowReviewModal(false)}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;