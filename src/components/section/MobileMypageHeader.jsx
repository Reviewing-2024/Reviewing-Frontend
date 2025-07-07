import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { category } from '../../data/review.js';
import { FaRegEdit } from "react-icons/fa";
import { IoMenu, IoClose } from "react-icons/io5";
import '../../assert/css/mypageheader.css';
import '../../assert/css/mobilemypageheader.css'
import KakaoLogin from "./kakao/KakaoLogin";

const MobileMypageHeader = () => {
    const [name, setName] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [newName, setNewName] = useState('');

    let userImg = useSelector((state) => state.img)

    useEffect(() => {
        const storedName = localStorage.getItem('name');
        if (storedName) {
            setName(storedName);
        }
    }, []);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        setNewName(name || '');
    };

    const handleNicknameChange = async () => {
        try {
            const token = localStorage.getItem('Authorization');
            const response = await axios.put(
                `${process.env.REACT_APP_BASE_URL}/my/nickname`,
                { nickName: newName },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                setName(newName);
                localStorage.setItem('name', newName);
                setIsEditing(false);
                window.location.reload();
                alert('닉네임 변경에 성공하였습니다!');
            } else {
                alert('닉네임 변경에 실패하였습니다.');
            }
        } catch (error) {
            alert('닉네임 변경 중 오류가 발생 하였습니다.');
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header id='mobilemypageheader' role='banner'>
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
            <div className={`mobilemypageheader${isMenuOpen ? 'active' : ''}`}>
                <div className='mobilemypageheader-content'>
                    <img src={`${userImg}`} alt='userimg' />
                    <div className='mobilemypageheader-inner'>
                        {isEditing ? (
                            <div>
                                <input
                                    type='text'
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder='새 닉네임을 입력해주세요.'
                                />
                                <button onClick={handleNicknameChange}>저장</button>
                                <button onClick={handleEditToggle}>취소</button>
                            </div>
                        ) : (
                            <div>
                                <a className='name'>{name} </a>
                                <span className='edit' onClick={handleEditToggle}>
                                    <FaRegEdit />
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                <div className='mobilemypageheader_menu'>
                    <ul className='mobilemypage-menu'>
                        {category.map((category, key) => (
                            <li key={key}>
                                <Link to={category.src}>
                                    {category.icon} {category.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </header>
    );
};

export default MobileMypageHeader;
