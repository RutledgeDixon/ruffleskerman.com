import { getConnection } from '../lib/db.js';

function mapRowsToStatsData(rows) {
    const moviesByTitle = new Map();

    for (const row of rows) {
        let movie = moviesByTitle.get(row.movie_title);
        if (!movie) {
            movie = {
                title: row.movie_title,
                description: row.movie_description,
                questions: [],
            };
            moviesByTitle.set(row.movie_title, movie);
        }

        // Movies with no questions still appear via LEFT JOINs.
        if (row.question_title == null) {
            continue;
        }

        let question = movie.questions.find(
            (q) => q.title === row.question_title && q.description === row.question_description
        );

        if (!question) {
            question = {
                title: row.question_title,
                description: row.question_description,
                answers: [],
            };
            movie.questions.push(question);
        }

        question.answers.push({
            user: row.user_name,
            answer: row.answer,
        });
    }

    return { movies: Array.from(moviesByTitle.values()) };
}

async function handleRead() {
    const connection = await getConnection('movie_poll_db');

    try {
        const [rows] = await connection.execute(
            `SELECT
                m.title AS movie_title,
                m.description AS movie_description,
                q.title AS question_title,
                q.description AS question_description,
                u.name AS user_name,
                q.answer AS answer
            FROM movie m
            JOIN user u ON u.id = m.user_id
            LEFT JOIN question q ON q.movie_id = m.id
            ORDER BY m.title, q.title, u.name`
        );

        return {
            success: true,
            data: mapRowsToStatsData(rows),
        };
    } finally {
        await connection.end();
    }
}

async function handleSave(name, userData) {
    if (!name || !userData) {
        throw new Error('Missing name or userData');
    }

    const connection = await getConnection('movie_poll_db');

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
                const parsedAnswer =
                    typeof question.answer === 'boolean' ? Number.NaN : Number(question.answer);
                const answerValue =
                    question.answer === '' || question.answer == null || Number.isNaN(parsedAnswer)
                        ? null
                        : Math.max(0, Math.min(10, Math.round(parsedAnswer)));

                const checkedValue = answerValue !== null;

                await connection.execute(
                    'INSERT INTO question (title, description, answer, checked, movie_id) VALUES (?, ?, ?, ?, ?)',
                    [
                        question.title,
                        question.description,
                        answerValue,
                        checkedValue,
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

        let result;
        if (action === 'save') {
            if (!name || !userData) {
                return res.status(400).json({ error: 'Name and userData are required for save' });
            }
            result = await handleSave(name, userData);
        } else if (action === 'read') {
            result = await handleRead();
        } else {
            return res.status(400).json({ error: 'Invalid action' });
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error('Movie access-db error:', error);
        return res.status(500).json({
            error: 'Request failed',
            details: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}
