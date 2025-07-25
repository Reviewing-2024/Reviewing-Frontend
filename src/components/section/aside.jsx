import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { headerMenus, chatbotdata } from "../../data/aside";
import { MdClear } from "react-icons/md";
import { Link } from 'react-router-dom';
import axios from 'axios';

import "../../assert/aside.css";

import Chatbot from "../pages/chatbot/Chatbot";

const Header = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [activeKeywordIndex, setActiveKeywordIndex] = useState(null);
    const [keywordsToDisplay, setKeywordsToDisplay] = useState(null);
    const [hoverIndex, setHoverIndex] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const navigate = useNavigate();


    const handleKeywordClick = (keyword) => {
        const platform = headerMenus[activeIndex].title;
        const category = keyword.slug;
        const url = `/courses/${platform}/${category}`;

        navigate(url);

    };

    const handleMenuClick = (index) => {
        setActiveIndex(index);
        setActiveKeywordIndex(null);

        const platform = headerMenus[index].title;

        axios.get(`${process.env.REACT_APP_BASE_URL}/platform/category?platform=${platform}`)
            .then(response => {
                setKeywordsToDisplay(response.data);
            })
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
                                    borderColor: activeIndex === key || hoverIndex === key ? '#000' : 'transparent',
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
                    {chatbotdata.map((chatbot, key) => (
                        <li key={key}>
                            <a onClick={() => setOpenModal(true)}>
                                <span>{chatbot.icon} {chatbot.title}</span>
                            </a>
                        </li>
                    ))}
                </ul>
                {openModal && (
                    <div className="chatbot-overlay">
                        <div className="chatbot-content" onClick={(e) => e.stopPropagation()}>
                            <Chatbot />
                            <button onClick={() => setOpenModal(false)}><MdClear /></button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
