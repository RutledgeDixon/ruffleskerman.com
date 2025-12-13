import { useState, useEffect } from "react";
import TypewriterCard from "./typewriterCard";

export default function ParticlesPageWithCards() {
    const [cards, setCards] = useState([]);

    // Function to add a new card
    const addCard = (title, text) => {
        const newCard = {
            id: Date.now(), // unique id based on timestamp
            title,
            text,
            start: true, // automatically start the typewriter effect
        };
        setCards((prevCards) => [...prevCards, newCard]);
    };

    // Expose addCard to window so particles.js can call it
    useEffect(() => {
        window.addTypewriterCard = addCard;
    }, [addCard]);

    return (
        <div className="typewriter-cards-container">
            {cards.map((card) => (
                <TypewriterCard
                    key={card.id}
                    title={card.title}
                    text={card.text}
                    start={card.start}
                />
            ))}
        </div>
    );
}
