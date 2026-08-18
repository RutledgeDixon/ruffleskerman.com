import "@/styles/planner.css";
import { Button } from "@/components/ui/button";
import { useState } from 'react';

export default function Login({ setUserData }) {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, password }),
            });
            const result = await response.json();
            if (result.success) {
                setUserData(result.user);
            } else {
                setError(result.error || 'Login failed');
            }
        } catch {
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
                <Button variant="letu" type="submit">Login</Button>
            </form>
        </div>
    )
}
