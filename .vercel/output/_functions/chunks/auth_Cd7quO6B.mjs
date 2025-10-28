import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

const dbConfig = {
  host: "47.160.11.249",
  port: parseInt("3306"),
  user: "web-link",
  password: "Gooter240!",
  database: "wedding_planner_db"
};
async function loginUser(name, password) {
  console.log(`Attempting login [auth.ts]: ${name}`);
  if (!name || !password) {
    console.log("Missing name or password");
    return { success: false, error: "Missing name or password" };
  }
  const connection = await mysql.createConnection(dbConfig);
  try {
    const [userRows] = await connection.execute("SELECT id, name, hashed_password FROM user WHERE name = ?", [name]);
    if (userRows.length === 0) {
      console.log(`User not found: ${name}`);
      return { success: false, error: "User not found" };
    }
    const user = userRows[0];
    const isPasswordValid = await bcrypt.compare(password, user.hashed_password);
    if (!isPasswordValid) {
      console.log(`Invalid password for user: ${name}`);
      return { success: false, error: "Invalid password" };
    }
    console.log(`Login successful for user: ${name}`);
    const [categoryRows] = await connection.execute("SELECT id, title, description, progress FROM category WHERE user_id = ?", [user.id]);
    const categories = [];
    for (const cat of categoryRows) {
      const [cardRows] = await connection.execute("SELECT title, description, answer, imageurl, url, checked FROM card WHERE category_id = ?", [cat.id]);
      categories.push({
        id: cat.id,
        title: cat.title,
        description: cat.description,
        progress: cat.progress,
        showCards: false,
        cards: cardRows
      });
    }
    const data = {
      id: user.id,
      name: user.name,
      categories
    };
    return { success: true, data };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Login failed" };
  } finally {
    await connection.end();
  }
}

export { loginUser as l };
