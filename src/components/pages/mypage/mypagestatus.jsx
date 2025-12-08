import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';

import { GrDocumentMissing } from "react-icons/gr";
import { review_category } from '../../../data/review.js';

import Main from '../../section/main.jsx';
import Loading from '../../component/items/Loading.jsx'
import MypageCard from '../../component/items/MypageCard.jsx';
import Mypageheader from '../../section/mypageheader.jsx';
import ResponsiveMypageHeader from '../../section/ResponsiveMypageHeader.jsx';

import DeleteCard from '../../component/reviews/DeleteCard.jsx';

import '../../../assert/css/mypage.css';

const Mypagestatus = () => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingfinish, setLoadingFinished] = useState(false);
    const [error, setError] = useState(null);
    const [hoverIndex, setHoverIndex] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);

    const { status } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const token = localStorage.getItem('Authorization');

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

            const url = status === 'all'
                ? `${process.env.REACT_APP_BASE_URL}/my/reviews`
                : `${process.env.REACT_APP_BASE_URL}/my/reviews?status=${status}`;

            const response = await axios.get(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setReviews(response.data);

        } catch (err) {
            if (err.response?.status === 600) {
                localStorage.removeItem('name');
                localStorage.removeItem('Authorization');
                navigate('/');
                window.location.reload();
                alert("로그인 토큰이 만료되었습니다. 다시 로그인 해주세요!");
            }
            setError(err.response?.data?.message || '리뷰를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
            setLoadingFinished(true);
        }
    }, [token, navigate]);


    const handleCourseClick = useCallback((review) => {
        navigate(`/reviews/${review.courseSlug}`);
    }
    );

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const handleCategoryClick = useCallback((category) => {
        setSelectedCategory(category.title);
    }, []);

    const handleDeleteRequest = (review) => {
        console.log(review);
        setSelectedReview(review);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            if (!token) {
            alert('로그인이 필요합니다.');
            return;
            }

            await axios.delete(`${process.env.REACT_APP_BASE_URL}/reviews/${selectedReview.reviewId}`, {
            headers: { Authorization: `Bearer ${token}` }
            });

            setReviews(prev => prev.filter(r => r.id !== selectedReview.reviewId));
            setShowDeleteModal(false);
            setSelectedReview(null);
            window.location.reload();
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

    return (
        <Main
            title="마이페이지"
            description="마이페이지 입니다.">
            <div className='mypage'>
                <ResponsiveMypageHeader />
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
                                            ? category.color : '#fdfdfd',
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
                    {loading ? (
                        <Loading />
                    ) : loadingfinish && reviews.length === 0 ? (
                        <div className="no-reviews">
                            <GrDocumentMissing />
                            <p>표시할 리뷰가 없습니다.</p>
                            <a type="button" href="/" target="_blank">
                                <div>강의 리스트 보기</div>
                            </a>
                        </div>
                    ) : (
                        <div className='review-list'>
                            {reviews.map((review) => (
                                <MypageCard key={review.id} review={review} handleCourseClick={handleCourseClick} onDeleteRequest={handleDeleteRequest} />
                            ))}
                            {showDeleteModal && selectedReview && (
                                <DeleteCard
                                    onCancel={handleDeleteCancel}
                                    onConfirm={handleDeleteConfirm}
                                    review={selectedReview}
                                />
                            )}
                        </div>
                        
                    )}
                </div>
            </div>
        </Main>
    );
};


export default Mypagestatus;
