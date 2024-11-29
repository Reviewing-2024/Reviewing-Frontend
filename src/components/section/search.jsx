import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

import '../../assert/css/section.css';
import '../../assert/layout.css';

function Search() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { searchKeyword } = useParams();
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setError(null);
      setItems([]);
      setLoading(true);
      const response = await axios.get('http://localhost:8080');
      setItems(response.data);
    } catch (e) {
      setError(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div>로딩중..</div>;
  if (error) return <div>에러가 발생했습니다</div>;
  if (!items || !Array.isArray(items)) return null;

  const filteredItems = searchKeyword
    ? items.filter((item) => 
      (item.title && item.title.includes(searchKeyword)) ||
      (item.teacher && item.teacher.includes(searchKeyword)))
    : [];

  const handleNavigate = (id) => {
    navigate(`/detail/${id}`);
  };

  return (
    <section id="codeit">
      <div className="inflearn__inner">
        {filteredItems.length === 0 ? (
          <p>검색 결과가 없습니다.</p>
        ) : (
          filteredItems.map((item) => (
            <div key={item.id} className="item">
              <div className="item-inner">
                <img
                  src={item.thumbnailImage}
                  alt={item.title}
                  onClick={() => handleNavigate(item.id)}
                />
                <span onClick={() => handleNavigate(item.id)}>{item.title}</span>
                <div className="item-information">
                  <p>강사: {item.teacher}</p>
                  <p>별점: {item.rating}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default Search;
