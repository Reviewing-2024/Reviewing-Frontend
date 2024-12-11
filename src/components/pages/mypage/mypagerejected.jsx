import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import '../../../assert/css/mypage.css';

import { review_category } from '../../../data/review.js';
import Mypageheader from '../../section/mypageheader.jsx';

const Mypagerejected = () => {
    const [items, setItems] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const token = localStorage.getItem('Authorization');


    const fetchUsers = async () => {
        try {
            setError(null);
            setItems(null);
            setLoading(true);

            const response = await axios.get(
                'http://localhost:8080/my/reviews?status=rejected',
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

    if (items.length === 0) {
        return (<div className='mypage'>
            <Mypageheader />
            <div className='review_category'>
                <ul>
                    {review_category.map((review_category, key) => (
                        <li key={key}>
                            <Link to={`/mypage${review_category.src}`}>
                                {review_category.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            <p className='title'>Rejected Reviews</p>
           <div>표시할 리뷰가 없습니다.</div>
            <div className='footer' />
        </div>)
    }

    return (
        <div className='mypage'>
            <Mypageheader />
            <div className='review_category'>
                <ul>
                    {review_category.map((review_category, key) => (
                        <li key={key}>
                            <Link to={`/mypage${review_category.src}`}>
                                {review_category.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div className='review'>
                <p className='title'>Reviews</p>
                <div className='review-inner'>
                    {items.map((item) => (
                        <div key={item.id} className='reviews'>
                            <div className='content'>
                                <p>{item.createdAt}</p>
                                <p>{item.contents}</p>
                                <span>{item.likes}</span>
                                <span>{item.dislikes}</span>
                                <span>{item.rating}</span>
                                <span>{item.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className='footer' />
        </div>
    );
};

export default Mypagerejected;
