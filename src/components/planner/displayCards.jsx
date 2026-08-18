import { useState, useEffect } from "react";
import Card from "./card.jsx";

export default function DisplayCards({cards, saveCards}) {
    // Hooks must run on every render, so seed them from a safe fallback
    // instead of early-returning before they're called (Rules of Hooks).
    const safeCards = cards ?? [];
    const [savedCard, setSavedCard] = useState(safeCards.map(() => true));
    const [urls, setUrls] = useState(safeCards.map((card) => card.url));
    const [cardChecked, setCardChecked] = useState(safeCards.map((card) => card.checked));
    const [answers, setAnswers] = useState(safeCards.map((card) => card.answer));
    useEffect(() => {
        setSavedCard(safeCards.map(() => true));
        setUrls(safeCards.map((card) => card.url));
        setCardChecked(safeCards.map((card) => card.checked));
        setAnswers(safeCards.map((card) => card.answer));
    }, [cards]);

    if (!cards) {
        return <div>Pick a category to view!</div>;
    }
    if (cards.length === 0) {
        return <div>No cards in this category.</div>;
    }

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
        const newCards = cards.map((card, idx) =>
            idx === cardIndex
                ? {
                    ...card,
                    answer: answers[idx],
                    url: urls[idx],
                    checked: cardChecked[idx]
                }
                : card
        );
        setSavedCard(prevSaved => {
            const newSaved = [...prevSaved];
            newSaved[cardIndex] = true;
            return newSaved;
        });
        await saveCards(newCards);
    }
    return (
        <div className="cards-display">
            {cards.map((card, cardIndex) => (
                <Card
                    key={cardIndex}
                    title={card.title}
                    description={card.description}
                    answer={answers[cardIndex]}
                    updateUrl={(newUrl) => updateUrl(cardIndex, newUrl)}
                    toggleChecked={() => toggleCardChecked(cardIndex)}
                    updateAnswer={(newAnswer) => updateAnswer(cardIndex, newAnswer)}
                    saveFunc={() => saveCard(cardIndex)}
                    saved={savedCard[cardIndex]}
                    imageurl={card.imageurl}
                    url={urls[cardIndex]}
                    checked={cardChecked[cardIndex]}
                />
            ))}
        </div>
    )
}
