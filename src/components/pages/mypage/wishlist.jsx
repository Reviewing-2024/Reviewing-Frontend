import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../../assert/css/mypage.css';
import { Link } from 'react-router-dom';
import Mypageheader from '../../section/mypageheader.jsx';
import { FaRegTrashCan } from "react-icons/fa6";

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
                <img src={item.thumbnailVideo} alt={item.title} />
                ) : (
                <img src='/img/nothing.png' alt={item.title} />
                )
                }
                <span>{item.title}</span>
                </Link>
                <div className='item-information'>
                  <p>강사: {item.teacher || '미상'}</p>
                  <p>별점: {item.rating}</p>
                </div>
                <div className='delete'><FaRegTrashCan /></div>
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
