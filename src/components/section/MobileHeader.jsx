import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { headerMenus } from "../../data/header";
import { IoIosSearch } from "react-icons/io";
import { IoMenu, IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../assert/layout.css";
import "../../assert/mobileheader.css";
import KakaoLogin from "./kakao/KakaoLogin";

const MobileHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMenuIndex, setActiveMenuIndex] = useState(null);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(null);
  const [categoriesToDisplay, setCategoriesToDisplay] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchInput) {
      navigate(`/search/${searchInput}`);
      setSearchInput("");
      setIsMenuOpen(false);
    }
  };

  const handleCategoryClick = (category) => {
    const platform = headerMenus[activeMenuIndex].title;
    const categorySlug = category.slug;
    const url = `/courses/${platform}/${categorySlug}`;
    navigate(url);
    setIsMenuOpen(false);
  };

  const handleMenuClick = (index) => {
    setActiveMenuIndex(index);
    setActiveCategoryIndex(null);
    const platform = headerMenus[index].title;
    axios.get(`${process.env.REACT_APP_BASE_URL}/platform/category?platform=${platform}`)
      .then(response => {
        setCategoriesToDisplay(response.data);
      });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className='mobile-header-container'>
        <div className="mobile-header-content">
            <a
            className="hamburger-button"
            onClick={toggleMenu}
            >
            {isMenuOpen ? <IoClose size={35} /> : <IoMenu size={35} />}
            </a>
            <a className='header__logo' href="/">
              <img className='logo' src='/img/Logo1.png'></img>
            </a>
            <KakaoLogin />
        </div>
        <div className={`mobile-header${isMenuOpen ? 'active' : ''}`}>  
            <div className="mobile-header-top">
                <div className='mobile-search-bar'>
                <input 
                    type='search' 
                    placeholder='검색어를 입력해주세요.' 
                    autoComplete='off' 
                    className='mobile-search-input' 
                    onChange={e => setSearchInput(e.target.value)}
                    onKeyDown={e => {
                    if (e.key === 'Enter') {
                        handleSearch();
                    }
                    }}
                />
                <button onClick={handleSearch}><IoIosSearch /></button>
                </div>
            </div>
            <div className='mobile-menu-container'>
                <ul className='mobile-menu'>
                {headerMenus.map((menu, key) => (
                    <li
                    key={key}
                    className={activeMenuIndex === key ? 'active' : ''}
                    onClick={() => handleMenuClick(key)}
                    >
                    <Link to={menu.src}
                    style={{
                        color: activeMenuIndex === key ? menu.color : '#000',
                    }}
                    >
                        <div>{menu.icon}</div>
                        <div className='mobile-menu-title'>{menu.title}</div>
                    </Link>
                    </li>
                ))}
                </ul>
                {categoriesToDisplay && categoriesToDisplay.length > 0 && (
                <div className='mobile-category-container'>
                    <ul className='mobile-category-list'>
                    {categoriesToDisplay.map((category, key) => (
                        <li
                        key={key}
                        className={activeCategoryIndex === key ? 'active' : ''}
                        onClick={() => handleCategoryClick(category)}
                        >
                        <span>
                            # {category.category}
                        </span>
                        </li>
                    ))}
                    </ul>
                </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default MobileHeader;