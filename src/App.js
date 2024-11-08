import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

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
import Search from './components/pages/search';
import Detail from './components/pages/detail';
import LoginHandeler from './components/section/kakao/LoginHandeler';
 
const App = () => {
    return (
        <BrowserRouter>
            <Header2 />
            <Header />
            <Main>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/inflearn' element={<Inflearn />} />   
                    <Route path="/inflearn/:genre" element={<InflearnGenre />} />
                    <Route path='/nomad' element={<Nomad />} />
                    <Route path='/codeit' element={<Codeit />} />
                    <Route path='/udemy' element={<Udemy />} />
                    <Route path='/fastcampus' element={<Fastcampus />} />
                    <Route path='/kmooc' element={<Kmooc />} />
                    <Route path='/spartacoding' element={<Spartacoding />} />
                    <Route path='/search' element={<Search />} />
                    <Route path='/detail/:id' element={<Detail />} />
                    <Route path="/login/callback/kakao" element={<LoginHandeler />} />
                </Routes>
            </Main>
            <Footer />
        </BrowserRouter>
    );
}

export default App;