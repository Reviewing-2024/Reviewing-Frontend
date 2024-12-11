import React, { useState, useEffect } from "react";
import "../../assert/adminpage.css";
import axios from "axios";

const AdminPage = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const correctPassword = "review1234##"; 

  const [activeCategory, setActiveCategory] = useState("pending");
  const [subCategory, setSubCategory] = useState("requests");
  const [reviews, setReviews] = useState([]);
  const [expandedReview, setExpandedReview] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentReviewId, setCurrentReviewId] = useState(null); 

  axios.defaults.baseURL = "http://localhost:8080";

  useEffect(() => {
    if (isAuthorized) {
      fetchReviews();
    }
  }, [subCategory, isAuthorized]);

  const fetchReviews = async () => {
    const statusMap = {
      requests: "pending",
      approved: "approved",
      rejected: "rejected",
    };
    const status = statusMap[subCategory] || "pending";

    try {
      const { data } = await axios.get(`/admin/reviews?status=${status}`);
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      alert("리뷰를 불러오는 데 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleExpandReview = (id) => {
    if (reviews.length > 0) {
      setExpandedReview(expandedReview === id ? null : id);
      console.log("Expanded Review ID:", id); 
    }
  };

  const closeModal = () => {
    setRejectReason("");
    setShowModal(false);
  };

  const handleReviewAction = async (reviewId, action) => {
    console.log("Action:", action);
    console.log("Review ID for Action:", reviewId); 


    if (!reviewId) {
      alert("리뷰 ID가 유효하지 않습니다. 다시 시도해주세요.");
      return;
    }

    const url = `/admin/reviews/${reviewId}/${action}`;
    const payload = action === "reject" ? { rejectionReason: rejectReason } : {};

    console.log("Payload:", payload); 

    try {
      await axios.patch(url, payload);
      alert(action === "approve" ? "리뷰가 승인되었습니다!" : "리뷰가 거절되었습니다!");
      fetchReviews(); 
      closeModal(); 
      setExpandedReview(null);
    } catch (error) {
      console.error(`Error ${action}ing review:`, error);
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

  if (!isAuthorized) {
    return (
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
    );
  }

  return (
    <div className="admin-page">
      <div className="category-tabs">
        <button
          className={activeCategory === "pending" ? "active" : ""}
          onClick={() => setActiveCategory("pending")}
        >
          Pending Reviews
        </button>
      </div>

      <div className="sub-category-tabs">
        <button
          className={subCategory === "requests" ? "active" : ""}
          onClick={() => setSubCategory("requests")}
        >
          승인 요청
        </button>
        <button
          className={subCategory === "approved" ? "active" : ""}
          onClick={() => setSubCategory("approved")}
        >
          승인 완료
        </button>
        <button
          className={subCategory === "rejected" ? "active" : ""}
          onClick={() => setSubCategory("rejected")}
        >
          승인 거절
        </button>
      </div>

      <div className="review-list">
        {reviews.map((review) => (
          <div
            key={review.reviewId}
            className={`review-item ${
              expandedReview === review.reviewId ? "expanded" : ""
            }`}
            onClick={() => handleExpandReview(review.reviewId)}
          >
            <div className="review-header">
              <div className="review-left">
                <img
                  src={review.courseThumbnailImage}
                  alt="Course Thumbnail"
                  className="course-thumbnail"
                />
                <div>
                  <p>
                    <strong>{review.courseTitle}</strong>
                  </p>
                  <p>{review.courseteacher}</p>
                </div>
              </div>

              {expandedReview === review.reviewId && (
                <div className="review-actions">
                  <button
                    className="accept-btn"
                    onClick={() => handleReviewAction(review.reviewId, "approve")}
                  >
                    Accept
                  </button>
                  <button
                    className="reject-btn"
                    onClick={() => {
                      console.log("Reject Button Clicked, Review ID:", review.reviewId);
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
                <img
                  src={review.reviewCertification}
                  alt="Review Certification"
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
                console.log("Submitting Reject for Review ID:", currentReviewId);
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
  );
};

export default AdminPage;
