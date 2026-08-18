import ProgressCard from "@/components/progressCard.jsx";

export default function DisplayMovies({ userData, setShownMovie, currentMovieIndex, home = false }) {
    if (!userData || !userData.movies) {
        return <div>No movie data available.</div>;
    }

    const movies = userData.movies;

    const progress = (movie) => {
        const answeredQuestions = movie.questions.filter((question) => question.checked).length;
        const totalQuestions = movie.questions.length;
        return totalQuestions === 0 ? 0 : Math.round((answeredQuestions / totalQuestions) * 100);
    };

    const toggleShowMovie = (index) => {
        setShownMovie(index);
    };

    return (
        <div className="categories-container">
            {movies.map((movie, movieIndex) => (
                <ProgressCard
                    key={movieIndex}
                    title={movie.title}
                    progress={progress(movie)}
                    selected={!home && currentMovieIndex === movieIndex}
                    toggleShowCards={() => toggleShowMovie(movieIndex)}
                />
            ))}
        </div>
    );
}
