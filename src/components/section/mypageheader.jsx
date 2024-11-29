import React, {useState, useEffect} from 'react'

import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { user, category } from '../../data/review.js'
import { RiLogoutBoxRLine } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";

import '../../assert/css/mypageheader.css'

const Mypageheader = () => {
    const navigate = useNavigate();
    const [name, setName] = useState(null);

    useEffect(() => {
        const storedName = localStorage.getItem('name');
        if (storedName) {
            setName(storedName);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('name');
        setName(null);
        navigate('/');
        window.location.reload();
    };


    return (
        <header id='mypageheader' role='banner'>
            <div className='mypageheader'>
                <img src={user.src} alt='img'/>
                <div className='mypageheader-inner'>
                    <a className='name'>{name}</a>
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
                    <span> <FaRegEdit />  Edit </span>
                </div> 
            </div>
            <div className='logout'>
                <RiLogoutBoxRLine /> <p onClick={handleLogout}> Logout </p>
            </div>
        </header>
    )
}

export default Mypageheader

