import { Link } from 'react-router-dom';
import React from 'react';

import '../../../assert/css/mypage.css';

import { review, review_category } from '../../../data/review.js'

import Mypageheader from '../../section/mypageheader.jsx';

const Mypage = () => {

  return (
    <div className='mypage'>
        <Mypageheader />  
        <div className='review'>
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
        </div>
        <div className='review'>
            <p className='title'>My Reviews</p>
            <div className='review-inner'>
                    {
                        review.map((item)=> (    
                            <div key={item.id} className='reviews'>
                                {/* <div className='status' /> */}
                                <div className='content'>
                                    <p>{item.user}</p> 
                                    <p>{item.content}</p>
                                    <span>{item.likes}</span>
                                </div>
                            </div>
                        ))
                    }
            </div>
        </div>  
    </div>
  )
}

export default Mypage
