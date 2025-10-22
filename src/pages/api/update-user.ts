import type { APIRoute } from 'astro';
import fs from 'fs';
import path from 'path';
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    try {
        const newData = await request.json();
        const filePath = path.join(process.cwd(), 'src', 'lib', 'plannerUsers.json');
        
        const fullData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const userIndex = fullData.users.findIndex((u: any) => u.name === newData.name);
        if (userIndex === -1) {
            return new Response(JSON.stringify({ error: `User "${newData.name}" not found` }), { status: 404 });
        }
        fullData.users[userIndex] = newData;
        fs.writeFileSync(filePath, JSON.stringify(fullData, null, 2));
        
        return new Response(JSON.stringify({ success: true, message: `User "${newData.name}" updated` }), { status: 200 });
    } catch (error) {
        console.error('Error updating user:', error);
        return new Response(JSON.stringify({ error: 'Failed to update user' }), { status: 500 });
    }
};