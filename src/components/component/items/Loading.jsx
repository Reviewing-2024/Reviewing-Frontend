import React from 'react'
import { FiLoader } from "react-icons/fi";

import Main from '../../section/main';

import '../../../assert/css/loading.css'

const Loading = () => {
    return (
        <Main>
            <div className="loading">
                <FiLoader />
                <div className='no-items'>강의를 불러오고 있습니다..</div>
            </div>
        </Main>
    )
}

export default Loading