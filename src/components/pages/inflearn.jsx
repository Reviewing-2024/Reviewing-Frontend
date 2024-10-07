import React from 'react'
import { useNavigate } from 'react-router-dom'

import '../../assert/css/section.css'

import { items } from '../../data/data'

const Inflearn = () => {

  const navigate = useNavigate();

  const handle = (id) => {
    navigate(`/detail/${id}`)
  }
  return (
    <section id='Inflearn'>
      <div className='inflearn__inner'>
        {
          items.map((item, key) => (
            <div key={item.id} className='item'>
              <img src={item.src} alt={item.title} onClick={() => handle(item.id)}/>
              <h4 onClick={() => handle(item.id)}>{item.title}</h4>
            </div>
        ))}
        
      </div>
    </section>
  )
}

export default Inflearn
