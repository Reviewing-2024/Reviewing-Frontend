import React, { useState } from 'react';

import "../../assert/layout.css";
import "../../assert/header2.css";

import { CiSearch } from "react-icons/ci";

import KakaoLogin from './kakao/KakaoLogin';
import { useNavigate } from 'react-router-dom'

import KakaoLogin from './kakao/KakaoLogin';

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
        <h1 className='header__logo'>
          <a href="/">
            <em></em>
            <span>Reviewing</span>
          </a>
        </h1>
        <div className='search-bar'>
          <input 
              type='search' 
              id='searchInput' 
              placeholder='검색어를 입력해주세요' 
              autoComplete='off' 
              className='searchinput' 
              onChange={e => setSearchKeyword(e.target.value)}
              onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
              }}
            />
          <button onClick={handleSearch}><CiSearch /></button>
        </div>
          <KakaoLogin />
      </div>
    </div>
  );
}

export default Header2;
