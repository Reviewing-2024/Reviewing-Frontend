import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { items } from '../../data/data'


const Detail = () => {

  useEffect(() => {
    window.scrollTo( 0 , 0 );
  }, []);

  const { id } = useParams();

  const item = items.find(item => item.id === parseInt(id));

  return (
    <div className='detail'>
      <h2>{item.title}</h2>
      <img src={item.src} alt='img'/>
      <h2>overview</h2>
      <br/>
      {item.overview}
    </div>
  )
}

export default Detail
