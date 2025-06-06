import React, { useEffect } from 'react';
import "../../assert/layout.css";
import * as ChannelService from '@channel.io/channel-web-sdk-loader';

import { Helmet, HelmetProvider } from 'react-helmet-async'

const Main = ( props ) => {
    useEffect(() => {
        const initChannelTalk  = async()=>{
            try{
                const storedMemberId = localStorage.getItem('memberId');
                const storedName = localStorage.getItem('name');

                await ChannelService.loadScript()

            await ChannelService.boot({
                pluginKey: process.env.REACT_APP_CHANNEL_SECRET_KEY,
                //   "memberId": "USER_MEMBER_ID",
                profile: {
                    name: storedName,
                }
            });
            }catch(err){
                console.log(err)
            } 
        }

        initChannelTalk();

        return () => {
            ChannelService.shutdown();
            };
    }, []);

    

    

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