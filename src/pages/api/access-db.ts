import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import type { APIRoute } from 'astro';
import type { UserData } from '../../lib/types';

//configure db connection
const dbConfig = {
    host: import.meta.env.DB_HOST,
    port: parseInt(import.meta.env.DB_PORT),
    user: import.meta.env.DB_USER,
    password: import.meta.env.DB_PASSWORD,
    database: import.meta.env.DB_NAME,
};

// Helper function for login
async function handleLogin(name: string, password: string) {
    if (!name || !password) {
        return new Response(JSON.stringify({ error: 'Missing name or password' }), { status: 400 });
    }

    const connection = await mysql.createConnection(dbConfig);

    try {
        // Fetch the user by name
        const [userRows] = await connection.execute('SELECT id, name, hashed_password FROM user WHERE name = ?', [name]) as [any[], any];
        if (userRows.length === 0) {
            return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
        }

        const user = userRows[0];

        // Verify the password
        const isPasswordValid = await bcrypt.compare(password, user.hashed_password);
        if (!isPasswordValid) {
            return new Response(JSON.stringify({ error: 'Invalid password' }), { status: 401 });
        }

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

        return new Response(JSON.stringify({
            id: user.id,
            name: user.name,
            categories
        }), { status: 200 });
    } catch (error) {
        console.error('Login error:', error);
        return new Response(JSON.stringify({ error: 'Login failed' }), { status: 500 });
    } finally {
        await connection.end();
    }
}

// Helper function for saving user data
async function handleSave(name: string, userData: UserData) {
    if (!name || !userData || !userData.password) {
        return new Response(JSON.stringify({ error: 'Missing name, userData, or password' }), { status: 400 });
    }

    const connection = await mysql.createConnection(dbConfig);

    try {
        await connection.beginTransaction();

        // Upsert user
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        await connection.execute(
            'INSERT INTO user (name, password) VALUES (?, ?) ON DUPLICATE KEY UPDATE password = VALUES(password)',
            [name, hashedPassword]
        );

        // Get user ID
        const [userRows] = await connection.execute('SELECT id FROM user WHERE name = ?', [name]);
        const userId = (userRows as any[])[0]?.id;
        if (!userId) throw new Error('User ID not found');

        // Delete existing categories and cards for the user
        await connection.execute('DELETE FROM card WHERE category_id IN (SELECT id FROM category WHERE user_id = ?)', [userId]);
        await connection.execute('DELETE FROM category WHERE user_id = ?', [userId]);

        // Insert new categories and cards
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
        return new Response(JSON.stringify({ success: true, message: `User "${name}" data saved` }), { status: 200 });
    } catch (error) {
        await connection.rollback();
        console.error('Save error:', error);
        return new Response(JSON.stringify({ error: 'Save failed' }), { status: 500 });
    } finally {
        await connection.end();
    }
}

export const POST: APIRoute = async ({ request }) => {
    console.log("POST called for access-db");
    try {
        const body = await request.json();
        const { action, name, password, userData } = body;

        if (action === 'login') {
            return await handleLogin(name, password);
        } else if (action === 'save') {
            return await handleSave(name, userData);
        } else {
            return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400 });
        }
    } catch (error) {
        console.error('Request error:', error);
        return new Response(JSON.stringify({ error: 'Request failed' }), { status: 500 });
    }
};


// export const GET: APIRoute = async ({ url }) => {
//     console.log("GET called for access-db");
//     try {
//         const name = url.searchParams.get('name');
//         console.log("Name param:", name);
//         if (!name) {
//             return new Response(JSON.stringify({ error: 'Missing user name' }), { status: 400 });
//         }

//         //connect to the database
//         const connection = await mysql.createConnection(dbConfig);

//         //fetch user data
//         const [userRows] = await connection.execute('SELECT id, name, password FROM user WHERE name = ?', [name]) as [any[], any];
//         if (userRows.length === 0) {
//             await connection.end();
//             return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
//         }
//         const user = (userRows as any[])[0];

//         //fetch categories from the user
//         const [categoryRows] = await connection.execute('SELECT * FROM category WHERE user_id = ?', [user.id]);

//         //build categories formatted correctly with cards
//         const categories = [];
//         for (const category of categoryRows as any[]) {
//             const [cardRows] = await connection.execute('SELECT * FROM card WHERE category_id = ?', [category.id]);
//             const cards = (cardRows as any[]).map(card => ({
//                 id: card.id,
//                 title: card.title,
//                 description: card.description,
//                 answer: card.answer,
//                 imageurl: card.imageurl,
//                 checked: card.checked,
//                 url: card.url,
//             }));
//             categories.push({
//                 id: category.id,
//                 title: category.title,
//                 description: category.description,
//                 progress: category.progress,
//                 showCards: false, // Instantiate showcards as false
//                 cards: cards,
//             });
//         }

//         //close the connection
//         await connection.end();

//         //format user data as JSON
//         const userData = {
//             id: user.id,
//             name: user.name,
//             password: user.password,
//             categories: categories,
//         };

//         return new Response(JSON.stringify(userData), { 
//             status: 200,
//             headers: { 'Content-Type': 'application/json' }, 
//         });

//     } catch (error) {
//         console.error('Database error:', error);
//         return new Response(JSON.stringify({ error: 'Database error' }), { status: 500 });
//     }
// }