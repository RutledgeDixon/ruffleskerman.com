import mysql from 'mysql2/promise';

const dbConfig = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

async function handleSave(name, userData) {
    console.log('handleSave called with:', { name, userDataKeys: Object.keys(userData || {}) });

    if (!name || !userData) {
        throw new Error('Missing name or userData');
    }

    const connection = await mysql.createConnection(dbConfig);

    try {
        await connection.beginTransaction();

        const [userRows] = await connection.execute('SELECT id FROM user WHERE name = ?', [name]);
        const userId = userRows[0]?.id;
        if (!userId) throw new Error('User ID not found');

        console.log('Found user ID:', userId);

        await connection.execute('DELETE FROM card WHERE category_id IN (SELECT id FROM category WHERE user_id = ?)', [userId]);
        await connection.execute('DELETE FROM category WHERE user_id = ?', [userId]);

        console.log('Deleted existing data, inserting new data...');

        for (const category of userData.categories) {
            console.log('Inserting category:', category.title);
            const [categoryResult] = await connection.execute(
                'INSERT INTO category (title, description, progress, user_id) VALUES (?, ?, ?, ?)',
                [category.title, category.description, category.progress, userId]
            );
            const categoryId = categoryResult.insertId;
            console.log('Inserted category with ID:', categoryId);

            for (const card of category.cards) {
                console.log('Inserting card:', card.title);
                await connection.execute(
                    'INSERT INTO card (title, description, answer, imageurl, url, checked, category_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [card.title, card.description, card.answer, card.imageurl, card.url, card.checked, categoryId]
                );
            }
        }

        await connection.commit();
        console.log('Transaction committed successfully');
        return { success: true, message: `User "${name}" data saved` };
    } catch (error) {
        console.error('Error in handleSave:', error);
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
        // Parse body if it's a string (Vercel sometimes doesn't auto-parse)
        let body = req.body;
        if (typeof body === 'string') {
            body = JSON.parse(body);
        }

        console.log('Access-DB API called with body:', JSON.stringify(body, null, 2));

        const { action, name, password, userData } = body || {};

        if (!action) {
            return res.status(400).json({ error: 'Action is required' });
        }

        if (action === 'save') {
            if (!name || !userData) {
                console.log('Missing name or userData:', { name, userData: !!userData });
                return res.status(400).json({ error: 'Name and userData are required' });
            }
            console.log('Attempting to save data for user:', name);
            const result = await handleSave(name, userData);
            console.log('Save result:', result);
            return res.status(200).json(result);
        } else {
            return res.status(400).json({ error: 'Invalid action' });
        }
    } catch (error) {
        console.error('Request error:', error);
        return res.status(500).json({ error: 'Request failed', details: error instanceof Error ? error.message : 'Unknown error' });
    }
}
