import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import '../../assert/css/home.css'
import '../../assert/css/section.css';
import '../../assert/layout.css';

const Home = () => {

    const [items, setItems] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [sortCriteria, setSortCriteria] = useState();
  
    const fetchUsers = async () => {
      try {
        setError(null);
        setItems(null);
        setLoading(true);
        const response = await axios.get(
          'http://localhost:8080'
        );
        setItems(response.data);
      } catch (e) {
        setError(e);
      }
      setLoading(false);
    };
  
    console.log(items);
  
    useEffect(() => {
      fetchUsers();
    }, []);
  
    if (loading) return <div>로딩중..</div>;
    if (error) return <div>에러가 발생했습니다</div>;
  
    if (!items) return null;



    // 고칠거
    const sortedItems = [...items].sort((a, b) => {
        if (sortCriteria === 'fundamental') {
          return 0;
        }
        else if (sortCriteria === 'highestRating') {
          return b.rating - a.rating;
        }
        // else if (sortCriteria === 'mostReviews') {
        //   return b.review - a.review;
        // }
        return 0;
      });
      
  
  
    return (
        <div className='home'>
            <div className='banner'>
                <img className='image' alt='이미지' src='https://codeit-static.codeit.com/_main/production/_next/static/media/hero.bb9277ee.webp'></img>
                <div className='banner-sb'>
                    <h1>리뷰잉</h1>
                    <h2>IT 인재로 성장하는 치트키</h2>
                </div>
                <div className='home-title'>
                    <h3>추천 강의</h3>
                </div>
            </div>

            <section id='home'>
                <div className="sort-dropdown">
                <select onChange={(e) => setSortCriteria(e.target.value)} value={sortCriteria}>
                    <option value="fundamental">기본 순</option>
                    <option value="highestRating">별점 높은 순</option>
                    <option value="mostReviews">리뷰 많은 순</option>
                </select>
                </div>
                <div className='inflearn__inner'>
                {sortedItems.map(item => (
                    <div key={item.id} className='item'>
                    <div className='item-inner'>
                    <Link className='item-title' to={`/reviews/${item.id}`} state={{ item }}>
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
                        {
                            item.teacher ? (
                            <p>강사: {item.teacher}</p> 
                            ):(
                            <p>강사: 미상</p> 
                            )
                        }
                        <p>별점: {item.rating}</p>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </section>
    
        </div>
    )
}

export default Home