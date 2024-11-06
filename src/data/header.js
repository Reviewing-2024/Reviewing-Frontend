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
        src: "/inflearn",
        color: "#00c471"
    },
    {
        title: "노마드코더",
        icon: <FaAppleAlt />,
        src: "/nomad",
        color: "#dc143c"
    },
    {
        title: "유데미",
        icon: <BsCCircleFill />,
        src: "/udemy",
        color: "#93f"
    },
    {
        title: "패스트 캠퍼스",
        icon: <IoLogoYoutube />,
        src: "/fastcampus",
        color: "#c4302b" 
    },
    {
        title: "코드잇",
        icon: <BsCCircleFill />,
        src: "/codeit",
        color: "#93f" 
    },
    {
        title: "K-MOOC",
        icon: <IoLogoYoutube />,
        src: "/kmooc",
        color: "#c4302b" 
    },
    {
        title: "생활코딩",
        icon: <IoLogoYoutube />,
        src: "/spartacoding",
        color: "#c4302b" 
    }
];

export const searchKeyword = [
    {
        title: "프론트엔드",
        src: "/frontend"
    },
    {
        title: "백엔드",
        src: "/backend"
    },
    {
        title: "풀스택",
        src: "/fullstack"
    },
    {
        title: "모바일 앱 개발",
        src: "/mobileapp"
    },
    {
        title: "데이터베이스",
        src: "/database"
    },
    {
        title: "게임 개발",
        src: "/game"
    },
    {
        title: "데브옵스-인프라",
        src: "/infra"
    },
    {
        title: "기타",
        src: "/etc"
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
    }
];
