import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../assert/chatbot.css';
import { IoChatboxEllipsesOutline } from "react-icons/io5";

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [isComposing, setIsComposing] = useState(false);
    const chatEndRef = useRef(null);
    const apiEndpoint = `${process.env.REACT_APP_BASE_URL}/recommendation`;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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

    const handleSendMessage = async () => {
        const question = userInput.trim();
        if (question.length === 0) return;

        addMessage('user', question);
        setUserInput('');
        setLoading(true);

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

            const formattedResponse = (
                <div>
                    <h3>{randomIntroMessage()}</h3>
                    {data.map((course, index) => (
                        <div key={index} className='course'>
                            <h3>{course.courseTitle}</h3>
                            <p><strong>강사:</strong> {course.courseTeacher || '정보 없음'}</p>
                            <p><a href={course.courseUrl} target='_blank' rel='noopener noreferrer'>강의 보러가기</a></p>
                    
                        </div>
                    ))}
                </div>
            );

            // <p>
            //                 <Link 
            //                 to={`/reviews/${course.courseId}`}
            //                 state={{ courseTitle: course.courseTitle }}
            //                 >
            //                 리뷰 보러가기
            //                 </Link>
            //                 </p>

            addMessage('bot', formattedResponse);
        } catch (error) {
            console.error('오류 발생!', error);
            addMessage('bot', '오류 발생!');
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
                    placeholder='이제 배우고 싶은 기술이나 관심 있는 주제를 자유롭게 입력하세요🎉 리뷰잉이 최적의 강의를 바로 추천해드립니다😊'
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
