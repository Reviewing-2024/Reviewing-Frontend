import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';

import '../../../assert/css/mypage.css';

import { review_category } from '../../../data/review.js';
import Mypageheader from '../../section/mypageheader.jsx';

import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
const Mypage = () => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [items, setItems] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
     const [hoverIndex, setHoverIndex] = useState(null);

    const token = localStorage.getItem('Authorization');
    const location = useLocation();

     useEffect(() => {
            const matchedCategory = review_category.find(
                (category) => `/mypage${category.src}` === location.pathname
            );
            if (matchedCategory) {
                setSelectedCategory(matchedCategory.title);
            }
        }, [location]);


    const fetchUsers = async () => {
        try {
            setError(null);
            setItems(null);
            setLoading(true);

            const response = await axios.get(
                'http://localhost:8080/my/reviews',
                {
                    headers: {
                        'Authorization': `Bearer ${token}`, 
                    }
                }
            );
            console.log(response);
            setItems(response.data);
        } catch (e) {
            setError(e);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCategoryClick = (category) => {
        setSelectedCategory(category.title);
    };

    if (loading) return <div>로딩중...</div>;
    if (error) {
        return (
            <div>
                <p>에러가 발생했습니다.</p>
                <p>에러 메시지: {error.response ? error.response.data.message : error.message}</p>
            </div>
        );
    }

    if (!items) return null;

    return (
        <div className='mypage'>
            <Mypageheader />
            <div className='review_category'>
                <ul>
                    {review_category.map((category, key) => (
                        <li
                            key={key}
                            onMouseEnter={() => setHoverIndex(key)}  
                            onMouseLeave={() => setHoverIndex(null)}
                        >
                            <Link
                                to={`/mypage${category.src}`}
                                className={selectedCategory === category.title ? 'active' : ''}
                                style={{
                                    backgroundColor: hoverIndex === key || selectedCategory === category.title
                                        ? category.color
                                        : '#fdfdfd',
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
            {items.length === 0 ? (
                    <div>표시할 리뷰가 없습니다.</div>
                ) : (
                <div className='review-list'>
                    {items.map((item) => (
                        <div key={item.id} className='review-card'>
                            <div className="review-content">
                                <span className='createdAt'>{item.createdAt}</span>
                                <span className={`status ${item.status.toLowerCase()}`}>&nbsp;</span>
                                <p className='content'>{item.contents}</p>
                                <span><FaThumbsUp /> {item.likes}</span>
                                <span><FaThumbsDown /> {item.dislikes}</span>
                                <div className='review-rating'>
                                <span>
                                    <svg width="18" height="19" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                    <path fill="#FDCC0E" fill-rule="evenodd" d="M8 1.3c.133 0 .263.037.375.108.113.07.203.17.262.29l1.778 3.637 3.978.583c.131.02.254.075.355.161.101.086.176.199.217.326.041.126.046.262.014.392-.031.13-.098.247-.193.34l-2.878 2.831.68 3.996c.022.131.007.267-.042.39-.05.124-.133.23-.24.31-.107.078-.234.125-.366.134-.132.01-.263-.018-.38-.08L8 12.831l-3.558 1.887c-.117.062-.248.09-.38.08-.132-.01-.259-.056-.365-.134-.107-.079-.19-.186-.24-.31-.05-.123-.065-.258-.043-.39l.68-3.997-2.88-2.83c-.094-.093-.161-.21-.193-.34-.032-.13-.027-.266.014-.393.04-.127.116-.24.217-.326.102-.086.225-.142.356-.16l3.978-.583 1.779-3.637c.059-.12.15-.22.262-.29.112-.07.242-.108.374-.108z" clip-rule="evenodd">
                                    </path>
                                    </svg> {item.rating}
                                </span>
                                </div>
                                {item.status === "REJECTED" ?(<span className='rejected'>거절 사유: {item.rejectionReason}</span>):('')}
                            </div>
                        </div>
                    ))}
                </div>
                )}
            </div>
            <div className='footer' />
        </div>
    );
};


export default Mypage
