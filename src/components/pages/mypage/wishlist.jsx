import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

import { FaHeart, FaRegHeart  } from "react-icons/fa6";
import { GrDocumentMissing } from "react-icons/gr";
import { FiLoader } from "react-icons/fi";
import { TbMessageCircle } from "react-icons/tb";
import { IoHeart } from 'react-icons/io5';

import Main from '../../section/main.jsx';
import Mypageheader from '../../section/mypageheader.jsx';
import ResponsiveMypageHeader from '../../section/ResponsiveMypageHeader.jsx';

import '../../../assert/css/mypage.css';
import '../../../assert/css/section.css';


const Wishlist = () => {
  const [items, setItems] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishLoading, setWishLoading] = useState(false);
  const [wishRequestInProgress, setWishRequestInProgress] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('Authorization');


  const fetchItem = useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
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
        }
        };

    fetchWishlist();
  }, [token]);

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
        navigate('/')
        window.location.reload();
        alert("로그인 토큰이 만료되었습니다. 다시 로그인 해주세요!");
      } else {
        console.error("위시리스트 처리 중 오류:", error);
        alert("위시리스트 처리 중 문제가 발생했습니다.");
      }
      await fetchItem();
    }finally {
      setWishLoading(false);
      setTimeout(() => {
        setWishRequestInProgress(false);
      }, 1000);
      window.location.reload();
    }
  };

  return (
    <Main 
      title = "찜"
      description="찜한 강의 입니다.">
      <div className='mypage'>
        <ResponsiveMypageHeader />
        <Mypageheader />
        <div className='review'>      
          {loading ? (
            <div className="loading">
              <FiLoader />
            </div>
          ) : items === null ? (
              <div className="loading"><FiLoader /></div>
          ): items.length ? (
            <div className='inflearn__inner'>
              {items.map(item => (
                <div key={item.id} className='item'>
                  <div className='item-inner'>
                    <Link className='item-title' to={`/reviews/${item.slug}`} >
                      {item.thumbnailImage ? (
                        <img src={item.thumbnailImage} alt={item.title} />
                      ) : item.thumbnailVideo ? (
                        <video muted autoPlay loop>
                          <source src={item.thumbnailVideo} type="video/mp4" alt={item.title} />
                        </video>
                      ) : (
                        <img src='/img/nothing.png' alt={item.title} />
                      )}
                      <span>{item.title}</span>
                    </Link>
                    <div className='item-information'>
                      {item.teacher ? <p>{item.teacher}</p> : <p>&nbsp;</p>}
                      <span className='item-rating'>
                        <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                          <path fill="#FDCC0E" fillRule="evenodd" d="M8 1.3c.133 0 .263.037.375.108.113.07.203.17.262.29l1.778 3.637 3.978.583c.131.02.254.075.355.161.101.086.176.199.217.326.041.126.046.262.014.392-.031.13-.098.247-.193.34l-2.878 2.831.68 3.996c.022.131.007.267-.042.39-.05.124-.133.23-.24.31-.107.078-.234.125-.366.134-.132.01-.263-.018-.38-.08L8 12.831l-3.558 1.887c-.117.062-.248.09-.38.08-.132-.01-.259-.056-.365-.134-.107-.079-.19-.186-.24-.31-.05-.123-.065-.258-.043-.39l.68-3.997-2.88-2.83c-.094-.093-.161-.21-.193-.34-.032-.13-.027-.266.014-.393.04-.127.116-.24.217-.326.102-.086.225-.142.356-.16l3.978-.583 1.779-3.637c.059-.12.15-.22.262-.29.112-.07.242-.108.374-.108z" clipRule="evenodd" />
                        </svg> {item.rating}
                      </span>
                      <span className='item-comment'>
                        <TbMessageCircle size={16} /> {item.comments}
                      </span>
                      <span className='item-wishe'>
                        <IoHeart size={16} color='004FDE' /> {item.wishes}
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
          ) : (
            <div className="no-reviews">
              <GrDocumentMissing />
              <p>찜한 강의가 없습니다.</p>
              <a type="button" href="/" target="_blank">
                <div>강의 리스트 보기</div>
              </a>
            </div>
          )}
        </div>
        <div className='footer' />
      </div>
    </Main>    
  );
};

export default Wishlist;
