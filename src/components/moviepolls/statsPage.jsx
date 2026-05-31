import { useState, useEffect } from 'react';
import Login from  './login.jsx';
import DisplayMovies from './displayMovies.jsx';
import DisplayQuestions from './displayQuestions.jsx';
import '@/styles/planner.css';

export default function MoviePollsPage() {
        const parseRating = (value) => {
            if (value === "" || value == null || typeof value === 'boolean') {
                return null;
            }

            const numericValue = Number(value);
            if (!Number.isFinite(numericValue) || numericValue < 0 || numericValue > 10) {
                return null;
            }

            return numericValue;
        };

    const [questions, setQuestions] = useState(null);
    const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
    const [data, setData] = useState(null);
    const [home, setHome] = useState(true); //if true, shows overall stats, not specific movie stats

    useEffect(() => {
        pullData();
        console.log("Data after pull: ", data);
    }, []);

    useEffect(() => {
        if (data && currentMovieIndex !== null) {
            const movie = data.movies[currentMovieIndex];
            setQuestions(movie.questions);
        }
    }, [data, currentMovieIndex]);

    //data is in format
    /*
    data = {
        movies: [
            {
                title: "Movie 1",
                description: "etc",
                questions: [
                    {
                        title: "Question 1",
                        description: "etc",
                        answers: [
                            {
                                user: "user1",
                                answer: 7,
                            },
                            ...
                        ],
                        ...
                    },
                    ...
                ],
                ...
            },
            ...
        ]
    }
    */
    const pullData = async () => {
        try {
            const response = await fetch('/api/access-db-movie', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "read",
                }),
            });
            const result = await response.json();
            if (response.ok) {
                console.log("Data pull successful");
                setData(result.data);
            } else {
                console.error("Data pull failed: ", result.error);
            }
        }
        catch (error) {
            console.error("Error pulling data: ", error);
        }
    }
    //takes a specific question and returns the average of its answers
    //if an answer is null, it is not counted in the average
    const averageQuestionAnswers = (question) => {
        const answers = (question.answers || [])
            .map((entry) => parseRating(entry.answer))
            .filter((value) => value !== null);

        if (answers.length === 0) return -1;

        const average = answers.reduce((sum, answer) => sum + answer, 0) / answers.length;
        return Math.round(average);
    }
    //takes a movie and averages its questions, and then averages those averages for an overall movie rating
    const movieRating = (movie) => {
        const questionAverages = movie.questions.map(question => averageQuestionAnswers(question)).filter(avg => avg !== -1);
        if (questionAverages.length === 0) return -1;
        const movieAverage = questionAverages.reduce((sum, avg) => sum + avg, 0) / questionAverages.length;
        return Math.round(movieAverage);
    }

    const movieRatingList = data ? data.movies.map(movie => ({
        title: movie.title,
        rating: movieRating(movie) === -1 ? null : movieRating(movie)
    })) : [];

    const ratedMovies = movieRatingList.filter((movie) => typeof movie.rating === 'number');
    const overallAverageRating =
        ratedMovies.length > 0
            ? (ratedMovies.reduce((sum, movie) => sum + movie.rating, 0) / ratedMovies.length).toFixed(2)
            : "No movies yet";

    const handleSelectMovie = (movieIndex) => {
        setCurrentMovieIndex(movieIndex);
        setHome(false);
    };

    const showOverallStats = () => {
        setHome(true);
    };


    return (
        <div className="planner-page">
            <div className="planner-sidebar">
                <button
                    className={`overall-stats-button ${home ? 'active' : ''}`}
                    onClick={showOverallStats}
                >
                    Overall Stats
                </button>
                <DisplayMovies
                    userData={data}
                    setShownMovie={handleSelectMovie}
                    currentMovieIndex={currentMovieIndex}
                    home={home}
                />
            </div>
            <div className="planner-content">
                <h1 className="text-4xl font-bold text-gray-400 my-8 text-center">
                    {home || !data || !data.movies?.[currentMovieIndex]
                        ? 'RK Movie Stats'
                        : `${data.movies[currentMovieIndex].title}'s Movie Stats`}
                </h1>
                {home ? null : (
                    <h2 className="text-2xl font-semibold text-gray-400 mb-4 text-center">
                        Overall rating: {movieRating(data.movies[currentMovieIndex]) !== -1 ? movieRating(data.movies[currentMovieIndex]) : "No ratings yet"}
                    </h2>)}
                <div className="planner-cards movie-stats-cards">
                    {/* display average of each question for the selected movie */}
                    {home ? (
                        <div className="planning-card movie-stat-card">
                            <h2 className="text-2xl font-bold mb-2">Overall Movie Stats</h2>
                            <p className="mb-2">Average Rating: {overallAverageRating}</p>
                        </div> 

                        ) 
                        : data && data.movies?.[currentMovieIndex]?.questions?.map((question, index) => (
                        <div key={index} className="planning-card movie-stat-card">
                            <h2 className="text-2xl font-bold mb-2">{question.title}</h2>
                            <p className="mb-2">Total answers: {question.answers.filter(answer => answer.answer !== null).length}</p>
                            <p className="text-lg font-semibold">Average Rating: {averageQuestionAnswers(question) !== -1 ? averageQuestionAnswers(question) : "No answers yet"}</p>
                        </div>
                    ))}
                </div>
            </div>
            {/* <pre style={{ color: 'white', padding: '1rem', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {JSON.stringify(data, null, 2)}
            </pre> */}
        </div>
    );
}