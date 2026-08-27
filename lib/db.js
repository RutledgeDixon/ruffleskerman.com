import mysql from 'mysql2/promise';

// Builds the shared connection config from environment variables. `database`
// lets each route target its own database (e.g. the planner's DB_NAME vs.
// the movie poll's dedicated database).
//
// DB_SSL_CA holds the database server's CA certificate (PEM, with literal
// \n for newlines since it's stored as a single-line env var). It's only
// set in production, where the DB is reached over the internet and the
// server enforces TLS for non-local connections; local/dev connections
// stay unencrypted since they never leave the host.
export function getDbConfig(database) {
    const config = {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '3306'),
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database,
    };

    if (process.env.DB_SSL_CA) {
        config.ssl = {
            ca: process.env.DB_SSL_CA.replace(/\\n/g, '\n'),
            rejectUnauthorized: true,
        };
    }

    return config;
}

export function getConnection(database) {
    return mysql.createConnection(getDbConfig(database));
}
