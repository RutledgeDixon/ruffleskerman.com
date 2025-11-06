import { useState } from 'react';
import Login from  './login';
import DisplayCategories from './displayCategories';
import DisplayCards from './displayCards';
import '@/styles/planner.css';

export default function PlannerPage() {
    const [userData, setUserData] = useState<any>(null);
    const [userName, setUserName] = useState('');
    const [cards, setCards] = useState<any>(null);
    const [currentCategory, setCurrentCategory] = useState<string>('');

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
        if (!userData) {
            console.error("No user data to save cards to.");
            return;
        }
        //update newUserData with new cards and then save in correct category
        const newUserData = { ...userData };
        newUserData.categories[0].cards = newCards;
        await saveUserData(newUserData);
    };

    const handleLogin = (data: any) => {
        setUserData(data);
        setUserName(data.name);
    };

    return (
        <div className="planner-page">
            <div className="planner-sidebar">
                <DisplayCategories userData={userData} saveUserData={saveUserData} setShownCategory={setCurrentCategory} />
            </div>
            <div className="planner-content">
                <h1 className="text-4xl font-bold text-gray-400 my-8 text-center">
                    {userName ? `${userName}'s Planner` : 'RK Planner'}
                </h1>
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
