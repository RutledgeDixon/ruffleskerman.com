import { getConnection } from '../lib/db.js';
import { verifyPassword, parseCredentials } from '../lib/auth.js';

async function loginUser(name, password) {
    let connection;
    try {
        connection = await getConnection('movie_poll_db');

        const auth = await verifyPassword(connection, name, password);
        if (!auth.success) {
            return auth;
        }
        const { user } = auth;

        // Fetch movie poll data for this user.
        const [categoryRows] = await connection.execute('SELECT * FROM movie WHERE user_id = ?', [user.id]);
        const movies = [];
        for (const category of categoryRows) {
            const [cardRows] = await connection.execute('SELECT * FROM question WHERE movie_id = ?', [category.id]);
            const questions = cardRows.map((card) => ({
                id: card.id,
                title: card.title,
                description: card.description,
                answer: card.answer,
                imageurl: card.imageurl,
                checked: card.answer !== null,
                url: card.url,
            }));
            movies.push({
                id: category.id,
                title: category.title,
                description: category.description,
                progress: category.progress,
                showCards: false,
                questions: questions,
            });
        }

        const userData = {
            id: user.id,
            name: user.name,
            movies: movies,
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

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, password } = parseCredentials(req);

        if (!name || !password) {
            return res.status(400).json({ success: false, error: 'Name and password are required' });
        }

        const result = await loginUser(name, password);

        if (result.success) {
            return res.status(200).json({ success: true, user: result.data });
        } else {
            return res.status(400).json({ success: false, error: result.error });
        }
    } catch (error) {
        console.error('Request error:', error);
        return res.status(500).json({ error: 'Request failed', details: error instanceof Error ? error.message : 'Unknown error' });
    }
}

