import { useState } from "react";
import CategoryCard from "./categoryCard.jsx";

export default function DisplayCategories({userData, saveUserData, setShownCategory, currentCategoryIndex}) {
    if (!userData || !userData.categories) {
        return <div>No user data or categories available.</div>;
    }
    const [userDataState, setUserDataState] = useState(userData);
    const categories = userData.categories;
    const progress = (category) => {
        const checkedCards = category.cards.filter((card) => card.checked).length;
        const totalCards = category.cards.length;
        return totalCards === 0 ? 0: Math.round(checkedCards / totalCards * 100);
    };
    const [showCards, setShowCards] = useState(userData.categories.map((cat) => cat.showCards));
    const toggleShowCards = (index) => {
        setShownCategory(index);
    };
    return (
        <div className="categories-container">
            {categories.map((category, catIndex) => (
                <CategoryCard
                    key={catIndex}
                    title={category.title}
                    description={category.description}
                    progress={progress(category)}
                    showCards={category.showCards || false}
                    selected={currentCategoryIndex === catIndex}
                    toggleShowCards={() => toggleShowCards(catIndex)}
                />
            ))}
        </div>
    );
}
