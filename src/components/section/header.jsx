import React, { useState } from 'react';
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


    const handleKeywordClick = (keyword) => {
        const platform = headerMenus[activeIndex].title;
        const category = keyword.category;
        const url = `/courses/${platform}/${category}`;

            navigate(url);
       
    };

    const handleMenuClick = (index) => {
        setActiveIndex(index);
        setActiveKeywordIndex(null);

        const platform = headerMenus[index].title;

         console.log(platform)

        axios.get(`${process.env.REACT_APP_BASE_URL}/platform/category?platform=${platform}`)
            .then(response => {
                setKeywordsToDisplay(response.data);
                console.log(response)
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

                {keywordsToDisplay && keywordsToDisplay.length > 0 && (
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
                                    <span># {keyword.category}</span>
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
