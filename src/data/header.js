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
    {
        title: "생활코딩",
        icon:  <BsCCircleFill />,
        src: "/spartacoding",
        color: "#666" 
    },
    {
        title: "챗봇",
        icon: <RiRobot2Fill />,
        src: "/chatbot",
        color: "#88BAF7" 
    }
];

export const searchKeyword = [
    {
        title: "웹 개발",
        src: "/web-dev"
    },
    {
        title: "프론트엔드",
        src: "/front-end"
    },
    {
        title: "백엔드",
        src: "/back-end"
    }
];

export const fastKeyword = [
    {
        title: "프론트엔드 개발",
        src: "/front"
    },
    {
        title: "백엔드 개발",
        src: "/back"
    },
    {
        title: "모바일 앱 개발",
        src: "/app"
    },
    {
        title: "DevOps/Infra",
        src: "/devops"
    }
];

export const codeitKeyword = [
    {
        title: "프론트엔드",
        src: "/FRONTEND"
    },
    {
        title: "백엔드",
        src: "/BACKEND"
    },
    {
        title: "풀스텍",
        src: "/FULLSTACK"
    }
];

export const codingsite = [
    {
        title: "Programmers",
        icon: "https://cdn.discordapp.com/attachments/1300689286110253071/1316322569346879489/images.png?ex=675aa06c&is=67594eec&hm=e696728e9a6e009a446fb77e5fc0ad91004c32fca6ef8c3b544bd8028e8d0460&",
        src: "https://programmers.co.kr/"
    },
    {
        title: "LeetCode",
        icon: "https://cdn.discordapp.com/attachments/1300689286110253071/1316322568969388042/41718343.png?ex=675aa06c&is=67594eec&hm=cce761d23599a8b772a90cb42c1d9ce15805e1b26b6c43e2203ce5eeed860fc7&",
        src: "https://leetcode.com/problemset/"
    },
    {
        title: "BAEKJOON",
        icon: "https://cdn.discordapp.com/attachments/1300689286110253071/1316322935220338688/img.png?ex=675aa0c3&is=67594f43&hm=6db02ff04dd6f4f774af4908ff7422cb07865615cbd4aa4e7d0c9c12b9c326fe&",
        src: "https://www.acmicpc.net/"
    },
    {
        title: "CodeUp",
        icon: "https://cdn.discordapp.com/attachments/1300689286110253071/1316322935547625492/thumb.png?ex=675aa0c3&is=67594f43&hm=e46ff6c8c2eac220eb7150c20461219a04076889977a572352e32ca68d1ccdf5&",
        src: "https://codeup.kr/"
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