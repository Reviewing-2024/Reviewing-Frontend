import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Main from '../section/main';

import ItemCard from '../component/items/ItemCard'

import '../../assert/css/section.css';
import '../../assert/layout.css';

function Codeit() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortCriteria, setSortCriteria] = useState('rating');
  const [lastCourseId, setLastCourseId] = useState(null);
  const [lastRating, setLastRating] = useState(null);
  const [lastComments, setLastComments] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [wishLoading, setWishLoading] = useState(false);

  const token = localStorage.getItem('Authorization');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
        sort: sortCriteria,
        lastCourseId: null
      } : {
        sort: sortCriteria,
        lastCourseId: lastCourseId,
        lastRating: sortCriteria === 'rating' ? lastRating : null,
        lastComments: sortCriteria === 'comments' ? lastComments : null
      };

      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/courses/코드잇`, {
        headers,
        params,
      });

      const newItems = response.data;

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
        if (sortCriteria === 'rating') setLastRating(lastItem.rating);
        if (sortCriteria === 'comments') setLastComments(lastItem.comments);
        setHasMore(true);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      if (err.response?.status === 600) {
        localStorage.removeItem('name');
        localStorage.removeItem('Authorization');
        window.location.reload();
        alert("로그인 토큰이 만료되었습니다. 다시 로그인 해주세요!");
      }
      setError(err);
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
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/courses/${id}/wish`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { wished },
        }
      );
      setItems(prevItems =>
        prevItems.map(item =>
          item.id === id ? { ...item, wished: !wished } : item
        )
      );

      const message = response.data.wished ? "강의가 찜 목록에 추가되었습니다!" : "강의가 찜 목록에서 제거되었습니다.";
      alert(message);

    } catch (error) {
      if (error.response?.status === 600) {
        localStorage.removeItem('name');
        localStorage.removeItem('Authorization');
        window.location.reload();
        alert("로그인 토큰이 만료되었습니다. 다시 로그인 해주세요!");
      }
      else {
        alert("위시리스트 처리 중 문제가 발생했습니다.");
      }
      await fetchItems();
    } finally {
      setWishLoading(false);
      // window.location.reload();
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

  return (
    <Main
      title="코드잇"
      description="코드잇 강의입니다.">
      <section id='codeit'>
        <div className="sort-dropdown">
          <select onChange={(e) => setSortCriteria(e.target.value)} value={sortCriteria}>
            <option value="rating">별점 높은 순</option>
            <option value="comments">리뷰 많은 순</option>
          </select>
        </div>
        <div className='inflearn__inner'>
          {items.map(item => (
            <ItemCard key={item.id} item={item} handleWish={handleWish} wishLoading={wishLoading} />
          ))}
        </div>
      </section>
    </Main>
  );
}

export default Codeit;