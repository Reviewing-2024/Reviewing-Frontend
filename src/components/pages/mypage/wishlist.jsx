import React from 'react'

import '../../../assert/css/mypage.css'

import { Link } from 'react-router-dom';

import { items } from '../../../data/data.js'

import Mypageheader from '../../section/mypageheader.jsx';
import { FiX } from "react-icons/fi";
const wishlist = () => {
  return (
    <div className='mypage'>
         <Mypageheader /> 
        <div className='review'>
            <p className='title'>WishList</p>
            <div className='inflearn__inner'>
        {items.map(item => (
          <div key={item.id} className='item'>
            <div className='item-inner'>
            <Link className='item-title' to={`/reviews/${item.id}`} state={{ item }}>
            <img src={item.src} alt={item.title} />   
            <span>{item.title}</span>
          </Link>
              <div className='item-information'>
                <p>강사: 미상</p>
                <p>별점: {item.rating}</p>
              </div>
              <div className='delete'><FiX /></div>
            </div>
          </div>
        ))}
      </div>
        </div>  
        <div className='footer' />   
    </div>
  )
}

export default wishlist
