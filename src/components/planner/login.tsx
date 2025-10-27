import "@/styles/planner.css";
import { Button } from "@/components/ui/button";
import { useState } from 'react';

declare global {
    interface Window {
        doLogin: (name: string, password: string) => Promise<void>;
    }
}

export default function Login() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (window.doLogin) {
            window.doLogin(name, password);
        }
    };

    return (
        <div className="login-container">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Username" className="border p-2 mb-4 w-full" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="border p-2 mb-4 w-full" />
            <Button onClick={handleLogin}>Login</Button>
        </div>
    )
}