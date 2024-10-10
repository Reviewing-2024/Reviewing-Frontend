import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import '../../assert/css/LoginRegister.css';
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import { MdClear } from "react-icons/md";

const LoginRegister = () => {

    const [action, setAction] = useState('');
    const navigate = useNavigate();

    const registerLink = () => {
        setAction(' active');
    };
   
    const loginLink = () => {
        setAction('');
    };

    const Back = () => {
        navigate(-1);  
    };


    return(
        <div className={'login-register-wrapper'}>
            <a className="back-button" onClick={Back}>
                <MdClear />
            </a>
            <div className={`wrapper${action}`}>
                <div className="form-box login">
                    <form action="">
                        <h1>로그인</h1>
                        <div className="input-box">
                            <input type="text"
                            placeholder="Usename" required />
                            <FaUser className="icon"/>
                        </div>
                        <div className="input-box">
                            <input type="password"
                            placeholder="Password" required />
                            <FaLock className="icon"/>
                        </div>

                        <button type="submit">로그인</button>

                        <div className="register-link">
                            <p>아이디가 없으시다면? <a href="#" onClick={registerLink}>회원가입</a></p>
                        </div>

                    </form>
                </div>

                <div className="form-box register">
                    <form action="">
                        <h1>회원가입</h1>
                        <div className="input-box">
                            <input type="text"
                            placeholder="Usename" required />
                            <FaUser className="icon"/>
                        </div>
                        <div className="input-box">
                            <input type="email"
                            placeholder="Email" required />
                            <FaEnvelope className="icon"/>
                        </div>
                        <div className="input-box">
                            <input type="password"
                            placeholder="Password" required />
                            <FaLock className="icon"/>
                        </div>

                        <button type="submit">가입하기</button>

                        <div className="register-link">
                            <p>이미 회원이시라면? <a href="#" onClick={loginLink}>로그인</a></p>
                        </div>

                    </form>
                </div>

            </div>
        </div>
    )
}

export default LoginRegister;
