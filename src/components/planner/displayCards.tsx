import { useState, useEffect } from "react";
import Card from "./card";

interface DisplayCardsProps {
    cards: any;
    saveCards: (newUserData: any) => Promise<void>;
}

export default function DisplayCards({cards, saveCards}: DisplayCardsProps) {
    //return early if no cards
    if (!cards) {
        return <div>Pick a category to view!</div>;
    }
    if (cards.length === 0) {
        return <div>No cards in this category.</div>;
    }

    // No local cardsState; always use cards prop for rendering and saving
    //store saved data as a usestate in order to check if changes have been made
    const [savedCard, setSavedCard] = useState<boolean[]>(cards.map((card: any) => true));

    //usestate to keep track of urls for each card
    const [urls, setUrls] = useState<string[]>(cards.map((card: any) => card.url));
    //usestate to keep track of checked state for each card
    const [cardChecked, setCardChecked] = useState<boolean[]>(cards.map((card: any) => card.checked));
    //usestate to set the answer for each card
    const [answers, setAnswers] = useState<string[]>(cards.map((card: any) => card.answer));

    // Reset all state when cards prop changes (i.e., when switching categories)
    useEffect(() => {
        setSavedCard(cards.map((card: any) => true));
        setUrls(cards.map((card: any) => card.url));
        setCardChecked(cards.map((card: any) => card.checked));
        setAnswers(cards.map((card: any) => card.answer));
    }, [cards]);

    const updateUrl = (cardIndex: number, newUrl: string) => {
        console.log(`Updating URL for card ${cardIndex} to ${newUrl}`);
        const newUrls = [...urls];
        newUrls[cardIndex] = newUrl;
        setUrls(newUrls);
        //set saved to false for the card since it changed
        setSavedCard(prevSaved => {
            const newSaved = [...prevSaved];
            newSaved[cardIndex] = false;
            return newSaved;
        });
    }

    const toggleCardChecked = (cardIndex: number) => {
        console.log("Toggling card checked for card index:", cardIndex);
        const newCardChecked = [...cardChecked];
        newCardChecked[cardIndex] = !cardChecked[cardIndex];
        setCardChecked(newCardChecked);
        //set saved to false for the card since it changed
        setSavedCard(prevSaved => {
            const newSaved = [...prevSaved];
            newSaved[cardIndex] = false;
            return newSaved;
        });
    };

    const updateAnswer = (cardIndex: number, newAnswer: string) => {
        console.log(`Updating answer for card ${cardIndex} to ${newAnswer}`);
        const newAnswers = [...answers];
        newAnswers[cardIndex] = newAnswer;
        setAnswers(newAnswers);
        //set saved to false for the card since it changed
        setSavedCard(prevSaved => {
            const newSaved = [...prevSaved];
            newSaved[cardIndex] = false;
            return newSaved;
        });
    }

    //useState to save card
    const saveCard = async (cardIndex: number) => {
        console.log(`Saving card for card ${cardIndex}`);
        // Build new cards array from current prop and local state
        const newCards = cards.map((card: any, idx: number) =>
            idx === cardIndex
                ? {
                    ...card,
                    answer: answers[idx],
                    url: urls[idx],
                    checked: cardChecked[idx]
                }
                : card
        );

        //update savedCard to true
        setSavedCard(prevSaved => {
            const newSaved = [...prevSaved];
            newSaved[cardIndex] = true;
            return newSaved;
        });

        //call API to save the updated userData
        await saveCards(newCards);
    }

    return (
        <div className="cards-display">
            {cards.map((card: any, cardIndex: number) => (
                <Card
                    key={cardIndex}
                    title={card.title}
                    description={card.description}
                    answer={answers[cardIndex]}
                    updateUrl={(newUrl: string) => updateUrl(cardIndex, newUrl)}
                    toggleChecked={(checked: boolean) => toggleCardChecked(cardIndex)}
                    updateAnswer={(newAnswer: string) => updateAnswer(cardIndex, newAnswer)}
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