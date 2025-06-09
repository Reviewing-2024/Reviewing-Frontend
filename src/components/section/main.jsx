import React, { useEffect } from 'react';
import axios from 'axios';
import "../../assert/layout.css";
import * as ChannelService from '@channel.io/channel-web-sdk-loader';

import { Helmet, HelmetProvider } from 'react-helmet-async'

const Main = ( props ) => {

    useEffect(() => {
        const initChannelTalk = async () => {
            const token = localStorage.getItem('Authorization');
            const storedName = localStorage.getItem('name');

            try {
                await ChannelService.shutdown();

                if (typeof window !== 'undefined') {
                    Object.keys(localStorage).forEach(key => {
                        if (key.startsWith('ch-') || key.startsWith('channel-')) {
                            localStorage.removeItem(key);
                        }
                    });
                    document.cookie.split(";").forEach(cookie => {
                        const eqPos = cookie.indexOf("=");
                        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
                        if (name.startsWith('ch-') || name.startsWith('channel-')) {
                            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
                            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
                        }
                    });
                }
                await new Promise(resolve => setTimeout(resolve, 100));

                await ChannelService.loadScript();

                if (token && storedName) {
                    const response = await axios.get(
                        `${process.env.REACT_APP_BASE_URL}/channelTalk/encode`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    const encodedMemberId = response.data;

                    await ChannelService.boot({
                        pluginKey: process.env.REACT_APP_CHANNEL_SECRET_KEY,
                        // memberId: encodedMemberId,
                        profile: {
                            name: storedName,
                        },
                        hideDefaultLauncher: false,
                    });
                } else {

                    await ChannelService.boot({
                        pluginKey: process.env.REACT_APP_CHANNEL_SECRET_KEY,
                        hideDefaultLauncher: false,
                    });
                }

            } catch (err) {
                console.error("채널톡 초기화 실패:", err);
            }
        };

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