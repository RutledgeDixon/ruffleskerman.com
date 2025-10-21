//TODO:
// - add a save function that saves the state of all user data

import { useState } from "react";
import CategoryCard from "./categoryCard";
import Card from "./card";

export default function DisplayCategories({userData}: {userData: any}) {
    // console.log("received user:\n", userData);
    
    if (!userData || !userData.categories) {
        return <div>No user data or categories available.</div>;
    }
    const categories = userData.categories;
    console.log("categories: ", categories);

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

    return (
        <div className="categories-container">
            {categories.map((category: any, catIndex: number) => (
                <>
                    <CategoryCard
                        key={catIndex}
                        title={category.title}
                        description={category.description}
                        progress={category.progress}
                        showCards={showCards[catIndex]}
                        toggleShowCards={() => toggleShowCards(catIndex)}
                    />
                    {showCards[catIndex] && category.cards.map((card: any, cardIndex: number) => (
                        <Card
                            key={cardIndex}
                            title={card.title}
                            description={card.description}
                            answer={card.answer}
                            imageurl={card.imageurl}
                            checked={cardChecked[catIndex][cardIndex]}
                            toggleChecked={() => toggleCardChecked(catIndex, cardIndex)}
                        />
                    ))}
                </>
            ))}
        </div>
    );
}
