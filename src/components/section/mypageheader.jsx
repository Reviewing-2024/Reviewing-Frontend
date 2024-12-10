import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import { user, category } from '../../data/review.js';
import { RiLogoutBoxRLine } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import '../../assert/css/mypageheader.css';

const Mypageheader = () => {
    const navigate = useNavigate();
    const [name, setName] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState('');

    useEffect(() => {
        const storedName = localStorage.getItem('name');
        if (storedName) {
            setName(storedName);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('name');
        localStorage.removeItem('Authorization');
        setName(null);
        navigate('/');
        window.location.reload();
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        setNewName(name || '');
    };

    const handleNicknameChange = async () => {
        try {
            const token = localStorage.getItem('Authorization');
            const response = await axios.post(
                '/my/nickname',
                { nickName: newName },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`,
                    },
                }
            );

            if (response.status === 200) {
                setName(newName);
                localStorage.setItem('name', newName);
                setIsEditing(false);
                alert('Nickname updated successfully!');
            } else {
                alert('Failed to update nickname.');
            }
        } catch (error) {
            console.error('Error updating nickname:', error);
            alert('닉네임 변경 중 오류가 발생 하였습니다.');
        }
    };

    return (
        <header id='mypageheader' role='banner'>
            <div className='mypageheader'>
                <img src={user.src} alt='img' />
                <div className='mypageheader-inner'>
                    {isEditing ? (
                        <div>
                            <input
                                type='text'
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder='Enter new nickname'
                            />
                            <button onClick={handleNicknameChange}>Save</button>
                            <button onClick={handleEditToggle}>Cancel</button>
                        </div>
                    ) : (
                        <a className='name'>{name}</a>
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
                <div className='edit'>
                    <span onClick={handleEditToggle}>
                        <FaRegEdit /> Edit
                    </span>
                </div>
            </div>
            <div className='logout'>
                <RiLogoutBoxRLine /> <p onClick={handleLogout}> Logout </p>
            </div>
        </header>
    );
};

export default Mypageheader;
