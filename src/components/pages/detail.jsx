/*

import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';

const Detail = () => {
  const { courseId } = useParams();
  const location = useLocation();
  const { item } = location.state || {};
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: '', comment: '', certificationFile: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const accessToken = localStorage.getItem('accessToken');


  useEffect(() => {
    if (!accessToken) {
      alert('로그인이 필요합니다. 로그인 후 다시 시도해주세요.');
      return;
    }

    if (courseId) {
      console.log('Access Token:', accessToken);
      console.log('courseId:', courseId);
      fetchReviews();
      console.log('Authorization Header:', `Bearer ${accessToken}`);
      console.log('Request URL:', `http://localhost:8080/reviews/${courseId}`);

    }
  }, [courseId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/reviews/${courseId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setReviews(response.data);
    } catch (e) {
      setError(e);
      console.error('리뷰 가져오기 오류:', e.response);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!accessToken) {
      alert('로그인이 필요합니다. 로그인 후 다시 시도해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('rating', newReview.rating);
    formData.append('comment', newReview.comment);
    if (newReview.certificationFile) {
      formData.append('certificationFile', newReview.certificationFile);
    }

    try {
      const response = await axios.post(`http://localhost:8080/reviews/${courseId}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('리뷰가 성공적으로 작성되었습니다!');
      fetchReviews();
      setNewReview({ rating: '', comment: '', certificationFile: null });
    } catch (error) {
      console.error('리뷰 작성 오류:', error.response);
      alert('리뷰 작성 중 문제가 발생했습니다.');
    }
  };

  return (
    <div>
      <h2>{item?.title || '강의 상세 페이지'}</h2>
      <form onSubmit={handleReviewSubmit}>
        <h3>리뷰 작성</h3>
        <label>
          별점:
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={newReview.rating}
            onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
          />
        </label>
        <label>
          코멘트:
          <textarea
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
          />
        </label>
        <label>
          인증 파일:
          <input
            type="file"
            onChange={(e) => setNewReview({ ...newReview, certificationFile: e.target.files[0] })}
          />
        </label>
        <button type="submit">리뷰 작성</button>
      </form>
    </div>
  );
};

export default Detail;

*/