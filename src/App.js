import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import './assert/layout.css';
import Header2 from './components/section/header2';
import Header from './components/section/header';
import Main from './components/section/main';
import Footer from './components/section/footer';

import Home from './components/pages/home';
import Inflearn from './components/pages/inflearn';
import InflearnGenre from './components/pages/inflearnGenre';
import Nomad from './components/pages/nomad';
import Codeit from './components/pages/codeit';
import Udemy from './components/pages/udemy';
import Fastcampus from './components/pages/fastcampus';
import Kmooc from './components/pages/kmooc';
import Spartacoding from './components/pages/spartacoding';
import Search from './components/section/search';
import Detail from './components/pages/detail';
import LoginHandeler from './components/section/kakao/LoginHandeler';
import Mypage from './components/pages/mypage/mypage';
import Wishlist from './components/pages/mypage/wishlist';
import MypageStatus from './components/pages/mypage/mypagestatus';
import Chatbot from './components/pages/Chatbot';


const Layout = () => {
    const location = useLocation();
    const hideHeaderPaths = ['/mypage', '/wishlist', '/mypage/', '/mypage/wait', '/mypage/recognize', '/mypage/refuse' ];

    return (
        <>
            <Header2 />
            {!hideHeaderPaths.includes(location.pathname) && <Header />}
            
            <Main>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/inflearn' element={<Inflearn />} />
                    <Route path='/inflearn/:genre' element={<InflearnGenre />} />
                    <Route path='/nomad' element={<Nomad />} />
                    <Route path='/codeit' element={<Codeit />} />
                    <Route path='/udemy' element={<Udemy />} />
                    <Route path='/fastcampus' element={<Fastcampus />} />
                    <Route path='/kmooc' element={<Kmooc />} />
                    <Route path='/spartacoding' element={<Spartacoding />} />
                    <Route path='/search/:searchKeyword' element={<Search />} />
                    <Route path='/detail/:id' element={<Detail />} />
                    <Route path='/login/callback/kakao' element={<LoginHandeler />} />
                    <Route path='/mypage' element={<Mypage />} />
                    <Route path='/wishlist' element={<Wishlist />} />
                    <Route path="/mypage/:status" element={<MypageStatus />} />
                    <Route path="/chatbot" element={<Chatbot />} />
                </Routes>
            </Main>
            <Footer />
        </>

    );
};

const App = () => {
    return (
        <BrowserRouter>
            <Layout />
        </BrowserRouter>
    );
};

export default App;
