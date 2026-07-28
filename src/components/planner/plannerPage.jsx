import { useState, useEffect } from 'react';
import Login from  './login.jsx';
import DisplayCategories from './displayCategories.jsx';
import DisplayCards from './displayCards.jsx';
import '@/styles/planner.css';

export default function PlannerPage() {
    const [userData, setUserData] = useState(null);
    const [userName, setUserName] = useState('');
    const [cards, setCards] = useState(null);
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
    const saveUserData = async (newUserData) => {
        try {
            const response = await fetch("/api/access-db", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "save",
                    name: userName,
                    userData: newUserData,
                }),
            });
            const result = await response.json();
            if (!response.ok) {
                console.error("Save failed:", result.error);
            }
        } catch (error) {
            console.error("Error saving:", error);
        }
    };
    const saveCards = async (newCards) => {
        if (!userData || currentCategoryIndex === null) {
            console.error("No user data or category index to save cards to.");
            return;
        }
        const newUserData = { ...userData };
        newUserData.categories[currentCategoryIndex].cards = newCards;
        setUserData(newUserData);
        await saveUserData(newUserData);
    };
    const handleLogin = (data) => {
        setUserData(data);
        setUserName(data.name);
    };
    useEffect(() => {
        if (userData && currentCategoryIndex !== null) {
            const category = userData.categories[currentCategoryIndex];
            setCards(category.cards);
        }
    }, [userData, currentCategoryIndex]);
    return (
        <div className="planner-page">
            <div className="planner-sidebar">
                <DisplayCategories
                    userData={userData}
                    saveUserData={saveUserData}
                    setShownCategory={setCurrentCategoryIndex}
                    currentCategoryIndex={currentCategoryIndex}
                />
            </div>
            <div className="planner-content">
                <h1 className="text-4xl font-bold text-gray-400 my-8 text-center">
                    {userName ? `${userName}'s Wedding Planner` : 'RK Wedding Planner'}
                </h1>
                {userData && userData.categories && userData.categories[currentCategoryIndex] && (
                    <h2 className="text-2xl font-semibold text-gray-400 mb-4 text-center">
                        {`Category: ${userData.categories[currentCategoryIndex].title}`}
                    </h2>
                )}
                <div className="planner-cards">
                    {!userData ? (
                        <Login setUserData={handleLogin}/>
                    ) : (
                        <DisplayCards cards={cards} saveCards={saveCards} />
                    )}
                </div>
            </div>
        </div>
    );
}
