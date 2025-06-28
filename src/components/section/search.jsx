import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import Main from './main';

import '../../assert/css/section.css';
import '../../assert/layout.css';

import { FaHeart, FaRegHeart  } from "react-icons/fa6";
import { FiLoader } from "react-icons/fi";
import { TbMessageCircle } from "react-icons/tb";
import { IoHeart } from 'react-icons/io5';

function Search() {
  const [items, setItems] = useState([]);
  const [pageloading, setPageloading] = useState(false);
  const [error, setError] = useState(null);
  const [lastCourseId, setLastCourseId] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [wishLoading, setWishLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [wishRequestInProgress, setWishRequestInProgress] = useState(false);
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
      setSearchLoading(true);
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
      setSearchLoading(false);
    }
  }, [pageloading, hasMore, items, lastCourseId, token, searchKeyword]);

  const handleWish = async (id, wished) => {

    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    setWishLoading(true);
    setWishRequestInProgress(true);
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
    }finally {
      setWishLoading(false);
      setTimeout(() => {
        setWishRequestInProgress(false);
      }, 1000);
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
    title = "검색"
    description="검색 강의입니다.">
      <section id="search">
        {searchLoading ? (
          <div className="loading">
            <FiLoader />
          </div>
        ) : pageloading && items.length === 0 ? (
          <div className="no-items">
            해당하는 강의가 없습니다.
          </div>
        ) : (
          <div className="inflearn__inner">
            {items.map(item => (
              <div key={item.id} className="item">
                <div className="item-inner">
                 <Link className='item-title' to={`/reviews/${item.slug}`}>
                    {item.thumbnailImage ? (
                      <img src={item.thumbnailImage} alt={item.title} />
                    ) : item.thumbnailVideo ? (
                      <video muted autoPlay loop>
                        <source src={item.thumbnailVideo} type="video/mp4" alt={item.title} />
                      </video>
                    ) : (
                      <img src="/img/nothing.png" alt={item.title} />
                    )}
                    <span>{item.title}</span>
                  </Link>
                  <div className="item-information">
                    {item.teacher ? <p>{item.teacher}</p> : <p>&nbsp;</p>}
                    <span>
                      <svg width="13" height="12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                        <path
                          fill="#FDCC0E"
                          fillRule="evenodd"
                          d="M8 1.3c.133 0 .263.037.375.108.113.07.203.17.262.29l1.778 3.637 3.978.583c.131.02.254.075.355.161.101.086.176.199.217.326.041.126.046.262.014.392-.031.13-.098.247-.193.34l-2.878 2.831.68 3.996c.022.131.007.267-.042.39-.05.124-.133.23-.24.31-.107.078-.234.125-.366.134-.132.01-.263-.018-.38-.08L8 12.831l-3.558 1.887c-.117.062-.248.09-.38.08-.132-.01-.259-.056-.365-.134-.107-.079-.19-.186-.24-.31-.05-.123-.065-.258-.043-.39l.68-3.997-2.88-2.83c-.094-.093-.161-.21-.193-.34-.032-.13-.027-.266.014-.393.04-.127.116-.24.217-.326.102-.086.225-.142.356-.16l3.978-.583 1.779-3.637c.059-.12.15-.22.262-.29.112-.07.242-.108.374-.108z"
                          clipRule="evenodd"
                        />
                      </svg> {item.rating}
                    </span>
                    <span className="item-comment">
                      <TbMessageCircle size={15} /> {item.comments}
                    </span>
                    <span className="item-wishe">
                      <IoHeart size={16} color="004FDE" /> {item.wishes}
                    </span>
                    <div className="overlay">
                      <span onClick={() => handleWish(item.id, item.wished)}>
                        {wishLoading ? (
                          <FiLoader color="#004FDE" size={18} />
                        ) : item.wished ? (
                          <FaHeart color="#004FDE" size={18} />
                        ) : (
                          <FaRegHeart color="#004FDE" size={18} />
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
    </section>
  </Main>
  );
}

export default Search;
