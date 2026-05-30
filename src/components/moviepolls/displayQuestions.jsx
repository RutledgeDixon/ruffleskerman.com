import { useState, useEffect } from "react";
import Card from "./question.jsx";

export default function DisplayQuestions({ questions, saveQuestions }) {
    if (!questions) {
        return <div>Pick a movie to view the poll.</div>;
    }
    if (questions.length === 0) {
        return <div>No poll questions for this movie.</div>;
    }

    const [savedCard, setSavedCard] = useState(questions.map(() => true));
    const [urls, setUrls] = useState(questions.map((question) => question.url));
    const [cardChecked, setCardChecked] = useState(questions.map((question) => question.checked));
    const [answers, setAnswers] = useState(questions.map((question) => question.answer));

    useEffect(() => {
        setSavedCard(questions.map(() => true));
        setUrls(questions.map((question) => question.url));
        setCardChecked(questions.map((question) => question.checked));
        setAnswers(questions.map((question) => question.answer));
    }, [questions]);

    const updateUrl = (cardIndex, newUrl) => {
        const newUrls = [...urls];
        newUrls[cardIndex] = newUrl;
        setUrls(newUrls);
        setSavedCard(prevSaved => {
            const newSaved = [...prevSaved];
            newSaved[cardIndex] = false;
            return newSaved;
        });
    }

    const toggleCardChecked = (cardIndex) => {
        const newCardChecked = [...cardChecked];
        newCardChecked[cardIndex] = !cardChecked[cardIndex];
        setCardChecked(newCardChecked);
        setSavedCard(prevSaved => {
            const newSaved = [...prevSaved];
            newSaved[cardIndex] = false;
            return newSaved;
        });
    }

    const updateAnswer = (cardIndex, newAnswer) => {
        const newAnswers = [...answers];
        newAnswers[cardIndex] = newAnswer;
        setAnswers(newAnswers);
        setSavedCard(prevSaved => {
            const newSaved = [...prevSaved];
            newSaved[cardIndex] = false;
            return newSaved;
        });
    }

    const saveCard = async (cardIndex) => {
        const newQuestions = questions.map((question, idx) =>
            idx === cardIndex
                ? {
                    ...question,
                    answer: answers[idx],
                    url: urls[idx],
                    checked: cardChecked[idx]
                }
                : question
        );
        setSavedCard(prevSaved => {
            const newSaved = [...prevSaved];
            newSaved[cardIndex] = true;
            return newSaved;
        });
        await saveQuestions(newQuestions);
    }

    return (
        <div className="cards-display">
            {questions.map((question, cardIndex) => (
                <Card
                    key={cardIndex}
                    title={question.title}
                    description={question.description}
                    answer={answers[cardIndex]}
                    updateUrl={(newUrl) => updateUrl(cardIndex, newUrl)}
                    toggleChecked={() => toggleCardChecked(cardIndex)}
                    updateAnswer={(newAnswer) => updateAnswer(cardIndex, newAnswer)}
                    saveFunc={() => saveCard(cardIndex)}
                    saved={savedCard[cardIndex]}
                    imageurl={question.imageurl}
                    url={urls[cardIndex]}
                    checked={cardChecked[cardIndex]}
                />
            ))}
        </div>
    )
}
