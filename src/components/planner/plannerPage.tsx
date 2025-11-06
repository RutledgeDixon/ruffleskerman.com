import { useState, useEffect } from 'react';
import Login from  './login';
import DisplayCategories from './displayCategories';
import DisplayCards from './displayCards';
import '@/styles/planner.css';

export default function PlannerPage() {
    const [userData, setUserData] = useState<any>(null);
    const [userName, setUserName] = useState('');
    const [cards, setCards] = useState<any>(null);
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState<number>(0);

    const saveUserData = async (newUserData: any) => {
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
            if (response.ok) {
                console.log("Save successful:", result.message);
            } else {
                console.error("Save failed:", result.error);
            }
        } catch (error) {
            console.error("Error saving:", error);
        }
    };

    const saveCards = async (newCards: any) => {
        if (!userData || currentCategoryIndex === null) {
            console.error("No user data or category index to save cards to.");
            return;
        }
        //update newUserData with new cards and then save in correct category
        const newUserData = { ...userData };
        newUserData.categories[currentCategoryIndex].cards = newCards;
        setUserData(newUserData); // <-- update userData state immediately
        await saveUserData(newUserData);
    };

    const handleLogin = (data: any) => {
        setUserData(data);
        setUserName(data.name);
    };

    //useEffect to update cards when currentCategory changes
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
                    {userName ? `${userName}'s Planner` : 'RK Planner'}
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
                        //display the cards of the current category
                        <DisplayCards cards={cards} saveCards={saveCards} />
                    )}
                </div>
            </div>
            
            {/* {!userData ? (
                <Login setUserData={handleLogin}/>
            ) : (
                <DisplayCategories userData={userData} saveUserData={saveUserData} />
            )} */}
        </div>
    );
}
