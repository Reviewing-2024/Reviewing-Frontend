import React from 'react';
import '../../../assert/kakao.css';
import { KAKAO_AUTH_URL } from './OAuth.js';


const KakaoLogin = () => {

  const handleLogin = ()=>{
    window.location.href = KAKAO_AUTH_URL
}

  return (
    <div>
      <p onClick={handleLogin} className="kakaobtn">
        <img src= '/img/kakao_login_medium_narrow.png' />
      </p>
    </div>
  );
};

export default KakaoLogin;
