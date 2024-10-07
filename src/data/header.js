import { IoLeaf } from "react-icons/io5";
import { IoLogoYoutube } from "react-icons/io";
import { FaAppleAlt } from "react-icons/fa";
import { BsCCircleFill } from "react-icons/bs";

import { AiFillGithub } from "react-icons/ai";
import { FaPinterest } from "react-icons/fa";
import { AiFillYoutube } from "react-icons/ai";
import { AiOutlineInstagram } from "react-icons/ai";

export const headerMenus = [
    {
        title: "인프런",
        icon: <IoLeaf />,
        src: "/inflearn"
    },
    {
        title: "코딩 애플",
        icon: <FaAppleAlt />,
        src: "/coddingapple"
    },
    {
        title: "코드잇",
        icon: <BsCCircleFill />,
        src: "/codeit"
    },
    {
        title: "Youtube",
        icon: <IoLogoYoutube />,
        src: "/youtube"
    }
    
];

export const searchKeyword = [
    {
        title: "보안",
        src: "/search/security"
    },
    {
        title: "chatGPT",
        src: "/search/chatGPT"
    },
    {
        title: "파이썬",
        src: "/search/python"
    },
    {
        title: "UX / UI",
        src: "/search/uxui"
    },
    {
        title: "데이터",
        src: "/search/data"
    }
    
];

export const snsLink = [
    {
        title: "github",
        url: "https://github.com",
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
    },
]