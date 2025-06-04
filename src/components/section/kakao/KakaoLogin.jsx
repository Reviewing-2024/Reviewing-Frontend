import React, { useState, useEffect } from 'react';
import '../../../assert/kakao.css';
import { KAKAO_AUTH_URL } from './OAuth/OAuth.js';
import { useNavigate } from 'react-router-dom';

const KakaoLogin = () => {
  const [name, setName] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [imageSrc, setImageSrc] = useState('/img/kakao_login_medium_narrow.png');
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem('name');
    if (storedName) {
      setName(storedName);
    }

    const updateImage = () => {
      setImageSrc(
        window.innerWidth < 720 ? '/img/kakao_login_medium.png': '/img/kakao_login_medium_narrow.png'
      )  
    };

    updateImage();
    window.addEventListener('resize', updateImage);

    return () => {
      window.removeEventListener('resize', updateImage);
    };
  }, []);

  const handleLogin = () => {
    window.location.href = KAKAO_AUTH_URL;
  };
  
  const handleLogout = () => {
    localStorage.removeItem('name');
    localStorage.removeItem('Authorization');
    setName(null);
    navigate('/');
    window.location.reload();
};


  
const handleNavigate = () => {
    navigate('/mypage/all');
    setDropdownVisible(false);
  };

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  return (
    <div className="kakao-login">
      {name ? (
        <div className="name-container">
          <p onClick={toggleDropdown} className="name-display">
            {name}
          </p>
          {dropdownVisible && (
            <div className="dropdown-menu">
              <button onClick={handleNavigate}>My Page</button>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
      ) : (
        <p onClick={handleLogin} className="kakaobtn">
          <img src={imageSrc} alt="Kakao Login" />
        </p>
      )}
    </div>
  );
};

export default KakaoLogin;
