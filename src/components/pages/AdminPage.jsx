import React, { useState, useEffect } from "react";
import "../../assert/adminpage.css";
import axios from 'axios';




const AdminPage = () => {
  const [currentTab, setCurrentTab] = useState("pending"); 
  const [selectedReview, setSelectedReview] = useState(null); 
  const [rejectReason, setRejectReason] = useState(""); 
  const [showModal, setShowModal] = useState(false); 
  const [reviews, setReviews] = useState([]); 


  useEffect(() => {
    setCurrentTab("pending");
  }, []);


  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/admin/reviews?status=${currentTab}`);
        if (!response.ok) throw new Error("리뷰 데이터를 불러오지 못했습니다.");
        const data = await response.json();
        setReviews(data);
      } catch (error) {
        console.error(error);
        alert("리뷰 데이터를 불러오는 중 문제가 발생했습니다.");
      }
    };
    if (currentTab) {
      fetchReviews();
    }
  }, [currentTab]);


  const toggleReviewDetails = (id) => {
    setSelectedReview(selectedReview === id ? null : id);
  };

  const approveReview = async (id) => {
    try {
      const response = await fetch(`/admin/reviews/${id}/approve`, {
        method: "PATCH",
      });
      if (!response.ok) throw new Error("리뷰 승인에 실패했습니다.");
      alert(`리뷰 ID: ${id}가 승인되었습니다.`);
      setReviews(reviews.filter((review) => review.id !== id));
      setSelectedReview(null);
    } catch (error) {
      console.error(error);
      alert("리뷰 승인 중 문제가 발생했습니다.");
    }
  };

  const rejectReview = async (id) => {
    try {
      const response = await fetch(`/admin/reviews/${id}/reject`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectReason }),
      });
      if (!response.ok) throw new Error("리뷰 거절에 실패했습니다.");
      alert(`리뷰 ID: ${id}가 거절되었습니다. 사유: ${rejectReason}`);
      setReviews(reviews.filter((review) => review.id !== id));
      setShowModal(false);
      setSelectedReview(null);
      setRejectReason("");
    } catch (error) {
      console.error(error);
      alert("리뷰 거절 중 문제가 발생했습니다.");
    }
  };


  const handleReasonChange = (e) => {
    if (rejectReason === e.target.value) {
      setRejectReason("");
    } else {
      setRejectReason(e.target.value);
    }
  };


  const handleCustomReason = (e) => {
    setRejectReason(e.target.value);
  };

  return (
    <div className="admin-page">
      {/* 상단 카테고리 탭 */}
      <div className="category-tabs">
        <button
          className={currentTab === "pending" ? "active" : ""}
          onClick={() => setCurrentTab("pending")}
        >
          승인 대기
        </button>
        <button
          className={currentTab === "approved" ? "active" : ""}
          onClick={() => setCurrentTab("approved")}
        >
          승인 완료
        </button>
        <button
          className={currentTab === "rejected" ? "active" : ""}
          onClick={() => setCurrentTab("rejected")}
        >
          승인 거절
        </button>
        <button
          className={currentTab === "reported" ? "active" : ""}
          onClick={() => setCurrentTab("reported")}
        >
          Reported Reviews
        </button>
      </div>

      {/* 리뷰 목록 */}
      <div className="review-list">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div
              key={review.id}
              className={`review-item ${
                selectedReview === review.id ? "expanded" : ""
              }`}
              onClick={() => toggleReviewDetails(review.id)}
            >
              <div className="review-header">
                <p><strong>리뷰 ID:</strong> {review.id}</p>
                <p><strong>강의 ID:</strong> {review.courseId}</p>
              </div>

              {selectedReview === review.id && (
                <div className="review-expanded">
                  <p><strong>내용:</strong> {review.contents}</p>
                  {review.certification && (
                    <img src={review.certification} alt="Certification" />
                  )}
                  <div className="review-actions">
                    <button
                      className="approve-btn"
                      onClick={() => approveReview(review.id)}
                    >
                      승인
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => setShowModal(true)}
                    >
                      거절
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>현재 표시할 리뷰가 없습니다.</p>
        )}
      </div>

      {/* 거절 사유 모달 */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>거절 사유를 입력하세요</h3>
            <ul>
              <li>
                <label>
                  <input
                    type="radio"
                    name="reason"
                    value="내용이 적절하지 않음"
                    checked={rejectReason === "내용이 적절하지 않음"}
                    onChange={handleReasonChange}
                  />
                  내용이 적절하지 않음
                </label>
              </li>
              <li>
                <label>
                  <input
                    type="radio"
                    name="reason"
                    value="인증 파일이 올바르지 않음"
                    checked={rejectReason === "인증 파일이 올바르지 않음"}
                    onChange={handleReasonChange}
                  />
                  인증 파일이 올바르지 않음
                </label>
              </li>
              <li>
                <label>
                  <input
                    type="radio"
                    name="reason"
                    value="인증 파일 내용이 확인되지 않음"
                    checked={rejectReason === "인증 파일 내용이 확인되지 않음"}
                    onChange={handleReasonChange}
                  />
                  인증 파일 내용이 확인되지 않음
                </label>
              </li>
              <li>
                <label>
                  <input
                    type="text"
                    placeholder="기타 사유 입력"
                    value={rejectReason}
                    onChange={handleCustomReason}
                  />
                </label>
              </li>
            </ul>
            <button onClick={() => rejectReview(selectedReview)}>확인</button>
            <button onClick={() => setShowModal(false)}>취소</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
