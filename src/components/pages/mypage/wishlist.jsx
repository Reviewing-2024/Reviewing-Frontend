import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { FaHeart, FaRegHeart  } from "react-icons/fa6";

import Mypageheader from '../../section/mypageheader.jsx';

import '../../../assert/css/mypage.css';
import '../../../assert/css/section.css';


const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('Authorization');

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axios.get(
            'http://localhost:8080/my/wish/courses', 
            {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            });
            setItems(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
        };

    fetchWishlist();
  }, [token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  console.log(items);

  return (
    <div className='mypage'>
      <Mypageheader />
      <div className='review'>
        <p className='title'>WishList</p>
        <div className='inflearn__inner'>
          {items.map(item => (
            <div key={item.id} className='item'>
              <div className='item-inner'>
                <Link className='item-title'  to={`/reviews/${item.id}`} state={{ item }}>
                {
                item.thumbnailImage ? (
                <img src={item.thumbnailImage} alt={item.title} />
                ) : item.thumbnailVideo ? (
                <video muted autoPlay loop>
                  <source src={item.thumbnailVideo} type="video/mp4" alt={item.title} />
                </video>
                ) : (
                <img src='/img/nothing.png' alt={item.title} />
                )
                }
                <span>{item.title}</span>
                </Link>
                <div className='item-information'>
              <div className='item-teacher'>
                {
                  item.teacher ? (
                  <p>{item.teacher}</p> 
                  ):(
                  <p>&nbsp;</p> 
                  )
                }
              </div>
                  <span>
                    <svg width="13" height="12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                      <path fill="#FDCC0E" fill-rule="evenodd" d="M8 1.3c.133 0 .263.037.375.108.113.07.203.17.262.29l1.778 3.637 3.978.583c.131.02.254.075.355.161.101.086.176.199.217.326.041.126.046.262.014.392-.031.13-.098.247-.193.34l-2.878 2.831.68 3.996c.022.131.007.267-.042.39-.05.124-.133.23-.24.31-.107.078-.234.125-.366.134-.132.01-.263-.018-.38-.08L8 12.831l-3.558 1.887c-.117.062-.248.09-.38.08-.132-.01-.259-.056-.365-.134-.107-.079-.19-.186-.24-.31-.05-.123-.065-.258-.043-.39l.68-3.997-2.88-2.83c-.094-.093-.161-.21-.193-.34-.032-.13-.027-.266.014-.393.04-.127.116-.24.217-.326.102-.086.225-.142.356-.16l3.978-.583 1.779-3.637c.059-.12.15-.22.262-.29.112-.07.242-.108.374-.108z" clip-rule="evenodd">
                      </path>
                    </svg>{item.rating}</span>
                    <span>
                      <svg width="13" height="12"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                        <path fill="currentColor" d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z">
                        </path>
                      </svg>
                    </span>
                  <div className="overlay">
                    <span>
                      {item.wished ? (
                        <FaHeart color="#88BAF7" size={18} />
                      ) : (
                        <FaRegHeart color="#88BAF7" size={18} />
                      )}
                    </span>
                  </div>
              </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='footer' />
    </div>
  );
};

export default Wishlist;
