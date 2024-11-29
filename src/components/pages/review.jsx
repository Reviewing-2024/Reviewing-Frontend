import React, { useState } from 'react';
import StarRatingComponent from 'react-rating-stars-component';
import '../../assert/review.css';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { items } from '../../data/data';

const Review = () => {
  const [newReview, setNewReview] = useState({ rating: 5, content: '', attachment: null, courseTitle: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCourses, setFilteredCourses] = useState([]);


  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      const filtered = items.filter(item => item.title.toLowerCase().includes(query.toLowerCase()));
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses([]);
    }
  };


  const handleCourseSelect = (courseTitle) => {
    setNewReview((prev) => ({ ...prev, courseTitle }));
    setSearchQuery(courseTitle); 
    setFilteredCourses([]); 
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newReview.content || !newReview.courseTitle) {
      toast.error("강의 제목과 리뷰 내용을 작성해주세요.");
      return;
    }
    toast.success("리뷰가 성공적으로 저장되었습니다!");
    setNewReview({ rating: 5, content: '', attachment: null, courseTitle: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewReview((prev) => ({ ...prev, attachment: file }));
  };

  const ratingChanged = (newRating) => setNewReview((prev) => ({ ...prev, rating: newRating }));

  return (
    <div className="write-review-page">
      <header className="review-header">
        <h1>리뷰를 작성해주세요</h1>
      </header>

      <main className="review-form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="courseSearch">강의 제목</label>
            <input
              type="text"
              id="courseSearch"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="강의 제목을 입력하세요."
              className="form-control"
            />
            {filteredCourses.length > 0 && (
              <ul className="course-dropdown">
                {filteredCourses.map((course) => (
                  <li
                    key={course.id}
                    onClick={() => handleCourseSelect(course.title)}
                    className="course-item"
                  >
                    {course.title}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="rating">평점</label>
            <StarRatingComponent
              count={5}
              onChange={ratingChanged}
              size={24}
              isHalf={true}
              value={newReview.rating}
              activeColor="#ffd700"
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">리뷰 내용</label>
            <textarea
              id="content"
              name="content"
              rows="4"
              value={newReview.content}
              onChange={handleChange}
              placeholder="리뷰 내용을 작성해주세요."
              className="form-control"
            ></textarea>
          </div>

          <div className="form-group">
            <label htmlFor="attachment">첨부 파일</label>
            <input
              type="file"
              id="attachment"
              name="attachment"
              onChange={handleFileChange}
              className="form-control"
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">게시하기</button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Review;
