import type { APIRoute } from 'astro';
import { loginUser } from '../../lib/auth';

export const POST: APIRoute = async ({ request }) => {
    console.log('POST request received at /api/login');
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const password = formData.get('password') as string;
    console.log(`Login attempt for user: ${name}`);

    const result = await loginUser(name, password);
    console.log('Login result:', result);
    if (result.success) {
        console.log('Login successful [login.ts], returning user data');
        return new Response(JSON.stringify({ success: true, user: result.data }), { status: 200 });
    } else {
        console.log('Login failed [login.ts]');
        return new Response(JSON.stringify({ success: false, error: result.error }), { status: 400 });
    }
};