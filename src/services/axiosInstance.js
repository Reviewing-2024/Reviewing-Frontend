import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
});

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 600 && error.response?.data?.message === '토큰 만료') {
            handleLogout();
        }
        return Promise.reject(error);
    }
);

const handleLogout = () => {
    localStorage.removeItem('name');
    localStorage.removeItem('Authorization');
    alert('토큰이 만료되었습니다. 다시 로그인 해주세요.');
};

export default axiosInstance;