import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const useCourses = (sortCriteria, token) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wishLoading, setWishLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    lastCourseId: null,
    lastRating: null,
    lastComments: null,
    hasMore: true,
  });

  const resetPagination = () => {
    setPagination({
      lastCourseId: null,
      lastRating: null,
      lastComments: null,
      hasMore: true,
    });
  };

  const fetchItems = useCallback(async (isInitialLoad = false) => {
    if (loading || (!pagination.hasMore && !isInitialLoad)) return;

    try {
      setLoading(true);
      setError(null);

      const params = isInitialLoad
        ? { sort: sortCriteria }
        : {
            sort: sortCriteria,
            lastCourseId: pagination.lastCourseId,
            lastRating: sortCriteria === 'rating' ? pagination.lastRating : undefined,
            lastComments: sortCriteria === 'comments' ? pagination.lastComments : undefined,
          };

      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const { data: newItems } = await axios.get(`${process.env.REACT_APP_BASE_URL}/courses/인프런`, {
        params,
        headers,
      });

      setItems(prev =>
        isInitialLoad ? newItems : [...prev, ...newItems.filter(i => !prev.find(p => p.id === i.id))]
      );

      if (newItems.length > 0) {
        const last = newItems[newItems.length - 1];
        setPagination({
          lastCourseId: last.id,
          lastRating: sortCriteria === 'rating' ? last.rating : null,
          lastComments: sortCriteria === 'comments' ? last.comments : null,
          hasMore: true,
        });
      } else {
        setPagination(prev => ({ ...prev, hasMore: false }));
      }
    } catch (err) {
      if (err.response?.status === 600) {
        localStorage.removeItem('name');
        localStorage.removeItem('Authorization');
        window.location.reload();
        alert("로그인 토큰이 만료되었습니다. 다시 로그인 해주세요!");
      } else {
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  }, [loading, pagination, sortCriteria, token]);

  const handleWish = async (id, wished) => {
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      setWishLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/courses/${id}/wish`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { wished },
        }
      );

      setItems(prev =>
        prev.map(item => (item.id === id ? { ...item, wished: !wished } : item))
      );

      alert(response.data.wished
        ? "강의가 찜 목록에 추가되었습니다!"
        : "강의가 찜 목록에서 제거되었습니다.");
    } catch (err) {
      if (err.response?.status === 600) {
        localStorage.removeItem('name');
        localStorage.removeItem('Authorization');
        window.location.reload();
        alert("로그인 토큰이 만료되었습니다. 다시 로그인 해주세요!");
      } else {
        alert("위시리스트 처리 중 문제가 발생했습니다.");
      }
      fetchItems();
    } finally {
      setWishLoading(false);
    }
  };

  return {
    items,
    loading,
    wishLoading,
    error,
    fetchItems,
    handleWish,
    resetPagination,
    hasMore: pagination.hasMore,
  };
};