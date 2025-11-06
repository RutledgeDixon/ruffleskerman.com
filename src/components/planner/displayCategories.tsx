//TODO:
// - Make it so that when a save button is pressed, the site doesn't automatically reload

import { useState } from "react";
import CategoryCard from "./categoryCard";

interface DisplayCategoriesProps {
    userData: any;
    saveUserData: (newUserData: any) => Promise<void>;
    setShownCategory: (categoryIndex: number) => void;
}

export default function DisplayCategories({userData, saveUserData, setShownCategory}: DisplayCategoriesProps) {
    //return early if no userData or no categories
    if (!userData || !userData.categories) {
        return <div>No user data or categories available.</div>;
    }
    //store user data in a useState to update when saving cards
    const [userDataState, setUserDataState] = useState(userData);

    const categories = userData.categories;
    // console.log("categories: ", categories);

    //calculate progress bar for categories
    const progress = (category: any) => {
        const checkedCards = category.cards.filter((card: any) => card.checked).length;
        const totalCards = category.cards.length;
        return totalCards === 0 ? 0: Math.round(checkedCards / totalCards * 100);
    };

    //usestate to keep track of showCards for each category
    const [showCards, setShowCards] = useState<boolean[]>(userData.categories.map((cat: any) => cat.showCards));
    const toggleShowCards = (index: number) => {
        console.log("Showing cards for index:", index);
        setShownCategory(index);
    };

    return (
        <div className="categories-container">
            {categories.map((category: any, catIndex: number) => (
                <CategoryCard
                    key={catIndex}
                    title={category.title}
                    description={category.description}
                    progress={progress(category)}
                    showCards={category.showCards || false}
                    selected={category.showCards || false}
                    toggleShowCards={() => toggleShowCards(catIndex)}
                />
            ))}
        </div>
    );
}
