import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

const LoginHandeler = () => {
  const navigate = useNavigate();
  const code = new URL(window.location.href).searchParams.get("code");

  useEffect(() => {
    const kakaoLogin = async () => {
      await axios({
        method: "GET",
        url: `${process.env.REACT_APP_BASE_URL}/kakao/kakaoLogin/${code}`,
        headers: {
          "Content-Type": "application/json;charset=utf-8",
          "Access-Control-Allow-Origin": "*"
        },
      })
      .then((res) => {
        const token = res.headers.get('Authorization');
        const accessToken = token.replace('Bearer ', '');
        
        localStorage.setItem('Authorization', accessToken);
        localStorage.setItem('name', res.data.nickname); 
        navigate('/');     
        window.location.reload();
      });
    };
    kakaoLogin();
  });

  return (
    <div className="LoginHandeler">
      <div className="notice">
        <div className="spinner"></div>
      </div>
    </div>
  );
};

export default LoginHandeler;