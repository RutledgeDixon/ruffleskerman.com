//takes an account name as an input
//creates an sql file that can be run on the db to create that account

import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
// import jsonData from './wedding-data.json' assert { type: 'json' };
//get json data from wedding-data.json

function createAccountSQL(name, pass) {
    const hashedPassword = bcrypt.hashSync(pass, 10);
    let sql = `USE wedding_planner_db;\n\n`;
    sql += `INSERT INTO user (name, hashed_password) VALUES ('${name}', '${hashedPassword}');\n\n`;
    return sql;
}

function insertDefaultPlannerSQL(name, jsonData) {
    let sql = ``;
    //use jsonData to find the categories and cards and call the functions accordingly
    jsonData.categories.forEach(category => {
        //add the category
        sql += addCategorySQL(name, category.name);
        //add the cards for the category
        category.cards.forEach(card => {
            sql += addCardSQL(name, category, card);
        });
    });
    return sql;
}

function addCategorySQL(name, category) {
    let sql = ``;
    sql += `INSERT INTO category (title, description, progress, user_id) VALUES `;
    sql += `('${category.replace(/'/g, "")}', '', 0, (SELECT id FROM user WHERE name='${name}'));`;
    sql += `\n`;
    return sql;
}

function addCardSQL(username, category, card) {
    let sql = `INSERT INTO card (title, description, answer, imageurl, url, checked, category_id) VALUES `;
    sql += `('${card.name.replace(/'/g, "")}', '${card.question.replace(/'/g, "")}', '', '', '', false, (SELECT id FROM category WHERE title='${category.name.replace(/'/g, "")}' AND user_id=(SELECT id FROM user WHERE name='${username}')));`;
    sql += `\n`;
    return sql;
}

async function main() {
    const jsonData = JSON.parse(fs.readFileSync('./wedding-data.json', 'utf8'));

    //take name and password as input from command line
    let name, password;
    name = process.argv[2];
    password = process.argv[3];
    if (!name || !password) {
        console.log("Usage: node setup-account-sql.js <username> <password>");
        process.exit(1);
    }
    //create sql file and add sql for name and password
    const hashedPassword = bcrypt.hashSync(password, 10);
    let sql = createAccountSQL(name, hashedPassword);

    //add default sql for categories and cards
    sql += insertDefaultPlannerSQL(name, jsonData);

    //save the sql file
    //const filePath = path.join(__dirname, `${name}_setup.sql`);
    fs.writeFileSync(`${name}_setup.sql`, sql);
    console.log(`Setup file for ${name} created at ${name}_setup.sql`);
}

main();