import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


import '../../assert/css/section.css';
import '../../assert/layout.css';

function Codeit() {
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
    <section id='codeit'>
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
            <Link className='item-title' to={`/detail/${item.id}`} state={{ item }}>
            {item.thumbnailImage ?(
                <img src={item.thumbnailImage} alt={item.title} />
                  ) : (
                <img src='/img/nothing.png' alt='없다' />
              )
            }
              <span>{item.title}</span>
            </Link>
            <div className='item-information'>
              <p>강사: {item.teacher}</p>
              <p>별점: {item.rating}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
  );
}

export default Codeit;