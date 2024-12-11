import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const CoursesPage = () => {
    const location = useLocation();
    const [coursesData, setCoursesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); 

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                const platform = location.pathname.split('/')[2]; 
                const category = location.pathname.split('/')[3];

                const response = await axios.get(`http://localhost:8080/courses/${platform}/${category}`);
                setCoursesData(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching courses:", error);
                setError("데이터를 가져오는 데 실패했습니다.");
                setLoading(false);
            }
        };

        fetchCourses();
    }, [location.pathname]); 

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <section id='inflearn'>
        {/* <div className="sort-dropdown">
          <select onChange={(e) => setSortCriteria(e.target.value)} value={sortCriteria}>
            <option value="fundamental">기본 순</option>
            <option value="rating">별점 높은 순</option>
            <option value="comments">리뷰 많은 순</option>
          </select>
        </div> */}
        <div className='inflearn__inner'>
          {coursesData.map(item => (
            <div key={item.id} className='item'>
              <div className='item-inner'>
              <Link className='item-title' to={`/reviews/${item.id}`} state={{ item }}>
              {
                item.thumbnailImage ? (
              <img src={item.thumbnailImage} alt={item.title} />
              ) : item.thumbnailVideo ? (
              <img src={item.thumbnailVideo} alt={item.title} />
              ) : (
              <img src='/img/nothing.png' alt={item.title} />
              )
              }
              <span>{item.title}</span>
            </Link>
                <div className='item-information'>
                  {item.teacher ? (
                    <p>강사: {item.teacher}</p>
                  ) : (
                    <p>강사: 미상</p>
                  )}
                  <p>별점: {item.rating}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
};

export default CoursesPage;