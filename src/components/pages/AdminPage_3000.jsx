import React, { useState } from "react";
import "../../assert/adminpage.css";
import axios from 'axios';


const mockPendingReviews = [
  {
    id: 1,
    user: "User A",
    profileImg: "https://via.placeholder.com/50",
    lecture: "강의 제목 1",
    content: "It was good!",
    reviewImg: "https://via.placeholder.com/300x200",
  },
  {
    id: 2,
    user: "User B",
    profileImg: "https://via.placeholder.com/50",
    lecture: "강의 제목 2",
    content: "Not as expected.",
    reviewImg: "https://via.placeholder.com/300x200",
  },
];

const AdminPage = () => {
  const [activeCategory, setActiveCategory] = useState("pending"); 
  const [subCategory, setSubCategory] = useState("requests"); 
  const [expandedReview, setExpandedReview] = useState(null); 
  const [rejectReason, setRejectReason] = useState(""); 
  const [showModal, setShowModal] = useState(false); 

  const handleExpandReview = (id) => {
    setExpandedReview(expandedReview === id ? null : id);
  };

  const handleReject = () => {
    setShowModal(false);
    alert(`거절 사유: ${rejectReason}`);
    setExpandedReview(null);
    setRejectReason("");
  };

  return (
    <div className="admin-page">
      <div className="category-tabs">
        <button
          className={activeCategory === "pending" ? "active" : ""}
          onClick={() => setActiveCategory("pending")}
        >
          Pending Reviews
        </button>
        <button
          className={activeCategory === "reported" ? "active" : ""}
          onClick={() => setActiveCategory("reported")}
        >
          Reported Reviews
        </button>
      </div>

      {activeCategory === "pending" && (
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
      )}

      {subCategory === "requests" && (
        <div className="review-list">
          {mockPendingReviews.map((review) => (
            <div
              key={review.id}
              className={`review-item ${
                expandedReview === review.id ? "expanded" : ""
              }`}
              onClick={() => handleExpandReview(review.id)}
            >
              <div className="review-header">
                <div className="review-left">
                  <img src={review.profileImg} alt="Profile" />
                  <div>
                    <p><strong>{review.user}</strong></p>
                    <p>{review.lecture}</p>
                  </div>
                </div>

              
                {expandedReview === review.id && (
                  <div className="review-actions">
                    <button
                      className="accept-btn"
                      onClick={() => alert("Accepted!")}
                    >
                      Accept
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => setShowModal(true)}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>

              {expandedReview === review.id && (
                <div className="review-expanded">
                  <p>{review.content}</p>
                  <img src={review.reviewImg} alt="Review" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}


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
                  <span>인증 파일의 내용이 보이지 않아요.</span>
                  <input
                    type="radio"
                    name="reason"
                    value="인증 파일의 내용이 보이지 않아요."
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
            <button onClick={() => handleReject()}>예</button>
            <button onClick={() => setShowModal(false)}>취소</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
