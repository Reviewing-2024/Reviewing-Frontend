const CLIENT_ID = '17fa1c8ab14338d7f24aa606b004d50f';
const REDIRECT_URI = 'http://localhost:3000/login/callback/kakao';

export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;