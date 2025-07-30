import React, { useState, useEffect } from "react";
import "../../../assert/adminpage.css";
import axios from "axios";
import Main from '../../section/main.jsx';

import { admin_category } from "../../../data/review.js";

const AdminPage = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [subCategory, setSubCategory] = useState("pending");
  const [reviews, setReviews] = useState([]);
  const [expandedReview, setExpandedReview] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentReviewId, setCurrentReviewId] = useState(null);

  axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
  const correctPassword = process.env.REACT_APP_ADMIN_PASSWORD;

  useEffect(() => {
    if (isAuthorized) {
      fetchReviews();
    }
  }, [subCategory, isAuthorized]);


  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`/admin/reviews?status=${subCategory}`);
      setReviews(data);
    } catch (error) {
      alert("리뷰를 불러오는 데 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleExpandReview = (id) => {
    if (reviews.length > 0) {
      setExpandedReview(expandedReview === id ? null : id);
    }
  };

  const handleReviewAction = async (reviewId, action) => {
    if (!reviewId) {
      alert("리뷰 ID가 유효하지 않습니다. 다시 시도해주세요.");
      return;
    }

    const url = `/admin/reviews/${reviewId}/${action}`;
    const payload =
      action === "reject" ? { rejectionReason: rejectReason } : {};

    try {
      await axios.patch(url, payload);
      alert(
        action === "approve"
          ? "리뷰가 승인되었습니다!" : "리뷰가 거절되었습니다!",
      );
      fetchReviews();
      closeModal();
      setExpandedReview(null);
    } catch (error) {
      alert("요청을 처리하는 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const handlePasswordSubmit = () => {
    if (password === correctPassword) {
      setIsAuthorized(true);
    } else {
      alert("잘못된 암호입니다!");
    }
  };

  const closeModal = () => {
    setRejectReason("");
    setShowModal(false);
  };

  if (!isAuthorized) {
    return (
      <Main>
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h2>관리자 페이지</h2>
          <p>접근하려면 암호를 입력하세요.</p>
          <input
            type="password"
            placeholder="암호 입력"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: "10px", fontSize: "16px" }}
          />
          <button
            onClick={handlePasswordSubmit}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              marginLeft: "10px",
              cursor: "pointer",
            }}
          >
            확인
          </button>
        </div>
      </Main>
    );
  }

  return (
    <Main >
      <div className="admin-page">
        <div className="category-tabs">
          <button
            className="active"
          >
            Pending Reviews
          </button>
        </div>

        <div className="sub-category-tabs">
          {admin_category.map((category) => (
            <button
              className={subCategory === category.key ? "active" : ""}
              onClick={() => setSubCategory(category.key)}
            >
              {category.title}
            </button>
          ))}
        </div>

        <div className="review-list">
          {reviews.map((review) => (
            <div
              key={review.reviewId}
              className={`review-item ${expandedReview === review.reviewId ? "expanded" : ""
                }`}
              onClick={() => handleExpandReview(review.reviewId)}
            >
              <div className="review-header">
                <div className="review-left">
                  {
                    review.courseThumbnailImage ? (
                      <img src={review.courseThumbnailImage} alt="Course Thumbnail" className="course-thumbnail" />
                    ) : review.courseThumbnailVideo ? (
                      <video muted autoPlay loop >
                        <source src={review.courseThumbnailVideo} type="video/mp4" alt="Course Thumbnail" className="course-thumbnail" />
                      </video>
                    ) : (
                      <img src='/img/nothing.png' alt="Course Thumbnail" className="course-thumbnail" />
                    )
                  }
                  <div className="review-information">
                    <p>
                      <strong>{review.courseTitle}</strong>
                    </p>
                    <a href={review.courseUrl} target="_blank">강의 보러가기</a>
                    <p>{review.updatedAt}</p>
                  </div>
                </div>

                {expandedReview === review.reviewId && (
                  <div className="review-actions">
                    <button
                      className="accept-btn"
                      onClick={() =>
                        handleReviewAction(review.reviewId, "approve")
                      }
                    >
                      Accept
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => {
                        setRejectReason("");
                        setCurrentReviewId(review.reviewId);
                        setShowModal(true);
                      }}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>

              {expandedReview === review.reviewId && (
                <div className="review-expanded">
                  <p>{review.reviewContents}</p>
                  <iframe
                    src={review.reviewCertification}
                    title="Review Certification"
                    className="review-certification"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>거절 사유를 선택하세요</h3>
              <ul>
                <li>
                  <label>
                    <span>강의 리뷰 내용이 적절하지 않아요.</span>
                    <input
                      type="radio"
                      name="reason"
                      value="강의 리뷰 내용이 적절하지 않아요."
                      onChange={(e) => setRejectReason(e.target.value)}
                    />
                  </label>
                </li>
                <li>
                  <label>
                    <span>인증 파일 양식이 올바르지 않아요.</span>
                    <input
                      type="radio"
                      name="reason"
                      value="인증 파일 양식이 올바르지 않아요."
                      onChange={(e) => setRejectReason(e.target.value)}
                    />
                  </label>
                </li>
                <li>
                  <label>
                    <span>직접 입력:</span>
                    <input
                      type="text"
                      placeholder="사유를 입력하세요"
                      onChange={(e) => setRejectReason(e.target.value)}
                    />
                  </label>
                </li>
              </ul>
              <button
                onClick={() => {
                  console.log(
                    "Submitting Reject for Review ID:",
                    currentReviewId,
                  );
                  handleReviewAction(currentReviewId, "reject");
                }}
              >
                예
              </button>
              <button onClick={closeModal}>취소</button>
            </div>
          </div>
        )}
      </div>
    </Main>
  );
};

export default AdminPage;
