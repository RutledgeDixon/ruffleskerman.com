//TODO:
// - Make it so that when a save button is pressed, the site doesn't automatically reload

import { useState } from "react";
import CategoryCard from "./categoryCard";
import Card from "./card";

interface DisplayCategoriesProps {
    userData: any;
    saveUserData: (newUserData: any) => Promise<void>;
    setShownCategory: (categoryTitle: string) => void;
}

export default function DisplayCategories({userData, saveUserData, setShownCategory}: DisplayCategoriesProps) {
    //return early if no userData or no categories
    if (!userData || !userData.categories) {
        return <div>No user data or categories available.</div>;
    }
    //store user data in a useState to update when saving cards
    const [userDataState, setUserDataState] = useState(userData);

    //store saved data as a usestate in order to check if changes have been made
    const [savedCard, setSavedCard] = useState<boolean[][]>(userData.categories.map((cat: any) => cat.cards.map((card: any) => true)));
    
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
        const categoryTitle = categories[index].title;
        setShownCategory(categoryTitle);
    };

    //usestate to keep track of urls for each card in each category
    const [urls, setUrls] = useState<string[][]>(userData.categories.map((cat: any) => cat.cards.map((card: any) => card.url)));
    const updateUrl = (catIndex: number, cardIndex: number, newUrl: string) => {
        console.log(`Updating URL for cat ${catIndex} card ${cardIndex} to ${newUrl}`);
        const newUrls = [...urls];
        newUrls[catIndex][cardIndex] = newUrl;
        setUrls(newUrls);
        //set saved to false for the card since it changed
        setSavedCard(prevSaved => {
            const newSaved = [...prevSaved];
            newSaved[catIndex][cardIndex] = false;
            return newSaved;
        });
    }

    //usestate to keep track of checked state for each card in each category
    const [cardChecked, setCardChecked] = useState<boolean[][]>(userData.categories.map((cat: any) => cat.cards.map((card: any) => card.checked)));
    const toggleCardChecked = (catIndex: number, cardIndex: number) => {
        console.log("Toggling card checked for category index:", catIndex, "and card index:", cardIndex);
        const newCardChecked = [...cardChecked];
        newCardChecked[catIndex][cardIndex] = !cardChecked[catIndex][cardIndex];
        setCardChecked(newCardChecked);
        //set saved to false for the card since it changed
        setSavedCard(prevSaved => {
            const newSaved = [...prevSaved];
            newSaved[catIndex][cardIndex] = false;
            return newSaved;
        });
    };

    //usestate to set the answer for each card in each category
    const [answers, setAnswers] = useState<string[][]>(userData.categories.map((cat: any) => cat.cards.map((card: any) => card.answer)));
    const updateAnswer = (catIndex: number, cardIndex: number, newAnswer: string) => {
        console.log(`Updating answer for cat ${catIndex} card ${cardIndex} to ${newAnswer}`);
        const newAnswers = [...answers];
        newAnswers[catIndex][cardIndex] = newAnswer;
        setAnswers(newAnswers);
        //set saved to false for the card since it changed
        setSavedCard(prevSaved => {
            const newSaved = [...prevSaved];
            newSaved[catIndex][cardIndex] = false;
            return newSaved;
        });
    }

    //useState to save card
    const saveCard = async (catIndex: number, cardIndex: number) => {
        console.log(`Saving card for cat ${catIndex} card ${cardIndex}`);
        //update savedData
        const newUserData = { ...userDataState };
        newUserData.categories[catIndex].cards[cardIndex] = {
            ...newUserData.categories[catIndex].cards[cardIndex],
            answer: answers[catIndex][cardIndex],
            url: urls[catIndex][cardIndex],
            checked: cardChecked[catIndex][cardIndex]
        };
        setUserDataState(newUserData);

        //update savedCard to true
        setSavedCard(prevSaved => {
            const newSaved = [...prevSaved];
            newSaved[catIndex][cardIndex] = true;
            return newSaved;
        });

        //call API to save the updated userData
        await saveUserData(newUserData);
    }

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
                    toggleShowCards={() => setShownCategory(category.title)}
                />
            ))}
        </div>
    );
}
