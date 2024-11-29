import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { headerMenus, searchKeyword, snsLink } from "../../data/header";
import { Link } from 'react-router-dom';
import "../../assert/header.css";

const Header = () => {
    const [activeIndex, setActiveIndex] = useState(null);
    const [hoverIndex, setHoverIndex] = useState(null);
    const [activeKeywordIndex, setActiveKeywordIndex] = useState(null);
    const navigate = useNavigate();

    const handleKeywordClick = (keyword) => {
        if (activeIndex !== null) {
            const selectedMenu = headerMenus[activeIndex].src;
            navigate(`${selectedMenu}/${keyword}`);
        } else {
            navigate(`/${keyword}`);
        }
    };

    return (
        <header id='header' role='banner'>
            <div className='header__menu'>
                <ul className='menu'>
                    {headerMenus.map((menu, key) => (
                        <li
                            key={key}
                            className={activeIndex === key || hoverIndex === key ? 'active' : ''}
                            onClick={() => {
                                setActiveIndex(key);
                                setActiveKeywordIndex(null);
                            }}
                            onMouseEnter={() => setHoverIndex(key)}
                            onMouseLeave={() => setHoverIndex(null)}
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
                <div className='header__keyword'>
                    <ul className='keyword'>
                        {searchKeyword.map((keyword, key) => (
                            <li
                                key={key}
                                className={activeKeywordIndex === key ? 'active' : ''}
                                onClick={() => {
                                    setActiveKeywordIndex(key);
                                    handleKeywordClick(keyword.src.split('/').pop());
                                }}
                            >
                                <span># {keyword.title}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className='header__sns'>
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
