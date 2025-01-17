import React, { useState } from 'react';

import "../../assert/layout.css";
import "../../assert/header2.css";

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
            <img className='logo' src='https://cdn.discordapp.com/attachments/1300689286110253071/1329773235880988683/image.png?ex=678b8f55&is=678a3dd5&hm=5d1132ad70d355cf38f05e1bdb25c9f61dcc180eb0e94d22bc9999e35a64ca34&'></img>
          </a>
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
          <button onClick={handleSearch}><IoIosSearch /></button>
        </div>
          <KakaoLogin />
      </div>
    </div>
  );
}

export default Header2;
