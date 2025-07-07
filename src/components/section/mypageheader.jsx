import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { category } from '../../data/review.js';
import { FaRegEdit } from "react-icons/fa";
import '../../assert/css/mypageheader.css';
import { useSelector } from 'react-redux';

const Mypageheader = () => {
    const [name, setName] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
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

    return (
        <header id='mypageheader' role='banner'>
            <div className='mypageheader'>
                <img src={`${userImg}`} alt='userimg' />
                <div className='mypageheader-inner'>
                    {isEditing ? (
                        <div>
                            <input
                                type='text'
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder='새 닉네임을 입력해주세요.'
                            />
                            <button onClick={handleNicknameChange}>Save</button>
                            <button onClick={handleEditToggle}>Cancel</button>
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
            <div className='mypageheader_menu'>
                <ul className='mypage-menu'>
                    {category.map((category, key) => (
                        <li key={key}>
                            <Link to={category.src}>
                                {category.icon} {category.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </header>
    );
};

export default Mypageheader;
