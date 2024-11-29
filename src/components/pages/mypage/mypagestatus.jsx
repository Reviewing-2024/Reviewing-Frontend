import React from 'react';
import { Link, useParams } from 'react-router-dom';

import '../../../assert/css/mypage.css';

import { review, review_category } from '../../../data/review.js';
import Mypageheader from '../../section/mypageheader.jsx';

const MypageStatus = () => {
    const { status } = useParams();

    const filteredReviews = status ? 
        review.filter((item) => item.status === status) : review;

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
                <p className='title'>{status}</p>
                <div className='review-inner'>
                    {filteredReviews.map((item) => (
                        <div key={item.id} className='reviews'>
                        {/* <div className='status' /> */}
                        <div className='content'>
                            <p>{item.user}</p> 
                            <p>{item.content}</p>
                            <span>{item.likes}</span>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
            <div className='footer' />
        </div>
    );
};

export default MypageStatus;
