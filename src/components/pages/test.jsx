import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TokenTest = () => {
  const [token, setToken] = useState('');
  const [tokenValid, setTokenValid] = useState(false);

  // 토큰 가져오기
  useEffect(() => {
    const storedToken = localStorage.getItem('Authorization');
    setToken(storedToken || '토큰이 저장되어 있지 않습니다.');
  }, []);

  // 토큰 유효성 확인
  const validateToken = async () => {
    try {
      const response = await axios.get('http://localhost:8080/auth/validate-token', {
        headers: { Authorization: token },
      });
      setTokenValid(true);
      toast.success('토큰이 유효합니다.');
      console.log('토큰 유효성 확인 성공:', response.data);
    } catch (error) {
      setTokenValid(false);
      toast.error('토큰이 유효하지 않습니다.');
      console.error('토큰 유효성 확인 실패:', error);
    }
  };

  return (
    <div className="token-test-page">
      <header>
        <h1>토큰 테스트</h1>
      </header>

      <main>
        <div className="token-info">
          <h3>저장된 토큰:</h3>
          <p>{token}</p>
          <button onClick={validateToken} className="btn btn-secondary">
            토큰 유효성 확인
          </button>
          {tokenValid ? (
            <p className="token-status success">토큰이 유효합니다.</p>
          ) : (
            <p className="token-status error">토큰이 유효하지 않습니다.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default TokenTest;
