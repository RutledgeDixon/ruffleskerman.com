import { useState, useEffect } from 'react';
import Login from  './login.jsx';
import DisplayMovies from './displayMovies.jsx';
import DisplayQuestions from './displayQuestions.jsx';
import '@/styles/planner.css';

export default function MoviePollsPage() {
    const [userData, setUserData] = useState(null);
    const [userName, setUserName] = useState('');
    const [questions, setQuestions] = useState(null);
    const [currentMovieIndex, setCurrentMovieIndex] = useState(0);

    const saveUserData = async (newUserData) => {
        try {
            const response = await fetch('/api/access-db-movie', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "save",
                    name: userName,
                    userData: newUserData,
                }),
            });
            const result = await response.json();
            if (response.ok) {
                console.log("Save successful:", result.message);
            } else {
                console.error("Save failed:", result.error);
            }
        } catch (error) {
            console.error("Error saving:", error);
        }
    };

    const saveQuestions = async (newQuestions) => {
        if (!userData || currentMovieIndex === null) {
            console.error('No user data or movie index to save questions to.');
            return;
        }

        const newUserData = { ...userData };
        newUserData.movies[currentMovieIndex].questions = newQuestions;
        setUserData(newUserData);
        await saveUserData(newUserData);
    };

    const handleLogin = (data) => {
        setUserData(data);
        setUserName(data.name);
    };

    useEffect(() => {
        if (userData && currentMovieIndex !== null) {
            const movie = userData.movies[currentMovieIndex];
            setQuestions(movie.questions);
        }
    }, [userData, currentMovieIndex]);

    return (
        <div className="planner-page">
            <div className="planner-sidebar">
                <DisplayMovies
                    userData={userData}
                    setShownMovie={setCurrentMovieIndex}
                    currentMovieIndex={currentMovieIndex}
                />
            </div>
            <div className="planner-content">
                <h1 className="text-4xl font-bold text-gray-400 my-8 text-center">
                    {userName ? `${userName}'s Movie Polls` : 'RK Movie Polls'}
                </h1>
                {userData && userData.movies && userData.movies[currentMovieIndex] && (
                    <h2 className="text-2xl font-semibold text-gray-400 mb-4 text-center">
                        {`Movie: ${userData.movies[currentMovieIndex].title}`}
                    </h2>
                )}
                <div className="planner-cards">
                    {!userData ? (
                        <Login setUserData={handleLogin}/>
                    ) : (
                        <DisplayQuestions questions={questions} saveQuestions={saveQuestions} />
                    )}
                </div>
            </div>
        </div>
    );
}