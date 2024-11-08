import React from 'react';
import '../../../assert/kakao.css';
import { KAKAO_AUTH_URL } from './OAuth.js';


const KakaoLogin = () => {

  const kakaoLoginButton = '/img/kakao_login_medium_narrow.png';

  return (
    <div>
      <a href={KAKAO_AUTH_URL} className="kakaobtn">
        <img src= { kakaoLoginButton } />
      </a>
    </div>
  );
};

export default KakaoLogin;
