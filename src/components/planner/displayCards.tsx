import { useState } from "react";
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

    //store user data in a useState to update when saving cards
    const [cardsState, setCardsState] = useState(cards);
    //store saved data as a usestate in order to check if changes have been made
    const [savedCard, setSavedCard] = useState<boolean[]>(cards.map((card: any) => true));

    //usestate to keep track of urls for each card
    const [urls, setUrls] = useState<string[]>(cards.map((card: any) => card.url));
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

    //usestate to keep track of checked state for each card
    const [cardChecked, setCardChecked] = useState<boolean[]>(cards.map((card: any) => card.checked));
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

    //usestate to set the answer for each card
    const [answers, setAnswers] = useState<string[]>(cards.map((card: any) => card.answer));
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
        //update savedData
        const newCards = [ ...cardsState ];
        newCards[cardIndex] = {
            ...newCards[cardIndex],
            answer: answers[cardIndex],
            url: urls[cardIndex],
            checked: cardChecked[cardIndex]
        };
        setCardsState(newCards);

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