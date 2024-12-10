import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import '../../assert/css/section.css';
import '../../assert/layout.css';

function Inflearn() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortCriteria, setSortCriteria] = useState('fundamental');

  const fetchItems = async (sort) => {
    try {
      setError(null);
      setLoading(true);

      const url = `http://localhost:8080/courses/인프런${sort !== 'fundamental' ? `?sort=${sort}` : ''}`;

      const response = await axios.get(url);
      setItems(response.data);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems(sortCriteria);
  }, [sortCriteria]);

  if (loading) return <div>로딩중..</div>;
  if (error) return <div>에러가 발생했습니다.</div>;
  if (!items.length) return <div>데이터가 없습니다.</div>;

  return (
    <section id='inflearn'>
      <div className="sort-dropdown">
        <select onChange={(e) => setSortCriteria(e.target.value)} value={sortCriteria}>
          <option value="fundamental">기본 순</option>
          <option value="rating">별점 높은 순</option>
          <option value="comments">리뷰 많은 순</option>
        </select>
      </div>
      <div className='inflearn__inner'>
        {items.map(item => (
          <div key={item.id} className='item'>
            <div className='item-inner'>
              <Link className='item-title' to={`/detail/${item.id}`} state={{ item }}>
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
                {item.teacher ? (
                  <p>강사: {item.teacher}</p>
                ) : (
                  <p>강사: 미상</p>
                )}
                <p>별점: {item.rating}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Inflearn;
