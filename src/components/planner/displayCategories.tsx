//TODO:
// - Add a save function that saves the state of all user data.
//   This will be a button next to show/hide that updates the json file with the new data.
//   When this is in a DB, it will update the DB instead of the json file.
// - The save could also be per card, that might be more intuitive.
// - The save function will pass back to the webpage a json response formatted like
//   what displayCategories.tsx received.

import { useState } from "react";
import CategoryCard from "./categoryCard";
import Card from "./card";

export default function DisplayCategories({userData}: {userData: any}) {
    //return early if no userData or no categories
    if (!userData || !userData.categories) {
        return <div>No user data or categories available.</div>;
    }
    
    const categories = userData.categories;
    console.log("categories: ", categories);

    const progress = (category: any) => {
        const checkedCards = category.cards.filter((card: any) => card.checked).length;
        const totalCards = category.cards.length;
        return totalCards === 0 ? 0: Math.round(checkedCards / totalCards * 100);
    };

    //usestate to keep track of showCards for each category
    const [showCards, setShowCards] = useState<boolean[]>(userData.categories.map((cat: any) => cat.showCards));
    const toggleShowCards = (index: number) => {
        console.log("Toggling showCards for index:", index);
        const newShowCards = [...showCards];
        newShowCards[index] = !newShowCards[index];
        setShowCards(newShowCards);
    };

    //usestate to keep track of checked state for each card in each category
    const [cardChecked, setCardChecked] = useState<boolean[][]>(userData.categories.map((cat: any) => cat.cards.map((card: any) => card.checked)));
    const toggleCardChecked = (catIndex: number, cardIndex: number) => {
        console.log("Toggling card checked for category index:", catIndex, "and card index:", cardIndex);
        const newCardChecked = [...cardChecked];
        newCardChecked[catIndex][cardIndex] = !cardChecked[catIndex][cardIndex];
        setCardChecked(newCardChecked);
    };

    //usestate to set the answer for each card in each category
    const [answers, setAnswers] = useState<string[][]>(userData.categories.map((cat: any) => cat.cards.map((card: any) => card.answer)));
    const updateAnswer = (catIndex: number, cardIndex: number, newAnswer: string) => {
        console.log(`Updating answer for cat ${catIndex} card ${cardIndex} to ${newAnswer}`);
        const newAnswers = [...answers];
        newAnswers[catIndex][cardIndex] = newAnswer;
        setAnswers(newAnswers);
    }

    return (
        <div className="categories-container">
            {categories.map((category: any, catIndex: number) => (
                <div className="category-section">
                    <CategoryCard
                        key={catIndex}
                        title={category.title}
                        description={category.description}
                        progress={progress(category)}
                        showCards={showCards[catIndex]}
                        toggleShowCards={() => toggleShowCards(catIndex)}
                    />
                    {showCards[catIndex] && category.cards.map((card: any, cardIndex: number) => (
                        <Card
                            key={cardIndex}
                            title={card.title}
                            description={card.description}
                            answer={answers[catIndex][cardIndex]}
                            updateAnswer={(newAnswer: string) => updateAnswer(catIndex, cardIndex, newAnswer)}
                            imageurl={card.imageurl}
                            checked={cardChecked[catIndex][cardIndex]}
                            toggleChecked={() => toggleCardChecked(catIndex, cardIndex)}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}
