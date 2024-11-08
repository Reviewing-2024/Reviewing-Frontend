import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";

const LoginHandeler = (props) => {
  const navigate = useNavigate();
  const code = new URL(window.location.href).searchParams.get("code");

  console.log(code); 

//인가코드 백으로 보내는 코드
  useEffect(() => {
    const kakaoLogin = async () => {
      await axios({
        method: "GET",
        url: `http://localhost:8080/kakao/kakaoLogin/${code}`,
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
      }).then((res) => {
        console.log(res);
        localStorage.setItem("name", res.data.account.kakaoName);
        navigate(-1);
      });
    };
    kakaoLogin();
  }, [props.history]);

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