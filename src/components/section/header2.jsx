import React from 'react';

import "../../assert/layout.css";
import "../../assert/header2.css";

import { CiSearch } from "react-icons/ci";

import { ImProfile } from "react-icons/im"; // Profile icon
import { FaUserShield } from "react-icons/fa"; // Admin icon

import KakaoLogin from './kakao/KakaoLogin';

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
        <div>
          <KakaoLogin />
        </div>
      </div>
    </div>
  );
}

export default Header2;
