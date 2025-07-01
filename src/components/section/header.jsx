import React, { useState } from 'react';

import "../../assert/layout.css";
import "../../assert/header.css";

import { IoIosSearch } from "react-icons/io";

import KakaoLogin from './kakao/KakaoLogin';
import { useNavigate } from 'react-router-dom'


const Header2 = () => {

    const [searchKeyword, setSearchKeyword] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        if (searchKeyword) {
            navigate(`/search/${searchKeyword}`);
            setSearchKeyword('');
        }
    };

  return (
    <div className='header2'>
      <div className="header__content">
        <a className='header__logo' href="/">
            <img className='logo' src='/img/Logo1.png'></img>
          </a>
        <div className='search-bar'>
          <input 
              type='search' 
              id='searchInput' 
              placeholder='검색어를 입력해주세요.' 
              autoComplete='off' 
              className='searchinput' 
              onChange={e => setSearchKeyword(e.target.value)}
              onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
              }}
            />
          <button onClick={handleSearch}><IoIosSearch /></button>
        </div>
          <KakaoLogin />
      </div>
    </div>
  );
}

export default Header2;
