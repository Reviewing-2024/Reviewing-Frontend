import { FaRegBookmark } from "react-icons/fa";
import { FaRegMessage } from "react-icons/fa6";

    
    export const category = [
        {
            title: "작성한 리뷰",
            src: "/mypage/all",
            icon:<FaRegMessage />
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
            src: "/all",
            color: "#004FDE"
        },
        {
            title: "검토중 리뷰",
            src: "/pending",
            color: "#F3DBB1"
        },
        {
            title: "승인된 리뷰",
            src: "/approved",
            color: "#B3D6B8"
        },
        {
            title: "거절된 리뷰",
            src: "/rejected",
            color: "#FF9393"
        },
    ];

    export const admin_category = [
        {
            title: "승인 요청",
            key: "pending"
        },
        {
            title: "승인 완료",
            key: "approved"
        },
        {
            title: "승인 거절",
            key: "rejected"
        }
    ];