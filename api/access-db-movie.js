import mysql from 'mysql2/promise';

const dbConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'movie_poll_db',
};

async function handleSave(name, userData) {
    if (!name || !userData) {
        throw new Error('Missing name or userData');
    }

    const connection = await mysql.createConnection(dbConfig);

    try {
        await connection.beginTransaction();

        const [userRows] = await connection.execute('SELECT id FROM user WHERE name = ?', [name]);
        const userId = userRows[0]?.id;
        if (!userId) {
            throw new Error('User ID not found');
        }

        await connection.execute(
            'DELETE FROM question WHERE movie_id IN (SELECT id FROM movie WHERE user_id = ?)',
            [userId]
        );
        await connection.execute('DELETE FROM movie WHERE user_id = ?', [userId]);

        for (const movie of userData.movies || []) {
            const [movieResult] = await connection.execute(
                'INSERT INTO movie (title, description, progress, user_id) VALUES (?, ?, ?, ?)',
                [movie.title, movie.description, movie.progress || 0, userId]
            );
            const movieId = movieResult.insertId;

            for (const question of movie.questions || []) {
                await connection.execute(
                    'INSERT INTO question (title, description, answer, imageurl, url, checked, movie_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [
                        question.title,
                        question.description,
                        question.answer || '',
                        question.imageurl || '',
                        question.url || '',
                        !!question.checked,
                        movieId,
                    ]
                );
            }
        }

        await connection.commit();
        return { success: true, message: `User "${name}" movie poll data saved` };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        await connection.end();
    }
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        let body = req.body;
        if (typeof body === 'string') {
            body = JSON.parse(body);
        }

        const { action, name, userData } = body || {};

        if (action !== 'save') {
            return res.status(400).json({ error: 'Invalid action' });
        }

        if (!name || !userData) {
            return res.status(400).json({ error: 'Name and userData are required' });
        }

        const result = await handleSave(name, userData);
        return res.status(200).json(result);
    } catch (error) {
        console.error('Movie access-db error:', error);
        return res.status(500).json({
            error: 'Request failed',
            details: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}
