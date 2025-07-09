import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { GrDocumentMissing } from "react-icons/gr";

import ItemCard from '../../component/items/ItemCard.jsx'

import Main from '../../section/main.jsx';
import Loading from '../../component/items/Loading.jsx'
import Mypageheader from '../../section/mypageheader.jsx';
import ResponsiveMypageHeader from '../../section/ResponsiveMypageHeader.jsx';

import '../../../assert/css/mypage.css';
import '../../../assert/css/section.css';


const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingfinish, setLoadingFinished] = useState(false);
  const [error, setError] = useState(null);
  const [wishLoading, setWishLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('Authorization');


  const fetchItem = useEffect(() => {

    const fetchWishlist = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/my/wish/courses`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
        setItems(response.data);

      } catch (error) {
        if (error.response?.status === 600) {
          localStorage.removeItem('name');
          localStorage.removeItem('Authorization');
          navigate('/')
          window.location.reload();
          alert("로그인 토큰이 만료되었습니다. 다시 로그인 해주세요!");
        }
        setError(error.message);
      } finally {
        setLoading(false);
        setLoadingFinished(true);
      }
    }

    fetchWishlist();
  }, [token]);

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
        navigate('/')
        window.location.reload();
        alert("로그인 토큰이 만료되었습니다. 다시 로그인 해주세요!");
      } else {
        console.error("위시리스트 처리 중 오류:", error);
        alert("위시리스트 처리 중 문제가 발생했습니다.");
      }
      await fetchItem();
    } finally {
      setWishLoading(false);
      window.location.reload();
    }
  };

  return (
    <Main
      title="찜"
      description="찜한 강의 입니다.">
      <div className='mypage'>
        <ResponsiveMypageHeader />
        <Mypageheader />
        <div className='review'>
          {loading ? (
            <Loading />
          ) : loadingfinish && items.length === 0 ? (
            <div className="no-reviews">
              <GrDocumentMissing />
              <p>찜한 강의가 없습니다.</p>
              <a type="button" href="/" target="_blank">
                <div>강의 리스트 보기</div>
              </a>
            </div>
          ) : (
            <div className='inflearn__inner'>
              {items.map(item => (
                <ItemCard key={item.id} item={item} handleWish={handleWish} wishLoading={wishLoading} />
              ))}
            </div>
          )}
        </div>
      </div>
    </Main>
  );
};

export default Wishlist;
