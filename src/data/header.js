import { IoLeaf } from "react-icons/io5";
import { BsCCircleFill } from "react-icons/bs";
import { SiUdemy } from "react-icons/si";
import { IoInfiniteSharp } from "react-icons/io5";
import { SiDota2 } from "react-icons/si";
import { SiNuxtdotjs } from "react-icons/si";
import { RiRobot2Fill } from "react-icons/ri";

import { AiFillGithub } from "react-icons/ai";
import { FaPinterest } from "react-icons/fa";
import { AiFillYoutube } from "react-icons/ai";
import { AiOutlineInstagram } from "react-icons/ai";

export const headerMenus = [
    {
        title: "인프런",
        icon: <IoLeaf />,
        src: "/inflearn",
        color: "#00c471"
    },
    {
        title: "패스트캠퍼스",
        icon: <SiDota2 />,
        src: "/fastcampus",
        color: "#D4003A" 
    },
    {
        title: "코드잇",
        icon: <BsCCircleFill />,
        src: "/codeit",
        color: "#93f" 
    },
    {
        title: "노마드코더",
        icon: <SiNuxtdotjs />,
        src: "/nomad",
        color: "#E0B800"
    },
    {
        title: "유데미",
        icon: <SiUdemy />,
        src: "/udemy",
        color: "#A435F0"
    },
    {
        title: "K-MOOC",
        icon: <IoInfiniteSharp />,
        src: "/kmooc",
        color: "#009488" 
    },
    // {
    //     title: "생활코딩",
    //     icon:  <BsCCircleFill />,
    //     src: "/spartacoding",
    //     color: "#666" 
    // }
];


export const chatbot = [
    {
        title: "강의 추천",
        icon: <RiRobot2Fill />,
        src: "/chatbot"
    }
];

export const snsLink = [
    {
        title: "github",
        url: "https://github.com/Reviewing-2024",
        icon: <AiFillGithub />
    },
    {
        title: "youtube",
        url: "https://www.youtube.com",
        icon: <AiFillYoutube />
    },
    {
        title: "Pinterest",
        url: "https://kr.pinterest.com/ideas/",
        icon: <FaPinterest />
    },
    {
        title: "instagram",
        url: "https://www.instagram.com",
        icon: <AiOutlineInstagram />
    }
];