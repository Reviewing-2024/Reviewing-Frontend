import React from 'react'
import "../../assert/layout.css";

import { Helmet, HelmetProvider } from 'react-helmet-async'

const Main = ( props ) => {
    return (
        <HelmetProvider>
            <Helmet 
                titleTemplate="%s | Reviewing" 
                defaultTitle="Reviewing" 
                defer={false}
            >
                {props.title && <title>{props.title}</title>}
                <meta name="description" content={props.description} />
            </Helmet>
        <main id="main" role="main">
            {props.children} 
        </main>
        </HelmetProvider>
    )
}

export default Main