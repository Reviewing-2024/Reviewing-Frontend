import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { headerMenus, searchKeyword, fastKeyword, codeitKeyword, snsLink, codingsite } from "../../data/header";
import { Link } from 'react-router-dom';
import axios from 'axios';
import "../../assert/header.css";

const Header = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [activeKeywordIndex, setActiveKeywordIndex] = useState(null);
    const [keywordsToDisplay, setKeywordsToDisplay] = useState(null);
    const [hoverIndex, setHoverIndex] = useState(null);
    const [coursesData, setCoursesData] = useState([]);
    const navigate = useNavigate();

    const handleKeywordClick = (keyword) => {
        const selectedMenu = headerMenus[activeIndex].title;
        const category = keyword.title;
        const url = `/courses/${selectedMenu}/${category}`;

        console.log(selectedMenu);
        console.log(category);

    
        axios.get(`http://localhost:8080${url}`)
            .then(response => {
                setCoursesData(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error("데이터 가져오기 실패:", error);
            });

        navigate(url);
    };

    const handleMenuClick = (index) => {
        setActiveIndex(index);
        setActiveKeywordIndex(null);

        if (index === 0) {
            setKeywordsToDisplay(searchKeyword);
        } else if (index === 1) {
            setKeywordsToDisplay(fastKeyword);
        } else if (index === 2) {
            setKeywordsToDisplay(codeitKeyword);
        } else {
            setKeywordsToDisplay(null);
        }
    };

    const handleMouseEnter = (index) => {
        setHoverIndex(index);
    };

    const handleMouseLeave = () => {
        setHoverIndex(null);
    };

    return (
        <header id='header' role='banner'>
            <div className='header__menu'>
                <ul className='menu'>
                    {headerMenus.map((menu, key) => (
                        <li
                            key={key}
                            className={activeIndex === key || hoverIndex === key ? 'active' : ''}
                            onClick={() => handleMenuClick(key)}
                            onMouseEnter={() => handleMouseEnter(key)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <Link
                                to={menu.src}
                                style={{
                                    color: activeIndex === key || hoverIndex === key ? menu.color : '#000',
                                    borderColor: activeIndex === key || hoverIndex === key ? menu.color : 'transparent',
                                }}
                            >
                                <div>{menu.icon}</div>
                                <div className='menu-title'>{menu.title}</div>
                            </Link>
                        </li>
                    ))}
                </ul>

                {keywordsToDisplay && (
                    <div className='header__keyword'>
                        <ul className='keyword'>
                            {keywordsToDisplay.map((keyword, key) => (
                                <li
                                    key={key}
                                    className={activeKeywordIndex === key ? 'active' : ''}
                                    onClick={() => {
                                        setActiveKeywordIndex(key);
                                        handleKeywordClick(keyword); 
                                    }}
                                >
                                    <span># {keyword.title}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            <div className="header__codingsite">
                <h2>관련 사이트</h2>
                <ul className="codingsite">
                    {codingsite.map((codingsite, key) => (
                        <li key={key}>
                            <Link target="_blank" to={codingsite.src}>       
                                <img  src= {codingsite.icon} /> 
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div className='header__sns'>
            <h2>SNS</h2>
                <ul>
                    {snsLink.map((sns, key) => (
                        <li key={key}>
                            <a href={sns.url} target="_blank" rel="noopener noreferrer" aria-label={sns.title}>
                                <span>{sns.icon}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </header>
    );
};

export default Header;
