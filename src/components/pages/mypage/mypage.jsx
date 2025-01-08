import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BsCircleFill } from "react-icons/bs";
import { FaThumbsDown, FaThumbsUp, FaExternalLinkAlt } from "react-icons/fa";
import { review_category } from '../../../data/review.js';
import Mypageheader from '../../section/mypageheader.jsx';
import '../../../assert/css/mypage.css';

const Mypage = () => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hoverIndex, setHoverIndex] = useState(null);
    const [courseDetails, setCourseDetails] = useState({});

    const token = localStorage.getItem('Authorization');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const matchedCategory = review_category.find(
            (category) => `/mypage${category.src}` === location.pathname
        );
        if (matchedCategory) {
            setSelectedCategory(matchedCategory.title);
        } else {
            const defaultCategory = review_category[0];
            navigate(`/mypage${defaultCategory.src}`, { replace: true });
        }
    }, [location, navigate]);

    const fetchReviews = useCallback(async () => {
        if (!token) {
            alert("로그인이 필요합니다.");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(
                `${process.env.REACT_APP_BASE_URL}/my/reviews`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            setReviews(response.data);
            

            response.data.forEach(review => {
                fetchCourseDetails(review.courseId);
            });

        } catch (err) {
            setError(err.response?.data?.message || '리뷰를 불러오는데 실패했습니다.');
            if (err.response?.status === 401) {
                alert("로그인이 필요합니다.");
            }
        } finally {
            setLoading(false);
        }
    }, [token, navigate]);

    const fetchCourseDetails = useCallback(async (courseId) => {
        if (courseDetails[courseId]) return;

        try {
            const response = await axios.get(
                `${process.env.REACT_APP_BASE_URL}/course/${courseId}`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            setCourseDetails(prev => ({
                ...prev,
                [courseId]: response.data
            }));
        } catch (err) {
            console.error(`코스 정보 로딩 실패 (ID: ${courseId}):`, err);
        }
    }, [token, courseDetails]);

    const handleCourseClick = useCallback((review) => {
        const courseDetail = courseDetails[review.courseId];
        if (courseDetail) {
            navigate(`/reviews/${review.courseId}`, {
                state: { 
                    item: {
                        ...courseDetail,
                        id: review.courseId
                    }
                }
            });
        }
    }, [courseDetails, navigate]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const handleCategoryClick = useCallback((category) => {
        setSelectedCategory(category.title);
    }, []);

    const ReviewCard = ({ review }) => {
        const courseDetail = courseDetails[review.courseId];
        
        return (
            <div className='review-card'>
                <div className="myreview-content">
                    <span 
                        className='myreview-title'
                        onClick={() => handleCourseClick(review)}
                        style={{ cursor: 'pointer' }}
                    >
                    {review.courseTitle} <FaExternalLinkAlt />
                    </span>
                    <span className={`status ${review.status.toLowerCase()}`}>
                        <BsCircleFill />
                    </span>
                    <p className='content'>{review.contents}</p>
                    <div className="review-metadata">
                        <span className='createdAt'>{review.createdAt}</span>
                        <span><FaThumbsUp /> {review.likes}</span>
                        <span><FaThumbsDown /> {review.dislikes}</span>
                        <span className="rating">
                            <svg width="18" height="19" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                <path fill="#FDCC0E" fillRule="evenodd" d="M8 1.3c.133 0 .263.037.375.108.113.07.203.17.262.29l1.778 3.637 3.978.583c.131.02.254.075.355.161.101.086.176.199.217.326.041.126.046.262.014.392-.031.13-.098.247-.193.34l-2.878 2.831.68 3.996c.022.131.007.267-.042.39-.05.124-.133.23-.24.31-.107.078-.234.125-.366.134-.132.01-.263-.018-.38-.08L8 12.831l-3.558 1.887c-.117.062-.248.09-.38.08-.132-.01-.259-.056-.365-.134-.107-.079-.19-.186-.24-.31-.05-.123-.065-.258-.043-.39l.68-3.997-2.88-2.83c-.094-.093-.161-.21-.193-.34-.032-.13-.027-.266.014-.393.04-.127.116-.24.217-.326.102-.086.225-.142.356-.16l3.978-.583 1.779-3.637c.059-.12.15-.22.262-.29.112-.07.242-.108.374-.108z" clipRule="evenodd" />
                            </svg>
                            {review.rating}
                        </span>
                    </div>
                    {review.status === "REJECTED" && (
                        <div className='rejected'>
                            거절 사유: {review.rejectionReason}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    if (error) {
        return (
            <div className="error-container">
                <p>에러가 발생했습니다.</p>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className='mypage'>
            <Mypageheader />
            <div className='review_category'>
                <ul>
                    {review_category.map((category, index) => (
                        <li
                            key={category.src}
                            onMouseEnter={() => setHoverIndex(index)}
                            onMouseLeave={() => setHoverIndex(null)}
                        >
                            <Link
                                to={`/mypage${category.src}`}
                                className={selectedCategory === category.title ? 'active' : ''}
                                style={{
                                    backgroundColor: hoverIndex === index || selectedCategory === category.title
                                        ? category.color
                                        : '#fdfdfd',
                                    border: `2px solid ${category.color}`
                                }}
                                onClick={() => handleCategoryClick(category)}
                            >
                                {category.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div className='review'>
                {!reviews.length ? (
                    <div className="no-reviews">표시할 리뷰가 없습니다.</div>
                ) : (
                    <div className='review-list'>
                        {reviews.map(review => (
                            <ReviewCard key={review.id} review={review} />
                        ))}
                    </div>
                )}
            </div>
            <div className='footer' />
        </div>
    );
};

export default Mypage;