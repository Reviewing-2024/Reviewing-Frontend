import React, { useState } from 'react';

import { headerMenus, searchKeyword, snsLink } from "../../data/header";
import { Link } from 'react-router-dom';

import "../../assert/layout.css";
import "../../assert/header.css";


const Header = () => {

    const [activeIndex, setActiveIndex] = useState(null);
    const [activeKeywordIndex, setActiveKeywordIndex] = useState(null);


    return (
        <header id='header' role='banner'>
            <div className='header__menu'>
                <ul className='menu'>
                    {headerMenus.map((menu, key) => (
                        <li key={key} className={activeIndex === key ? 'active' : ''}
                            onClick={() => {
                                setActiveIndex(key);
                                setActiveKeywordIndex(null);
                            }}>
                            <Link to={menu.src}>
                                <div>{menu.icon}</div> <div className='menu-title'>{menu.title}</div>
                            </Link>
                        </li>
                    ))}
                </ul>
                <div className='header__keyword'>
                <ul className='keyword'>
                    {searchKeyword.map((keyword, key) => (
                         <li key={key} className={activeKeywordIndex === key ? 'active' : ''}
                            onClick={() => {
                                setActiveKeywordIndex(key);
                                setActiveIndex(null);
                                }}>
                            <Link to={keyword.src}>
                                # {keyword.title}
                            </Link>
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
    )
}

export default Header