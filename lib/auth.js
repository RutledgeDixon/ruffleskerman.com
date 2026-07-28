import bcrypt from 'bcrypt';

// Looks up a user by name and verifies the given password against the
// stored bcrypt hash. Returns { success: true, user } or { success: false, error }.
export async function verifyPassword(connection, name, password) {
    const [userRows] = await connection.execute(
        'SELECT id, name, hashed_password FROM user WHERE name = ?',
        [name]
    );
    if (userRows.length === 0) {
        return { success: false, error: 'User not found' };
    }
    const user = userRows[0];

    const passwordMatch = await bcrypt.compare(password, user.hashed_password);
    if (!passwordMatch) {
        return { success: false, error: 'Invalid password' };
    }

    return { success: true, user };
}

// Extracts { name, password } from a request body, handling both JSON and
// multipart/form-data submissions.
export function parseCredentials(req) {
    const contentType = req.headers['content-type'] || '';
    let name;
    let password;

    if (contentType.includes('application/json')) {
        let body = req.body;
        if (typeof body === 'string') {
            body = JSON.parse(body);
        }
        name = body?.name;
        password = body?.password;
    } else if (contentType.includes('multipart/form-data')) {
        name = req.body?.name;
        password = req.body?.password;
    } else {
        const body = req.body || {};
        name = body.name;
        password = body.password;
    }

    return { name, password };
}
