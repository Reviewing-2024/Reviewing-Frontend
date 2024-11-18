const CLIENT_ID = 'd26937892e29ab2a2d1e0c036e2e7f36';
const REDIRECT_URI = 'http://localhost:3000/login/callback/kakao';

export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;