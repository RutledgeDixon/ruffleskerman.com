import { useState, useEffect } from 'react';
import Login from  './login.jsx';
import DisplayMovies from './displayMovies.jsx';
import DisplayQuestions from './displayQuestions.jsx';
import '@/styles/planner.css';

export default function MoviePollsPage() {
    const [questions, setQuestions] = useState(null);
    const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
    const [data, setData] = useState(null);

    useEffect(() => {
        if (data && currentMovieIndex !== null) {
            const movie = data.movies[currentMovieIndex];
            setQuestions(movie.questions);
        }
    }, [data, currentMovieIndex]);

    return (
        <div className="planner-page">
            <div className="planner-sidebar">
                <DisplayMovies
                    userData={data}
                    setShownMovie={setCurrentMovieIndex}
                    currentMovieIndex={currentMovieIndex}
                />
            </div>
            <div className="planner-content">
                <h1 className="text-4xl font-bold text-gray-400 my-8 text-center">
                    {data ? `${data.movie} Poll Stats` : 'RK Movie Stats'}
                </h1>
                {data && data.movies && data.movies[currentMovieIndex] && (
                    <h2 className="text-2xl font-semibold text-gray-400 mb-4 text-center">
                        {`Movie: ${data.movies[currentMovieIndex].title}`}
                    </h2>
                )}
                <div className="planner-cards">
                    {!data ? (
                        <Login setUserData={setData}/>
                    ) : (
                        <DisplayQuestions questions={questions} saveQuestions={saveQuestions} />
                    )}
                </div>
            </div>
        </div>
    );
}