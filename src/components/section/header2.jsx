import React from 'react';

import "../../assert/layout.css";
import "../../assert/header2.css";

import { CiSearch } from "react-icons/ci";
import { FaUser } from "react-icons/fa";

import { Link } from 'react-router-dom';

const Header2 = () => {
  return (
    <div className='header2'>
      <div className="header__content">
        <h1 className='header__logo'>
          <a href="/">
            <em></em>
            <span>Reviewing</span>
          </a>
        </h1>
        <div className='search-bar'>
          <input
            type='text'
            placeholder='검색어를 입력하세요...'>
          </input>
          <button><CiSearch /></button>
        </div>
        <div className='user-button'>
            <Link to="/user">
                <FaUser />
            </Link>
        </div>
      </div>
    </div>
  );
}

export default Header2;
