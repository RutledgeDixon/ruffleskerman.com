import type { VercelRequest, VercelResponse } from '@vercel/node';
import mysql from 'mysql2/promise';

interface UserData {
    id?: number;
    name: string;
    password?: string;
    categories: Category[];
}

interface Category {
    id?: number;
    title: string;
    description: string;
    progress: number;
    showCards?: boolean;
    cards: Card[];
}

interface Card {
    id?: number;
    title: string;
    description: string;
    answer: string;
    imageurl: string;
    url: string;
    checked: boolean;
}

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

async function handleSave(name: string, userData: UserData) {
    if (!name || !userData) {
        throw new Error('Missing name or userData');
    }

    const connection = await mysql.createConnection(dbConfig);

    try {
        await connection.beginTransaction();

        const [userRows] = await connection.execute('SELECT id FROM user WHERE name = ?', [name]);
        const userId = (userRows as any[])[0]?.id;
        if (!userId) throw new Error('User ID not found');

        await connection.execute('DELETE FROM card WHERE category_id IN (SELECT id FROM category WHERE user_id = ?)', [userId]);
        await connection.execute('DELETE FROM category WHERE user_id = ?', [userId]);

        for (const category of userData.categories) {
            const [categoryResult] = await connection.execute(
                'INSERT INTO category (title, description, progress, user_id) VALUES (?, ?, ?, ?)',
                [category.title, category.description, category.progress, userId]
            );
            const categoryId = (categoryResult as any).insertId;

            for (const card of category.cards) {
                await connection.execute(
                    'INSERT INTO card (title, description, answer, imageurl, url, checked, category_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [card.title, card.description, card.answer, card.imageurl, card.url, card.checked, categoryId]
                );
            }
        }

        await connection.commit();
        return { success: true, message: `User "${name}" data saved` };
    } catch (error) {
        await connection.rollback();
        throw error;
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
        
        const { action, name, password, userData } = body || {};
        
        if (!action) {
            return res.status(400).json({ error: 'Action is required' });
        }

        if (action === 'login') {
            if (!name || !password) {
                return res.status(400).json({ error: 'Name and password are required' });
            }
            const result = await loginUser(name, password);
            if (result.success) {
                return res.status(200).json(result.data);
            } else {
                return res.status(400).json({ error: result.error });
            }
        } else if (action === 'save') {
            if (!name || !userData) {
                return res.status(400).json({ error: 'Name and userData are required' });
            }
            const result = await handleSave(name, userData);
            return res.status(200).json(result);
        } else {
            return res.status(400).json({ error: 'Invalid action' });
        }
    } catch (error) {
        console.error('Request error:', error);
        return res.status(500).json({ error: 'Request failed', details: error instanceof Error ? error.message : 'Unknown error' });
    }
}
