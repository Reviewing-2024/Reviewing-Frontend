import { FaRegBookmark } from "react-icons/fa";
import { GoCodeReview } from "react-icons/go";

export const review = [
    { 
        id: 1,
        user: 'User', 
        content: '정말 집에가고 싶은 강의네요.', 
        likes: 350 
    },
    { 
        id: 2,
        user: 'User', 
        content: '이번 강의는 마음에 들어요 다른 강의도 들어보고 싶어여', 
        status: 'wait',
        likes: 50 
    },
    { 
        id: 3,
        user: 'User', 
        content: '정말 형편없는 강의네요', 
        status: 'recognize',
        likes: 35 
    },
    { 
        id: 4,
        user: 'User', 
        content: '정말 좋은 강의네요', 
        status: 'refuse',
        likes: 70
    }
];

export const user = 
    { 
        name: 'junhyeon', 
        src: 'https://mblogthumb-phinf.pstatic.net/MjAyMDAyMTBfODAg/MDAxNTgxMzA0MTE3ODMy.ACRLtB9v5NH-I2qjWrwiXLb7TeUiG442cJmcdzVum7cg.eTLpNg_n0rAS5sWOsofRrvBy0qZk_QcWSfUiIagTfd8g.JPEG.lattepain/1581304118739.jpg?type=w800'
    };

    
    export const category = [
        {
            title: "작성한 리뷰",
            src: "/mypage",
            icon:<GoCodeReview />
        },
        {
            title: "찜한 강의",
            src: "/wishlist",
            icon:<FaRegBookmark />
        }
    ];
    
    
    export const review_category = [
        {
            title: "전체 리뷰",
            src: ""
        },
        {
            title: "검토중 리뷰",
            src: "/pending"
        },
        {
            title: "승인된 리뷰",
            src: "/approved"
        },
        {
            title: "거절된 리뷰",
            src: "/rejected"
        },
    ];