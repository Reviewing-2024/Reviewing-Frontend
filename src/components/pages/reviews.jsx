import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useParams } from "react-router-dom";
import { FaThumbsDown, FaThumbsUp, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { FiLoader } from "react-icons/fi";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import "../../assert/detailpage.css";
import axios from "axios";

const Reviews = () => {
  const { slug } = useParams();
  const location = useLocation();
  const { item } = location.state || {};
  const [course, setCourse] = useState(item || null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({});
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aloading, setAloading] = useState(false);
  const [reviewloading, setReviewloadinging] = useState(false);
  const [wishLoading, setWishLoading] = useState(false);
  const [wishRequestInProgress, setWishRequestInProgress] = useState(false);
  const [checkingReviewPermission, setCheckingReviewPermission] = useState(false);



  useEffect(() => {
    window.scrollTo(0, 0);
}, []);

  const isUserLoggedIn = () => {
    const token = localStorage.getItem("Authorization");
    if (!token || token.trim() === "") {
      alert("로그인이 필요합니다.");
      return false;
    }
    return true;
  };

  
  const fetchCourse = useCallback(async () => {

    const token = localStorage.getItem("Authorization");
     const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/courses/${slug}`,
        { headers }
      );
      setCourse(response.data);
    } catch (error) {
      console.error("강의 정보 조회 오류:", error);
      if (error.response?.status === 600) {
        alert("로그인이 만료되었습니다. 다시 로그인해 주세요.");
      } else {
        alert("강의 정보를 불러오는 중 문제가 발생했습니다.");
      }
    }
  }, [slug]);
  
  useEffect(() => {
    if (!course && slug) fetchCourse();
  }, [course, fetchCourse, slug]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem("Authorization");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
  
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/reviews/${course.id}`,
          { headers }
        );
  
        const updatedReviews = response.data.map((review) => ({
          ...review,
          liked: review.liked ?? false,
          disliked: review.disliked ?? false,
        }));
        setReviews(updatedReviews);
      } catch (error) {
        alert("리뷰를 불러오는 중 문제가 발생했습니다.");
      }
    };
  
    if (course && course.id) fetchReviews();
  }, [course]);

 
  const handleCreateReview = async () => {
    const token = localStorage.getItem("Authorization");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (loading) return;
  
    setReviewloadinging(true);


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
        `${process.env.REACT_APP_BASE_URL}/reviews/${course.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setReviewloadinging(false);
      setShowReviewModal(false);
      setNewReview({});
      setReviews((prev) => [...prev, response.data]);
      window.location.reload();
      alert(`소중한 리뷰를 작성해 주셔서 감사합니다! ☺️\n작성하신 리뷰는 관리자가 신속히 검토하겠습니다!\n진행 상황은 마이페이지에서 확인하실 수 있습니다.`); 
    } catch (error) {
      let errorMessage = "리뷰 작성 중 문제가 발생했습니다.";

      if (error.response) {
          switch (error.status) {
              case 600 :
                localStorage.removeItem('name');
                localStorage.removeItem('Authorization');
                window.location.reload();
                alert("로그인 토큰이 만료되었습니다. 다시 로그인 해주세요!");
                break;
              case 601:
                  errorMessage += " 이미 검토 중인 리뷰입니다.";
                  break;
              case 602:
                  errorMessage += " 이미 작성된 리뷰입니다.";
                  break;
              case 605:
                  errorMessage += " 이미 존재하는 찜입니다.";
                  break;
              case 606:
                  errorMessage += " 존재하지 않는 찜입니다.";
                  break;
              case 607:
                  errorMessage += " 이미 존재하는 좋아요입니다.";
                  break;
              case 608:
                  errorMessage += " 존재하지 않는 좋아요입니다.";
                  break;
              case 609:
                  errorMessage += " 이미 존재하는 싫어요입니다.";
                  break;
              case 610:
                  errorMessage += " 존재하지 않는 싫어요입니다.";
                  break;
              case 615:
                  errorMessage += " 리뷰 파일 크기가 1MB를 초과했습니다.";
                  break;
              case 616:
                  errorMessage += " 리뷰 내용이 유효하지 않습니다. (별점 혹은 리뷰 내용을 채워주세요)";
                  break;
              case 617:
                  errorMessage += " 파일을 선택해주세요.";
                  break;
          }
      } 
  
      console.error(error.response?.data || error.message);
      alert(errorMessage);
  }
  };

  const checkReviewPermission = async () => {
    if (!isUserLoggedIn()) return false;
    
    setCheckingReviewPermission(true);
    try {
      const token = localStorage.getItem("Authorization");
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/reviews/check/${course.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.status === 200;
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 600:
            localStorage.removeItem('name');
            localStorage.removeItem('Authorization');
            window.location.reload();
            alert("로그인 토큰이 만료되었습니다. 다시 로그인 해주세요!");
          break;
          case 601:
            alert("작성해주신 리뷰를 검토중 입니다! 잠시만 기다려주세요.");
          break;  
          case 602:
            alert("이미 리뷰를 작성한 강의입니다!");
          break;  
        }
        console.error("리뷰 권한 확인 중 오류:", error.response);
      } else if (error.request) {
        alert("서버에서 응답이 없습니다. 잠시 후 다시 시도해주세요.");
      }
      return false;
    } finally {
      setCheckingReviewPermission(false);
    }
  };


  const handleReviewButtonClick = async () => {

    try {
      const canReview = await checkReviewPermission(course.id);
      if (canReview) {
        setShowReviewModal(true);
      }
    } catch (error) {
      console.error("리뷰 버튼 처리 중 오류:", error);
    }
  };


  const handleWish = async (courseId) => {
    if (!isUserLoggedIn()) return;
    if (wishLoading || wishRequestInProgress) return;

    setWishLoading(true);
    setWishRequestInProgress(true);
    
    try {
      const token = localStorage.getItem("Authorization");

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/courses/${courseId}/wish`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { wished: course.wished }
        }
      );

      setCourse(prevCourse => {
        if (prevCourse.wished === response.data.wished) {
          return prevCourse;
        }
        return {
          ...prevCourse,
          ...response.data
        };
      });

      const message = response.data.wished ? 
        "강의가 찜 목록에 추가되었습니다!" : 
        "강의가 찜 목록에서 제거되었습니다.";
      alert(message);
      
    } catch (error) {
      if (error.response?.status === 600) {
        localStorage.removeItem('name');
        localStorage.removeItem('Authorization');
        window.location.reload();
        alert("로그인 토큰이 만료되었습니다. 다시 로그인 해주세요!");
      }
      else {
        console.error("위시리스트 처리 중 오류:", error);
        alert("위시리스트 처리 중 문제가 발생했습니다.");
      }
      await fetchCourse();
    } finally {
      setWishLoading(false);
      setTimeout(() => {
        setWishRequestInProgress(false);
      }, 1000);
    }
  };

  const handleView = () => {
    window.open(course?.url, "_blank");
  };

  const handleLike = async (reviewId, liked) => {
    const token = localStorage.getItem("Authorization");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }
  
    if (loading) return;
  
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/reviews/${reviewId}/like`,
        null,
        {
          params: { liked },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      const updatedReview = response.data;
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId ? { ...review, ...updatedReview } : review
        )
      );
    } catch (error) {
      console.error("Error updating like status:", error);
      alert("좋아요 상태를 업데이트하는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleDislike = async (reviewId, disliked) => {
    const token = localStorage.getItem("Authorization");
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }
  
    if (aloading) return;
  
    setAloading(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/reviews/${reviewId}/dislike`,
        null,
        {
          params: { disliked },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      const updatedReview = response.data;
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId ? { ...review, ...updatedReview } : review
        )
      );
    } catch (error) {
      console.error("Error updating dislike status:", error);
      alert("싫어요 상태를 업데이트하는 중 오류가 발생했습니다.");
    } finally {
      setAloading(false);
    }
  };


  return (
    <div className="detail-page">
      <div className="header-div">
        <header className="header-section">
          <div className="course-thumbnail">
            {item?.thumbnailImage ? (
              <img src={item.thumbnailImage} alt={item.title} />
            ) : item?.thumbnailVideo ? (
              <video muted autoPlay loop>
                <source src={item.thumbnailVideo} type="video/mp4" alt={item.title} />
              </video>
            ) : (
              <img src='/img/nothing.png' alt={item.title} />
            )}
          </div>
          <div className="course-info">
            <h2 className="course-title">{course.title}</h2>
            <p className="instructor-name">{course.teacher || ""}</p>
            <div className="course-actions">
              <button
                className="btn btn-wish"
                style={{
                  backgroundColor: "#fff",
                  border: "1px solid #88BAF7",
                  borderRadius: "5px",
                  padding: "10px",
                  cursor: wishLoading ? "not-allowed" : "pointer",
                  opacity: wishLoading ? 0.7 : 1
                }}
                onClick={() => handleWish(course?.id)}
                disabled={wishLoading || wishRequestInProgress}
              >
                {wishLoading ? (
                  <FiLoader color="#88BAF7" size={12} />
                ) : course?.wished ? (
                  <FaHeart color="#88BAF7" size={12} />
                ) : (
                  <FaRegHeart color="#88BAF7" size={12} />
                )}
              </button>
              <button className="btn btn-view" onClick={handleView} disabled={!course?.url}>
                수강하러 가기
              </button>
            </div>
          </div>
        </header>
      </div>
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
            onClick={handleReviewButtonClick}
            disabled={checkingReviewPermission}
            style={{
              cursor: checkingReviewPermission ? 'not-allowed' : 'pointer',
              opacity: checkingReviewPermission ? 0.7 : 1,
            }}
          >
            {checkingReviewPermission ? (
              <><FiLoader className="spinner" /> 확인 중...</>
            ) : (
              "리뷰 작성"
            )}
          </button>
        </div>
        <div className="review-list">
          {reviews.slice().reverse().map((review) => (
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
                <button
                  className={`btn-icon ${review.liked ? "active" : ""}`}
                  onClick={() => handleLike(review.id, review.liked)}
                  disabled={loading}
                >
                  {loading ? <FiLoader /> : <><FaThumbsUp /> {review.likes}</>}
                </button>
                <button
                  className={`btn-icon ${review.disliked ? "aactive" : ""}`}
                  onClick={() => handleDislike(review.id, review.disliked)}
                  disabled={aloading}
                >
                  {aloading ? <FiLoader /> : <><FaThumbsDown /> {review.dislikes}</>}
                </button>
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
                placeholder="1 ~ 5"
                step="0.5"
                min="1"
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
                onBlur={() => {
                  if (!newReview.contents) {
                      alert('리뷰 내용을 입력해주세요.');
                  }
                }}
                placeholder={`강의를 통해 얻은 배움과 느낀 점을 공유해주세요!\n(장점, 개선점 등)\n\n무성의한 내용이나 비난/비방이나 광고성 글은 승인되지 \n않을 수 있습니다.\n\n여러분의 리뷰는 다른 학습자들에게 소중한 선택 기준이 \n됩니다! 😊`}
              />
            </div>
            <div className="modal-input-group">
              <label htmlFor="file">파일 선택:</label>
              <input
                type="file"
                id="file"
                accept="image/*,application/pdf"
                onChange={(e) =>
                  setNewReview({ ...newReview, file: e.target.files[0] })
                }
              />
            </div>
            <p>강의 수강을 증명할 수 있는 자료를 첨부해주세요. </p>
            <p> (예: 강의 수강 화면 캡처, 수강 증명서 등)</p>
            <p> 무관한 내용이나 부적절한 파일을 첨부할 경우 승인이 거절될 수 있습니다.</p>
            <p> 첨부하신 자료는 리뷰 승인 목적으로만 사용되며, 안전하게 보호됩니다.</p>
            <p> 리뷰와 관련 없는 개인정보나 민감한 정보를 포함하지 않도록 주의해주세요.</p>
            <div className="review-modal-buttons">
              <button className="btn-submit" onClick={handleCreateReview}>
                {reviewloading ? <FiLoader /> : '리뷰 제출'}
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
