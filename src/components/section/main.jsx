import React, { useEffect } from 'react';
import axios from 'axios';
import "../../assert/layout.css";
import * as ChannelService from '@channel.io/channel-web-sdk-loader';

import { Helmet, HelmetProvider } from 'react-helmet-async'

const Main = (props) => {

    useEffect(() => {
        const initChannelTalk = async () => {
            const token = localStorage.getItem('Authorization');
            const storedName = localStorage.getItem('name');
            const storedId = localStorage.getItem('memberId');

            try {
                await ChannelService.shutdown();


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
                        memberId: storedId,
                        memberHash: encodedMemberId,
                        profile: {
                            name: storedName,
                            memberId: encodedMemberId,
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