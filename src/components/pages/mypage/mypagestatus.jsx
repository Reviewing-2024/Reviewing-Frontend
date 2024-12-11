import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

import '../../../assert/css/mypage.css';
import { review_category } from '../../../data/review.js';
import Mypageheader from '../../section/mypageheader.jsx';

import { PiThumbsUpDuotone } from "react-icons/pi";
import { PiThumbsDownDuotone } from "react-icons/pi";

const Mypagestatus = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { status } = useParams();
    const token = localStorage.getItem('Authorization');

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(
                    `http://localhost:8080/my/reviews?status=${status}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    }
                );
                setItems(response.data);
            } catch (e) {
                setError(e);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [status, token]);

    if (loading) return <div className="loading">로딩 중...</div>;

    if (error)
        return (
            <div className="error">
                <p>에러가 발생했습니다.</p>
                <p>
                    에러 메시지:{' '}
                    {error.response ? error.response.data.message : error.message}
                </p>
            </div>
        );

    return (
        <div className="mypage">
            <Mypageheader />
            <div className="review_category">
                <ul>
                    {review_category.map((category, key) => (
                        <li key={key}>
                            <Link to={`/mypage${category.src}`}>{category.title}</Link>
                        </li>
                    ))}
                </ul>
            </div>
            <p className="title">{status}</p>
            <div className="review">
                {items.length === 0 ? (
                    <div>표시할 리뷰가 없습니다.</div>
                ) : (
                    <div className="review-inner">
                        {items.map((item) => (
                            <div key={item.id} className="reviews">
                                <div className="content">
                                <span className='createdAt'>{item.createdAt}</span>
                                <span className='status'>{item.status}</span>
                                <p>{item.contents}</p>
                                <span><PiThumbsUpDuotone /> {item.likes}</span>
                                <span><PiThumbsDownDuotone /> {item.dislikes}</span>
                                <span className="review-rating">별점: {item.rating}</span>
                                {item.status === "REJECTED" ?(<span>거절 사유: {item.rejectionReason}</span>):('')}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="footer" />
        </div>
    );
};

export default Mypagestatus;
