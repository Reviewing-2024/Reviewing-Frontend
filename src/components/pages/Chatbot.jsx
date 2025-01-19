import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assert/chatbot.css';
import { IoChatboxEllipsesOutline } from "react-icons/io5";

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isComposing, setIsComposing] = useState(false);
    const chatEndRef = useRef(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const apiEndpoint = `${process.env.REACT_APP_BASE_URL}/recommendation`;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const createUrlSlug = (slug) => {
        return slug
            .toLowerCase()
            .replace(/[^a-z0-9가-힣]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const addMessage = (sender, message) => {
        setMessages(prevMessages => [...prevMessages, { sender, message }]);
    };

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.nativeEvent.isComposing && !isComposing) {
            event.preventDefault();
            handleSendMessage();
        }
    };

    const handleCompositionStart = () => {
        setIsComposing(true);
    };

    const handleCompositionEnd = () => {
        setIsComposing(false);
    };

    const randomIntroMessage = () => {
        const intros = [
            "이런 강의들은 어떠신가요?",
            "다음 추천 강의를 확인해 보세요!",
            "아래 강의들을 추천드립니다!",
            "이 강의들이 당신에게 도움이 될 것 같아요!",
            "이런 옵션은 어떠신가요?"
        ];
        return intros[Math.floor(Math.random() * intros.length)];
    };

    const fetchCourseDetails = async (courseId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/course/${courseId}`);
            if (!response.ok) {
                throw new Error('강의 정보를 불러오는데 실패했습니다.');
            }
            return await response.json();
        } catch (error) {
            console.error('강의 정보 조회 오류:', error);
            throw error;
        }
    };

    const handleCourseClick = async (course) => {
        try {
            console.log(course)
            setLoading(true);
            // course.id 또는 course.courseId를 사용하여 API 호출
            const courseDetails = await fetchCourseDetails(course.courseSlug);
            
            // 리뷰 페이지로 이동하면서 상세 데이터 전달
            navigate(`/reviews/${course.courseSlug}`, {
                state: { courseDetails, id: course.courseId }
            });
        } catch (error) {
            setError('강의 정보를 불러오는데 실패했습니다.');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const formattedResponse = (data) => (
        console.log(data),
        <div>
            
            <h3>{randomIntroMessage()}</h3>
            {data.map((course, index) => (
                <div key={index} className='course'>
                    <h3>{course.courseTitle}</h3>
                    <p><strong>강사:</strong> {course.courseTeacher || '정보 없음'}</p>
                    <p><a href={course.courseUrl} target='_blank' rel='noopener noreferrer'>강의 보러가기</a></p>
                    
                </div>
            ))}
            
            {error && <div className="error-message">{error}</div>}
        </div>
    );

    // <p>
    //                     <button
    //                         onClick={() => handleCourseClick(course)}
    //                         className="review-link"
    //                         disabled={loading}
    //                         style={{
    //                             background: 'none',
    //                             border: 'none',
    //                             color: '#0066cc',
    //                             textDecoration: 'underline',
    //                             cursor: loading ? 'wait' : 'pointer',
    //                             padding: 0
    //                         }}
    //                     >
    //                         {loading ? '로딩 중...' : '리뷰 보러가기'}
    //                     </button>
    //                 </p>

    

    const handleSendMessage = async () => {
        const question = userInput.trim();
        if (question.length === 0) return;

        addMessage('user', question);
        setUserInput('');
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question }),
            });

            if (!response.ok) {
                throw new Error('API 요청 실패');
            }

            const data = await response.json();
            addMessage('bot', formattedResponse(data));
        } catch (error) {
            console.error('오류 발생!', error);
            addMessage('bot', '오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
            setError(error.message);
        } finally {
            setLoading(false);
            scrollToBottom();
        }
    };

    return (
        <div id='Chatbot'>
            <div className='chatDiv'>
                {loading && <span className="messageWait">답변을 기다리고 있습니다</span>}
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender}`}>
                        <div>{msg.message}</div>
                    </div>
                ))}
                <div ref={chatEndRef}></div>
            </div>
            <div className='inputDiv'>
                <input
                    type='text' 
                    placeholder={`[질문 예시]  파이썬 기초 강의 알려줘 / Spring 기반 백엔드 강의 추천해줘  / React 강의 추천해줘`}
                    value={userInput} 
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onCompositionStart={handleCompositionStart}
                    onCompositionEnd={handleCompositionEnd}
                />
                <button 
                    onClick={handleSendMessage}
                    disabled={loading}
                >
                    <IoChatboxEllipsesOutline />
                </button>
            </div>
        </div>
    );
};

export default Chatbot;