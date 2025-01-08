import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { headerMenus, chatbot } from "../../data/header";
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

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BASE_URL}/platform/category`)
            .then(response => {
                setKeywordsToDisplay(response.data);
            })
            .catch(error => {
                console.error("카테고리 데이터 가져오기 실패:", error);
            });
    }, []);

    const handleKeywordClick = (keyword) => {
        const selectedMenu = headerMenus[activeIndex].title;
        const category = keyword.title;
        const url = `/courses/${selectedMenu}/${category}`;

        console.log(selectedMenu);
        console.log(category);

    
        axios.get(`${process.env.REACT_APP_BASE_URL}${url}`)
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

        const selectedPlatform = headerMenus[index].title;

        axios.get(`${process.env.REACT_APP_BASE_URL}/platform/category?platform=${selectedPlatform}`)
            .then(response => {
                setKeywordsToDisplay(response.data);
            })
            .catch(error => {
                console.error("카테고리 데이터 가져오기 실패:", error);
            });
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
            <div className='header__chatbot'>
                <ul>
                    {chatbot.map((chatbot, key) => (
                        <li key={key}>
                            <a href={chatbot.src}>
                                <span>{chatbot.icon} {chatbot.title}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </div> 
        </header>
    );
};

export default Header;
