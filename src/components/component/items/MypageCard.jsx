import { useState } from "react";
import { BsCircleFill } from "react-icons/bs";
import { FaThumbsDown, FaThumbsUp, FaExternalLinkAlt, FaRegTrashAlt } from "react-icons/fa";

const MypageCard = ({ review, handleCourseClick, onDeleteRequest  }) => {

        return (
            <div className='review-card'>
                <div className="myreview-content">
                    <div className='myreview-top'>
                        <span
                            className='myreview-title'
                            onClick={() => handleCourseClick(review)}
                            style={{ cursor: 'pointer' }}
                        >
                            {review.courseTitle} <FaExternalLinkAlt />
                        </span>
                        <span className={`status ${review.status.toLowerCase()}`}>
                            <BsCircleFill />
                        </span>
                    </div>
                    <p className='content'>{review.contents}</p>
                    <div className="review-metadata">
                        <span className='createdAt'>{review.createdAt}</span>
                        <span><FaThumbsUp /> {review.likes}</span>
                        <span><FaThumbsDown /> {review.dislikes}</span>
                        <span className="rating">
                            <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                <path fill="#FDCC0E" fillRule="evenodd" d="M8 1.3c.133 0 .263.037.375.108.113.07.203.17.262.29l1.778 3.637 3.978.583c.131.02.254.075.355.161.101.086.176.199.217.326.041.126.046.262.014.392-.031.13-.098.247-.193.34l-2.878 2.831.68 3.996c.022.131.007.267-.042.39-.05.124-.133.23-.24.31-.107.078-.234.125-.366.134-.132.01-.263-.018-.38-.08L8 12.831l-3.558 1.887c-.117.062-.248.09-.38.08-.132-.01-.259-.056-.365-.134-.107-.079-.19-.186-.24-.31-.05-.123-.065-.258-.043-.39l.68-3.997-2.88-2.83c-.094-.093-.161-.21-.193-.34-.032-.13-.027-.266.014-.393.04-.127.116-.24.217-.326.102-.086.225-.142.356-.16l3.978-.583 1.779-3.637c.059-.12.15-.22.262-.29.112-.07.242-.108.374-.108z" clipRule="evenodd" />
                            </svg>
                            {review.rating}
                        </span>
                        <span className='review-delete'>
                            <FaRegTrashAlt onClick={() => onDeleteRequest(review)} style={{ cursor: 'pointer' }} />
                        </span>
                    </div>
                    {review.status === "REJECTED" && (
                        <div className='rejectionReason'>
                            거절 사유: {review.rejectionReason}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    export default MypageCard;
    