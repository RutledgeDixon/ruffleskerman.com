import mysql from 'mysql2/promise';

// Builds the shared connection config from environment variables. `database`
// lets each route target its own database (e.g. the planner's DB_NAME vs.
// the movie poll's dedicated database).
export function getDbConfig(database) {
    return {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '3306'),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database,
    };
}

export function getConnection(database) {
    return mysql.createConnection(getDbConfig(database));
}
