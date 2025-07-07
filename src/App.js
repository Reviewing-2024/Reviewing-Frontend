import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import './assert/layout.css';
import './assert/css/loading.css';

import Aside from './components/section/aside';
import Footer from './components/section/footer';
import ResponsiveHeader from './components/section/ResponsiveHeader';

import Home from './components/pages/home';
import Inflearn from './components/pages/inflearn';
import CoursesPage from './components/pages/coursesPage';
import Nomad from './components/pages/nomad';
import Codeit from './components/pages/codeit';
import Udemy from './components/pages/udemy';
import Fastcampus from './components/pages/fastcampus';
import Kmooc from './components/pages/kmooc';
import LoginHandeler from './components/section/kakao/LoginHandeler';
import Reviews from './components/pages/reviews';
import Search from './components/section/search';
import Mypagestatus from './components/pages/mypage/mypagestatus';
import Wishlist from './components/pages/mypage/wishlist';

import Loading from './components/component/items/Loading';

const AdminPage = lazy(() => import('./components/pages/AdminPage'));


const Layout = () => {
    const location = useLocation();
    const hideHeaderPaths = ['/wishlist', '/mypage/all', '/mypage/pending', '/mypage/approved', '/mypage/rejected'];
    return (
        <>
            {!hideHeaderPaths.includes(location.pathname) && <ResponsiveHeader />}
            {!hideHeaderPaths.includes(location.pathname) && <Aside />}
            <Suspense fallback={<Loading />} >
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/inflearn' element={<Inflearn />} />
                    <Route path="/courses/:platform/:category" element={<CoursesPage />} />
                    <Route path='/nomad' element={<Nomad />} />
                    <Route path='/codeit' element={<Codeit />} />
                    <Route path='/udemy' element={<Udemy />} />
                    <Route path='/fastcampus' element={<Fastcampus />} />
                    <Route path='/kmooc' element={<Kmooc />} />
                    <Route path='/search/:searchKeyword' element={<Search />} />
                    <Route path='/login/callback/kakao' element={<LoginHandeler />} />
                    <Route path='/wishlist' element={<Wishlist />} />
                    <Route path="/mypage/:status" element={<Mypagestatus />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path='/reviews/:slug' element={<Reviews />} />
                    <Route path="/*" element={<div className='no-items'> 404 error </div>} />
                </Routes>
            </Suspense>
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
