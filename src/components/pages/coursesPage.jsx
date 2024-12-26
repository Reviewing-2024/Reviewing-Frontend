import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const CoursesPage = () => {
    const location = useLocation();
    const [coursesData, setCoursesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortCriteria, setSortCriteria] = useState('fundamental');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const platform = location.pathname.split('/')[2];
                const category = location.pathname.split('/')[3];

                const response = await axios.get(
                    `http://localhost:8080/courses/${platform}/${category}?sort=${sortCriteria}`
                );

                setCoursesData(response.data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setError("데이터를 가져오는 데 실패했습니다.");
                setLoading(false);
            }
        };

        fetchCourses();
    }, [location.pathname, sortCriteria]);

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <section id='inflearn'>
            <div className="sort-dropdown">
                <select onChange={(e) => setSortCriteria(e.target.value)} value={sortCriteria}>
                    <option value="fundamental">기본 순</option>
                    <option value="rating">별점 높은 순</option>
                    <option value="comments">리뷰 많은 순</option>
                </select>
            </div>
            
            <div className='inflearn__inner'>
                {coursesData.map(item => (
                    <div key={item.id} className='item'>
                        <div className='item-inner'>
                            <Link className='item-title' to={`/reviews/${item.id}`} state={{ item }}>
                                {item.thumbnailImage ? (
                                    <img src={item.thumbnailImage} alt={item.title} />
                                ) : item.thumbnailVideo ? (
                                    <img src={item.thumbnailVideo} alt={item.title} />
                                ) : (
                                    <img src='/img/nothing.png' alt={item.title} />
                                )}
                                <span>{item.title}</span>
                            </Link>
                            <div className='item-information'>
                            <div className='item-teacher'>
                                {
                                    item.teacher ? (
                                    <p>{item.teacher}</p> 
                                    ):(
                                    <p>&nbsp;</p> 
                                    )
                                }
                                </div>
                                <span>
                                    <svg width="13" height="12" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                    <path fill="#FDCC0E" fill-rule="evenodd" d="M8 1.3c.133 0 .263.037.375.108.113.07.203.17.262.29l1.778 3.637 3.978.583c.131.02.254.075.355.161.101.086.176.199.217.326.041.126.046.262.014.392-.031.13-.098.247-.193.34l-2.878 2.831.68 3.996c.022.131.007.267-.042.39-.05.124-.133.23-.24.31-.107.078-.234.125-.366.134-.132.01-.263-.018-.38-.08L8 12.831l-3.558 1.887c-.117.062-.248.09-.38.08-.132-.01-.259-.056-.365-.134-.107-.079-.19-.186-.24-.31-.05-.123-.065-.258-.043-.39l.68-3.997-2.88-2.83c-.094-.093-.161-.21-.193-.34-.032-.13-.027-.266.014-.393.04-.127.116-.24.217-.326.102-.086.225-.142.356-.16l3.978-.583 1.779-3.637c.059-.12.15-.22.262-.29.112-.07.242-.108.374-.108z" clip-rule="evenodd">
                                    </path>
                                    </svg>{item.rating}</span>
                                    <span>
                                    <svg width="13" height="12"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                        <path fill="currentColor" d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z">
                                        </path>
                                    </svg>
                                    </span>
                                <div className="overlay">
                                    <span>
                                    <svg width="20" height="18" aria-hidden="true" focusable="false" data-prefix="far" data-icon="heart" class="svg-inline--fa fa-heart " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path fill="currentColor" d="M225.8 468.2l-2.5-2.3L48.1 303.2C17.4 274.7 0 234.7 0 192.8v-3.3c0-70.4 50-130.8 119.2-144C158.6 37.9 198.9 47 231 69.6c9 6.4 17.4 13.8 25 22.3c4.2-4.8 8.7-9.2 13.5-13.3c3.7-3.2 7.5-6.2 11.5-9c0 0 0 0 0 0C313.1 47 353.4 37.9 392.8 45.4C462 58.6 512 119.1 512 189.5v3.3c0 41.9-17.4 81.9-48.1 110.4L288.7 465.9l-2.5 2.3c-8.2 7.6-19 11.9-30.2 11.9s-22-4.2-30.2-11.9zM239.1 145c-.4-.3-.7-.7-1-1.1l-17.8-20c0 0-.1-.1-.1-.1c0 0 0 0 0 0c-23.1-25.9-58-37.7-92-31.2C81.6 101.5 48 142.1 48 189.5v3.3c0 28.5 11.9 55.8 32.8 75.2L256 430.7 431.2 268c20.9-19.4 32.8-46.7 32.8-75.2v-3.3c0-47.3-33.6-88-80.1-96.9c-34-6.5-69 5.4-92 31.2c0 0 0 0-.1 .1s0 0-.1 .1l-17.8 20c-.3 .4-.7 .7-1 1.1c-4.5 4.5-10.6 7-16.9 7s-12.4-2.5-16.9-7z">
                                        </path>
                                    </svg>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default CoursesPage;
