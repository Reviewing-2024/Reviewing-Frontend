import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header2 from './components/section/header2';
import Header from './components/section/header';   
import Main from './components/section/main';       
import Footer from './components/section/footer';   

import Home from './components/pages/home';
import Inflearn from './components/pages/inflearn';
import Coddingapple from './components/pages/coddingapple';
import Codeit from './components/pages/codeit';
import Youtube from './components/pages/youtube';
import User from './components/pages/user';
import Search from './components/pages/search';
import Detail from './components/pages/detail';
 
const App = () => {
    return (
        <BrowserRouter>
            <Header2 />
            <Header />
            <Main>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/inflearn' element={<Inflearn />} />
                    <Route path='/coddingapple' element={<Coddingapple />} />
                    <Route path='/codeit' element={<Codeit />} />
                    <Route path='/youtube' element={<Youtube />} />
                    <Route path='/user' element={<User />} />
                    <Route path='/search' element={<Search />} >
                        <Route path='security' element={<div>security</div>} />
                        <Route path='chatGPT' element={<div>chatGPT</div>} />
                        <Route path='python' element={<div>python</div>} />
                        <Route path='uxui' element={<div>uxui</div>} />
                        <Route path='data' element={<div>data</div>} />
                    </Route>
                    <Route path='/detail/:id' element={<Detail />} />
                </Routes>
            </Main>
            <Footer />
        </BrowserRouter>
    );
}

export default App;