import React from 'react'
import "../../assert/layout.css";



const Main = ( props ) => {
    return (
        <main id="main" role="main">
            {props.children} 
        </main>
    )
}

export default Main