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
    const [isSaving, setIsSaving] = useState(false);

    const saveUserData = async (newUserData) => {
        setIsSaving(true);
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
            if (!response.ok) {
                console.error("Save failed:", result.error);
                return false;
            }
            return true;
        } catch (error) {
            console.error("Error saving:", error);
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const saveQuestions = async (newQuestions) => {
        if (!userData || currentMovieIndex === null) {
            console.error('No user data or movie index to save questions to.');
            return false;
        }

        const newMovies = [...userData.movies];
        newMovies[currentMovieIndex] = { ...newMovies[currentMovieIndex], questions: newQuestions };
        const newUserData = { ...userData, movies: newMovies };

        const ok = await saveUserData(newUserData);
        if (ok) {
            setUserData(newUserData);
        }
        return ok;
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
                        <DisplayQuestions questions={questions} saveQuestions={saveQuestions} isSaving={isSaving} />
                    )}
                </div>
            </div>
            {isSaving && (
                <div className="movie-saving-indicator">
                    <span className="movie-saving-spinner" aria-hidden="true"></span>
                    Saving…
                </div>
            )}
        </div>
    );
}
