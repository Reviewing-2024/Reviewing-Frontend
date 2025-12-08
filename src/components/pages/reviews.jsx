import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Main from '../section/main';

import { FiLoader } from "react-icons/fi";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import StarRatingInput from '../component/reviews/StarRatingInput'

import "../../assert/detailpage.css";
import ReviewCard from "../component/reviews/ReviewCard";
import DeleteCard from "../component/reviews/DeleteCard";

const Reviews = () => {
  const { slug } = useParams();
  const [course, setCourse] = useState();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({});
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [likedloading, setLikedloading] = useState(false);
  const [dislikedloading, setDislikedloading] = useState(false);
  const [reviewloading, setReviewloadinging] = useState(false);
  const [wishLoading, setWishLoading] = useState(false);
  const [checkingReviewPermission, setCheckingReviewPermission] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const token = localStorage.getItem("Authorization");
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isUserLoggedIn = () => {
    if (!token || token.trim() === "") {
      alert("로그인이 필요합니다.");
      return false;
    }
    return true;
  };


  const fetchCourse = useCallback(async () => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/course`, {
        params: { courseSlug: slug },
        headers
      }
      );

      if (response.data) {
        setCourse(response.data);
      }
    } catch (error) {
      console.error("강의 정보 조회 오류:", error);
      if (error.response?.status === 600) {
        alert("로그인이 만료되었습니다. 다시 로그인해 주세요.");
        localStorage.removeItem('name');
        localStorage.removeItem('Authorization');
        window.location.reload();
      } else {
        alert("강의 정보를 불러오는 중 문제가 발생했습니다.");
      }
    }
  }, [slug]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);


  useEffect(() => {
    const fetchReviews = async () => {
      try {
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

    if (course?.id) fetchReviews();
  }, [course?.id]);


  const handleCreateReview = async () => {
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (likedloading) return;

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
          case 600:
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
    if (wishLoading) return;

    setWishLoading(true);

    try {
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
    }
  };

  const handleView = () => {
    window.open(course?.url, "_blank");
  };

  const handleLike = async (reviewId, liked) => {
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (likedloading) return;

    setLikedloading(true);
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
      setLikedloading(false);
    }
  };

  const handleDislike = async (reviewId, disliked) => {
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (dislikedloading) return;

    setDislikedloading(true);
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
      setDislikedloading(false);
    }
  };

  const handleDeleteRequest = (review) => {
        setSelectedReview(review);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            if (!token) {
            alert('로그인이 필요합니다.');
            return;
            }

            await axios.delete(`${process.env.REACT_APP_BASE_URL}/reviews/${selectedReview.id}`, {
            headers: { Authorization: `Bearer ${token}` }
            });

            setReviews(prev => prev.filter(r => r.id !== selectedReview.id));
            setShowDeleteModal(false);
            setSelectedReview(null);
            alert('리뷰가 삭제되었습니다.');
        } catch (error) {
            console.error('리뷰 삭제 실패:', error);
            alert('리뷰 삭제 중 문제가 발생했습니다.');
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setSelectedReview(null);
    };

  if (!course) {
    return <div><FiLoader color="#004FDE" size={12} /></div>;
  }


  return (
    <Main
      title="상세페이지"
      description="추천 강의입니다.">
      <div className="detail-page">
        <div className="header-div">
          <header className="header-section">
            <div className="course-thumbnail">
              {course?.thumbnailImage ? (
                <img src={course.thumbnailImage} alt={course.title} />
              ) : course?.thumbnailVideo ? (
                <video muted autoPlay loop>
                  <source src={course.thumbnailVideo} type="video/mp4" alt={course.title} />
                </video>
              ) : (
                <img src='/img/nothing.png' alt={course.title} />
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
                    border: "1px solid #004FDE",
                    borderRadius: "5px",
                    padding: "10px",
                    cursor: wishLoading ? "not-allowed" : "pointer",
                    opacity: wishLoading ? 0.7 : 1
                  }}
                  onClick={() => handleWish(course?.id)}
                  disabled={wishLoading}
                >
                  {wishLoading ? (
                    <FiLoader color="#004FDE" size={12} />
                  ) : course?.wished ? (
                    <FaHeart color="#004FDE" size={12} />
                  ) : (
                    <FaRegHeart color="#004FDE" size={12} />
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
                <><FiLoader className="spinner" /></>
              ) : (
                "리뷰 작성"
              )}
            </button>
          </div>
          <div className="review-list">
            {reviews.length === 0 ? (
              <div className="no-items">
                <p>아직 작성된 리뷰가 없습니다.<br></br> 첫 번째 리뷰를 작성해주세요!</p>
              </div>
            ) : (
              reviews.map((review) => (
                <ReviewCard key={review.id} review={review} handleLike={handleLike} likedloading={likedloading}
                            handleDislike={handleDislike} dislikedloading={dislikedloading} myReview={review.myReview}
                            onDeleteRequest={handleDeleteRequest}
                />
              ))
            )}
            {showDeleteModal && selectedReview && (
              <DeleteCard
                onCancel={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                review={selectedReview}
              />
            )}
          </div>
        </section>
        {showReviewModal && (
          <div className="review-modal">
            <div className="review-modal-content">
              <div className="modal-input-group">
                <label htmlFor="rating">평점:</label>
                <StarRatingInput
                  value={newReview.rating || 0}
                  onChange={(val) => setNewReview((prev) => ({ ...prev, rating: val }))}
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
              <p className="reviews-acomment">강의 수강을 증명할 수 있는 자료를 첨부해주세요. </p>
              <p> (예: 강의 수강 화면 캡처, 수강 증명서 등)</p>
              <p> 무관한 내용이나 부적절한 파일을 첨부할 경우 승인이 거절될 수 있습니다.</p>
              <p> 첨부하신 자료는 리뷰 승인 목적으로만 사용되며, 안전하게 보호됩니다.</p>
              <p> 리뷰와 관련 없는 개인정보나 민감한 정보를 포함하지 않도록 주의해주세요.</p>
              <div className="review-modal-buttons">
                <button
                  className="btn-cancel"
                  onClick={() => setShowReviewModal(false)}
                >
                  취소
                </button>
                <button className="btn-submit" onClick={handleCreateReview}>
                  {reviewloading ? <FiLoader /> : '리뷰 제출'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Main>
  );
};

export default Reviews;
