
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Detail = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const location = useLocation();
  const { item } = location.state || {};

  return (
    <div className='detail'>
      <h2>{item.title}</h2>
      <img src={item.thumbnailImage} alt='img' />
    </div>
  );
};


export default Detail;