import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

const LoginHandeler = () => {
  const navigate = useNavigate();
  const code = new URL(window.location.href).searchParams.get("code");

  console.log(code); 

  useEffect(() => {
    const kakaoLogin = async () => {
      await axios({
        method: "GET",
        url: `http://localhost:8080/kakao/kakaoLogin/${code}`,
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "Access-Control-Allow-Origin": "*"
        },
      })
      .then((res) => {
        console.log(res);
        let token = res.headers.get('Authorization');
        console.log(token); 
        
        localStorage.setItem('Authorization', token);
        localStorage.setItem('name', res.data.nickname); 
        navigate(-1);     
      });
    };
    kakaoLogin();
  });

  return (
    <div className="LoginHandeler">
      <div className="notice">
        <p>로그인 중입니다.</p>
        <p>잠시만 기다려주세요.</p>
        <div className="spinner"></div>
      </div>
    </div>
  );
};

export default LoginHandeler;