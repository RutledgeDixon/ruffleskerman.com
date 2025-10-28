import { useState } from 'react';
import Login from  './login';
import DisplayCategories from './displayCategories';
import '@/styles/planner.css';

export default function PlannerPage() {
    const [userData, setUserData] = useState<any>(null);
    const [userName, setUserName] = useState('');

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

    const handleLogin = (data: any) => {
        setUserData(data);
        setUserName(data.name);
    };

    return (
        <div className="planner-page">
            <h1 className="text-4xl font-bold text-gray-400 my-8 text-center">
                {userName ? `${userName}'s Planner` : 'RK Planner'}
            </h1>
            {!userData ? (
                <Login setUserData={handleLogin}/>
            ) : (
                <DisplayCategories userData={userData} saveUserData={saveUserData} />
            )}
        </div>
    );
}
