import "@/styles/planner.css";
import { Button } from "@/components/ui/button";
import type { UserData } from '@/lib/types';

import { useState } from 'react';

export default function Login({ setUserData }: { setUserData: (data: UserData) => void }) {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const formData = new FormData();
        formData.append('name', name);
        formData.append('password', password);

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();
            if (result.success) {
                console.log('Login successful, storing user data');
                // localStorage.setItem('user', JSON.stringify(result.user));
                // localStorage.setItem('userName', name);
                setUserData(result.user);
                console.log('Stored user data:', result.user);
                // window.location.reload();
            } else {
                setError(result.error || 'Login failed');
            }
        } catch (error) {
            setError('An error occurred');
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold mb-4">Login</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Username" className="border p-2 mb-4 w-full" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="border p-2 mb-4 w-full" required />
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
            </form>
        </div>
    )
}