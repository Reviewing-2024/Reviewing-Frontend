import React from 'react'
import { Outlet } from 'react-router-dom'

const search = () => {
  return (
    <div>
      search페이지
      <Outlet></Outlet>
    </div>
  )
}

export default search
