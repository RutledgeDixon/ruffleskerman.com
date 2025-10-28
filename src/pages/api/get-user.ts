//USED FOR TESTING WITH JSON FILE BASED USERS
import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';

export const GET: APIRoute = async ({ url }) => {
    try {
        const userName = url.searchParams.get('name');
        if (!userName) {
            return new Response(JSON.stringify({ error: 'Missing user name' }), { status: 400 });
        }
        // extract user from json file
        const filePath = path.join(process.cwd(), 'src', 'lib', 'plannerUsers.json');
        const fullData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const userData = fullData.users.find((u: any) => u.name === userName);
        if (userData) {
            return new Response(JSON.stringify(userData), { status: 200 });
        }
        return new Response(JSON.stringify({ error: 'User not found' }), { status: 404 });
    } catch (error) {
        console.error('Error fetching user:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch user' }), { status: 500 });
    }
};