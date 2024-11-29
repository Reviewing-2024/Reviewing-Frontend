import React from 'react'

import '../../../assert/css/mypage.css'

import { review } from '../../../data/review.js'

import Mypageheader from '../../section/mypageheader.jsx';

const wishlist = () => {
  return (
    <div className='mypage'>
         <Mypageheader /> 
        <div className='review'>
            <p className='title'>WishList</p>
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
        <div className='footer' />   
    </div>
  )
}

export default wishlist
