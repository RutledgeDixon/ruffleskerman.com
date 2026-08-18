import ProgressCard from "@/components/progressCard.jsx";

export default function DisplayCategories({userData, setShownCategory, currentCategoryIndex}) {
    if (!userData || !userData.categories) {
        return <div>No user data or categories available.</div>;
    }
    const categories = userData.categories;
    const progress = (category) => {
        const checkedCards = category.cards.filter((card) => card.checked).length;
        const totalCards = category.cards.length;
        return totalCards === 0 ? 0: Math.round(checkedCards / totalCards * 100);
    };
    const toggleShowCards = (index) => {
        setShownCategory(index);
    };
    return (
        <div className="categories-container">
            {categories.map((category, catIndex) => (
                <ProgressCard
                    key={catIndex}
                    title={category.title}
                    progress={progress(category)}
                    selected={currentCategoryIndex === catIndex}
                    toggleShowCards={() => toggleShowCards(catIndex)}
                />
            ))}
        </div>
    );
}
