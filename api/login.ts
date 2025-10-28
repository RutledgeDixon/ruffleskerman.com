import type { VercelRequest, VercelResponse } from '@vercel/node';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

const dbConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

async function loginUser(name: string, password: string) {
    let connection;
    try {
        console.log('Attempting to connect to database...');
        console.log('DB Config:', {
            host: process.env.DB_HOST ? 'set' : 'missing',
            port: process.env.DB_PORT || '3306',
            user: process.env.DB_USER ? 'set' : 'missing',
            database: process.env.DB_NAME ? 'set' : 'missing',
        });
        
        connection = await mysql.createConnection(dbConfig);
        console.log('Database connected successfully');
        
        const [userRows] = await connection.execute('SELECT id, name, hashed_password FROM user WHERE name = ?', [name]) as [any[], any];
        if (userRows.length === 0) {
            return { success: false, error: 'User not found' };
        }
        const user = userRows[0];

        // Verify password using bcrypt
        const passwordMatch = await bcrypt.compare(password, user.hashed_password);
        if (!passwordMatch) {
            return { success: false, error: 'Invalid password' };
        }

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
            hashed_password: user.hashed_password,
            categories: categories,
        };

        return { success: true, data: userData };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: 'Database error' };
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        let name: string | undefined;
        let password: string | undefined;

        // Check if it's FormData or JSON
        const contentType = req.headers['content-type'] || '';
        
        if (contentType.includes('application/json')) {
            // Parse body if it's JSON
            let body = req.body;
            if (typeof body === 'string') {
                body = JSON.parse(body);
            }
            name = body?.name;
            password = body?.password;
        } else if (contentType.includes('multipart/form-data')) {
            // Handle FormData - it's already parsed by Vercel into req.body
            name = req.body?.name;
            password = req.body?.password;
        } else {
            // Try to get from body anyway
            const body = req.body || {};
            name = body.name;
            password = body.password;
        }
        
        if (!name || !password) {
            console.error('Missing name or password. Content-Type:', contentType, 'Body:', req.body);
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
