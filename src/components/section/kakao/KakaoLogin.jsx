import React, { useState, useEffect } from 'react';
import '../../../assert/kakao.css';
import { KAKAO_AUTH_URL } from './OAuth.js';
import { useNavigate } from 'react-router-dom';

const KakaoLogin = () => {
  const [name, setName] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem('name');
    if (storedName) {
      setName(storedName);
    }
  }, []);

  const handleLogin = () => {
    window.location.href = KAKAO_AUTH_URL;
  };
  
  const handleLogout = () => {
    localStorage.removeItem('name');
    setName(null);
    window.location.reload();
};
  
const handleNavigate = () => {
    navigate(`/mypage`);
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
          <img src="/img/kakao_login_medium_narrow.png" alt="Kakao Login" />
        </p>
      )}
    </div>
  );
};

export default KakaoLogin;
