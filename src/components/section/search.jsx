import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Main from './main';

import '../../assert/css/section.css';
import '../../assert/layout.css';
import '../../assert/css/loading.css';

import ItemCard from '../component/items/ItemCard'
import Loading from '../component/items/Loading'

function Search() {
  const [items, setItems] = useState([]);
  const [pageloading, setPageloading] = useState(false);
  const [error, setError] = useState(null);
  const [lastCourseId, setLastCourseId] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [wishLoading, setWishLoading] = useState(false);
  const [searchFinished, setSearchFinished] = useState(false);
  const { searchKeyword } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    setItems([]);
    setLastCourseId(null);
    setHasMore(true);
    fetchItems(true);
  }, [searchKeyword]);


  const token = localStorage.getItem('Authorization');

  const fetchItems = useCallback(async (isInitialLoad = false) => {
    if (pageloading || (!hasMore && !isInitialLoad)) return;

    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      setPageloading(true);
      setError(null);

      const params = {
        keyword: searchKeyword,
        lastCourseId: isInitialLoad ? null : lastCourseId,
      };

      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/courses/search`, {
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

      setSearchFinished(true);

      if (newItems.length > 0) {
        const lastItem = newItems[newItems.length - 1];
        setLastCourseId(lastItem.id);
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
      setPageloading(false);
      setSearchFinished(true);
    }
  }, [pageloading, hasMore, items, lastCourseId, token, searchKeyword]);

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
        localStorage.removeItem('name');
        localStorage.removeItem('Authorization');
        window.location.reload();
        alert("로그인 토큰이 만료되었습니다. 다시 로그인 해주세요!");
      } else {
        console.error("위시리스트 처리 중 오류:", error);
        alert("위시리스트 처리 중 문제가 발생했습니다.");
      }
      await fetchItems();
    } finally {
      setWishLoading(false);
    }
  };

  const handleScroll = useCallback(() => {
    if (pageloading || !hasMore) return;

    const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
    const buffer = 100;

    if (scrollHeight - scrollTop - clientHeight < buffer) {
      fetchItems(false);
    }
  }, [pageloading, hasMore, fetchItems]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);


  return (
    <Main
      title="검색"
      description="검색 강의입니다.">
      <section id="search">
        { pageloading ? (
          <Loading />
        ) :
        searchFinished && items.length === 0 ? (
          <div className="no-items">
            해당하는 강의가 없습니다.
          </div>
        ) : (
          <div className='inflearn__inner'>
            {items.map(item => (
              <ItemCard key={item.id} item={item} handleWish={handleWish} wishLoading={wishLoading} />
            ))}
          </div>
        )}
      </section>
    </Main>
  );
}

export default Search;
