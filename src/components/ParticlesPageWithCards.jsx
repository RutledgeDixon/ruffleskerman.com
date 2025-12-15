import { useState, useEffect, useRef } from "react";
import TypewriterCard from "./typewriterCard";

export default function ParticlesPageWithCards() {
    const [cards, setCards] = useState([]);
    const idCounter = useRef(0);

    // Function to add a new card
    const addCard = (title, text) => {
        const newCard = {
            id: ++idCounter.current, // incrementing unique id
            title,
            text,
            start: true, // automatically start the typewriter effect
        };
        setCards((prevCards) => [...prevCards, newCard]);
    };
    // Function to remove a card
    const removeCard = (id) => {
        setCards((prevCards) => prevCards.filter((card) => card.id !== id));
    }; 

    // Expose addCard to window so particles.js can call it
    useEffect(() => {
        window.addTypewriterCard = addCard;
        window.removeTypewriterCard = removeCard;
    }, [addCard, removeCard]);

    return (
        <div className="typewriter-cards-container">
            {cards.map((card) => (
                <TypewriterCard
                    key={card.id}
                    id={card.id}
                    title={card.title}
                    text={card.text}
                    start={card.start}
                    onRemove={() => removeCard(card.id)}
                />
            ))}
        </div>
    );
}
