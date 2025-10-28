import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import type { UserData } from './types';

//configure db connection
const dbConfig = {
    host: import.meta.env.DB_HOST,
    port: parseInt(import.meta.env.DB_PORT),
    user: import.meta.env.DB_USER,
    password: import.meta.env.DB_PASSWORD,
    database: import.meta.env.DB_NAME,
};

export async function loginUser(name: string, password: string): Promise<{ success: boolean, data?: any, error?: string }> {
    console.log(`Attempting login [auth.ts]: ${name}`);
    if (!name || !password) {
        console.log('Missing name or password');
        return { success: false, error: 'Missing name or password' };
    }

    const connection = await mysql.createConnection(dbConfig);

    try {
        // Fetch the user by name
        const [userRows] = await connection.execute('SELECT id, name, hashed_password FROM user WHERE name = ?', [name]) as [any[], any];
        if (userRows.length === 0) {
            console.log(`User not found: ${name}`);
            return { success: false, error: 'User not found' };
        }

        const user = userRows[0];

        // Verify the password
        const isPasswordValid = await bcrypt.compare(password, user.hashed_password);
        if (!isPasswordValid) {
            console.log(`Invalid password for user: ${name}`);
            return { success: false, error: 'Invalid password' };
        }

        console.log(`Login successful for user: ${name}`);

        // Fetch full user data (categories and cards)
        const [categoryRows] = await connection.execute('SELECT id, title, description, progress FROM category WHERE user_id = ?', [user.id]) as [any[], any];
        const categories = [];
        for (const cat of categoryRows) {
            const [cardRows] = await connection.execute('SELECT title, description, answer, imageurl, url, checked FROM card WHERE category_id = ?', [cat.id]) as [any[], any];
            categories.push({
                id: cat.id,
                title: cat.title,
                description: cat.description,
                progress: cat.progress,
                showCards: false,
                cards: cardRows
            });
        }

        const data = {
            id: user.id,
            name: user.name,
            categories
        };

        return { success: true, data };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: 'Login failed' };
    } finally {
        await connection.end();
    }
}