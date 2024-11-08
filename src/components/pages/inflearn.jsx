import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../../assert/css/section.css';
import '../../assert/layout.css';

import { items } from '../../data/data.js';

// import { FaHeart } from "react-icons/fa";

const Inflearn = () => {
  const navigate = useNavigate();
  const [sortCriteria, setSortCriteria] = useState();

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

  const handleNavigate = (id) => {
    navigate(`/detail/${id}`);
  };

  return (
    <section id='Inflearn'>
      <div className="sort-dropdown">
          <select onChange={(e) => setSortCriteria(e.target.value)} value={sortCriteria}>
          <option value="fundamental">기본 순</option>
            <option value="highestRating">별점 높은 순</option>
            <option value="mostReviews">리뷰 많은 순</option>
          </select>
        </div>
      <div className='inflearn__inner'>
        {
          sortedItems.map((item) => (
            <div key={item.id} className='item'>
              <div className='item-inner'>
                <img src={item.src} alt={item.title} onClick={() => handleNavigate(item.id)} />
                <span onClick={() => handleNavigate(item.id)}>{item.title}</span>
                <div className='item-information'>
                  <p>강사: {item.teacher}</p>
                  <p>별점: {item.rating}</p>
                  {/* <span className='wishlist'><FaHeart /></span> */}
                </div>
              </div>
            </div>
          ))
        }
      </div>
    </section>
  );
};

export default Inflearn;
