import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


import '../../assert/css/section.css';
import '../../assert/layout.css';

import { FaHeart, FaRegHeart  } from "react-icons/fa6";
import { FiLoader } from "react-icons/fi";
import { TbMessageCircle } from "react-icons/tb";

function Fastcampus() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortCriteria, setSortCriteria] = useState('fundamental');
  const [lastCourseId, setLastCourseId] = useState(null);
  const [lastRating, setLastRating] = useState(null);
  const [lastComments, setLastComments] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [wishLoading, setWishLoading] = useState(false);
  const [wishRequestInProgress, setWishRequestInProgress] = useState(false);

  const token = localStorage.getItem('Authorization');

  useEffect(() => {
    setLastCourseId(null);
    setLastRating(null);
    setLastComments(null);
    setHasMore(true);
    setItems([]);
    fetchItems(true);
  }, [sortCriteria]);


  const fetchItems = useCallback(async (isInitialLoad = false) => {
    if (loading || (!hasMore && !isInitialLoad)) return;
  
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      setLoading(true);
      setError(null);
  
      const params = isInitialLoad ? {
        sort: sortCriteria === 'fundamental' ? null : sortCriteria,
        lastCourseId: null
      } : {
        sort: sortCriteria === 'fundamental' ? null : sortCriteria,
        lastCourseId: lastCourseId,
        lastRating: sortCriteria === 'highestRating' ? lastRating : null,
        lastComments: sortCriteria === 'mostReviews' ? lastComments : null
      };
  
      const response = await axios.get(`http://localhost:8080/courses/패스트캠퍼스`, {
        headers,
        params,
      });
  
      const newItems = response.data;
      console.log(params)
      console.log('Response data:', newItems);
  
      if (isInitialLoad) {
        setItems(newItems);
      } else {
        const existingIds = new Set(items.map(item => item.id));
        const uniqueNewItems = newItems.filter(item => !existingIds.has(item.id));
        setItems(prev => [...prev, ...uniqueNewItems]);
      }
  
      if (newItems.length > 0) {
        const lastItem = newItems[newItems.length - 1];
        setLastCourseId(lastItem.id);
        console.log(lastItem.id)
        if (sortCriteria === 'highestRating') setLastRating(lastItem.rating);
        if (sortCriteria === 'mostReviews') setLastComments(lastItem.comments);
        setHasMore(true);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError(err);
      console.error('Request Error:', err.response || err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, items, lastCourseId, lastRating, lastComments, sortCriteria, token]);

  const handleWish = async (id, wished) => {

    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    setWishLoading(true);
    setWishRequestInProgress(true);
    try {
      const response = await axios.post(
        `http://localhost:8080/courses/${id}/wish`,
        null,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          params: {
            wished: wished,
          },
        }
      );
      setItems(prevItems => 
        prevItems.map(item => 
          item.id === id ? { ...item, wished: !wished } : item
        )
      );

      const message = response.data.wished 
        ? "강의가 찜 목록에 추가되었습니다!" 
        : "강의가 찜 목록에서 제거되었습니다.";
      alert(message);
    } catch (error) {
      if (error.response?.status === 600) {
        alert("로그인이 필요한 서비스입니다.");
      } else {
        console.error("위시리스트 처리 중 오류:", error);
        alert("위시리스트 처리 중 문제가 발생했습니다.");
      }
      await fetchItems();
    }finally {
      setWishLoading(false);
      setTimeout(() => {
        setWishRequestInProgress(false);
      }, 1000);
    }
  };

  const handleScroll = useCallback(() => {
    if (loading || !hasMore) return;
  
    const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
    const buffer = 100;
  
    if (scrollHeight - scrollTop - clientHeight < buffer) {
      fetchItems(false);
    }
  }, [loading, hasMore, fetchItems]);
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);


  if (error) return <div>에러가 발생했습니다.</div>;
  if (!items.length) return <div>데이터가 없습니다.</div>;

  return (
    <section id='fastcampus'>
      <div className="sort-dropdown">
        <select onChange={(e) => setSortCriteria(e.target.value)} value={sortCriteria}>
          <option value="fundamental">기본 순</option>
          <option value="highestRating">별점 높은 순</option>
          <option value="mostReviews">리뷰 많은 순</option>
        </select>
      </div>
      <div className='inflearn__inner'>
        {items.map(item => (
          <div key={item.id} className='item'>
            <div className='item-inner'>
            <Link className='item-title' to={`/reviews/${item.id}`} state={{ item }}>
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
                {item.teacher ? <p>{item.teacher}</p> : <p>&nbsp;</p>}
                <span>
                  <svg width="13" height="12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                    <path fill="#FDCC0E" fillRule="evenodd" d="M8 1.3c.133 0 .263.037.375.108.113.07.203.17.262.29l1.778 3.637 3.978.583c.131.02.254.075.355.161.101.086.176.199.217.326.041.126.046.262.014.392-.031.13-.098.247-.193.34l-2.878 2.831.68 3.996c.022.131.007.267-.042.39-.05.124-.133.23-.24.31-.107.078-.234.125-.366.134-.132.01-.263-.018-.38-.08L8 12.831l-3.558 1.887c-.117.062-.248.09-.38.08-.132-.01-.259-.056-.365-.134-.107-.079-.19-.186-.24-.31-.05-.123-.065-.258-.043-.39l.68-3.997-2.88-2.83c-.094-.093-.161-.21-.193-.34-.032-.13-.027-.266.014-.393.04-.127.116-.24.217-.326.102-.086.225-.142.356-.16l3.978-.583 1.779-3.637c.059-.12.15-.22.262-.29.112-.07.242-.108.374-.108z" clipRule="evenodd" />
                  </svg> {item.rating}
                </span>
                <span className='item-comment'>
                 <TbMessageCircle size={15} /> {item.comments}
                </span>
                <div className="overlay">
                  <span onClick={() => handleWish(item.id, item.wished)}>
                  {wishLoading ? (
                    <FiLoader color="#88BAF7" size={18} />
                    ):item.wished ? (
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
    </section>
  );
}


export default Fastcampus;