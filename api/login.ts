import type { VercelRequest, VercelResponse } from '@vercel/node';
import mysql from 'mysql2/promise';

const dbConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

async function loginUser(name: string, password: string) {
    const connection = await mysql.createConnection(dbConfig);
    try {
        const [userRows] = await connection.execute('SELECT id, name, password FROM user WHERE name = ?', [name]) as [any[], any];
        if (userRows.length === 0) {
            return { success: false, error: 'User not found' };
        }
        const user = userRows[0];

        // Fetch categories
        const [categoryRows] = await connection.execute('SELECT * FROM category WHERE user_id = ?', [user.id]);
        const categories = [];
        for (const category of categoryRows as any[]) {
            const [cardRows] = await connection.execute('SELECT * FROM card WHERE category_id = ?', [category.id]);
            const cards = (cardRows as any[]).map((card: any) => ({
                id: card.id,
                title: card.title,
                description: card.description,
                answer: card.answer,
                imageurl: card.imageurl,
                checked: card.checked,
                url: card.url,
            }));
            categories.push({
                id: category.id,
                title: category.title,
                description: category.description,
                progress: category.progress,
                showCards: false,
                cards: cards,
            });
        }

        const userData = {
            id: user.id,
            name: user.name,
            password: user.password,
            categories: categories,
        };

        return { success: true, data: userData };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: 'Database error' };
    } finally {
        await connection.end();
    }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Parse body if it's a string (Vercel sometimes doesn't auto-parse)
        let body = req.body;
        if (typeof body === 'string') {
            body = JSON.parse(body);
        }
        
        const { name, password } = body || {};
        
        if (!name || !password) {
            console.error('Missing name or password in request body:', body);
            return res.status(400).json({ success: false, error: 'Name and password are required' });
        }
        
        console.log(`Login attempt for user: ${name}`);

        const result = await loginUser(name, password);
        console.log('Login result:', result);
        
        if (result.success) {
            console.log('Login successful [login.ts], returning user data');
            return res.status(200).json({ success: true, user: result.data });
        } else {
            console.log('Login failed [login.ts]');
            return res.status(400).json({ success: false, error: result.error });
        }
    } catch (error) {
        console.error('Request error:', error);
        return res.status(500).json({ error: 'Request failed', details: error instanceof Error ? error.message : 'Unknown error' });
    }
}
