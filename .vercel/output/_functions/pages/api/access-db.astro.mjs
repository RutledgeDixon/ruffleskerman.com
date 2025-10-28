import mysql from 'mysql2/promise';
import 'bcrypt';
import { l as loginUser } from '../../chunks/auth_Cd7quO6B.mjs';
export { renderers } from '../../renderers.mjs';

const dbConfig = {
  host: "47.160.11.249",
  port: parseInt("3306"),
  user: "web-link",
  password: "Gooter240!",
  database: "wedding_planner_db"
};
async function handleSave(name, userData) {
  if (!name || !userData) {
    return new Response(JSON.stringify({ error: "Missing name or userData" }), { status: 400 });
  }
  const connection = await mysql.createConnection(dbConfig);
  try {
    await connection.beginTransaction();
    const [userRows] = await connection.execute("SELECT id FROM user WHERE name = ?", [name]);
    const userId = userRows[0]?.id;
    if (!userId) throw new Error("User ID not found");
    await connection.execute("DELETE FROM card WHERE category_id IN (SELECT id FROM category WHERE user_id = ?)", [userId]);
    await connection.execute("DELETE FROM category WHERE user_id = ?", [userId]);
    for (const category of userData.categories) {
      const [categoryResult] = await connection.execute(
        "INSERT INTO category (title, description, progress, user_id) VALUES (?, ?, ?, ?)",
        [category.title, category.description, category.progress, userId]
      );
      const categoryId = categoryResult.insertId;
      for (const card of category.cards) {
        await connection.execute(
          "INSERT INTO card (title, description, answer, imageurl, url, checked, category_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [card.title, card.description, card.answer, card.imageurl, card.url, card.checked, categoryId]
        );
      }
    }
    await connection.commit();
    return new Response(JSON.stringify({ success: true, message: `User "${name}" data saved` }), { status: 200 });
  } catch (error) {
    await connection.rollback();
    console.error("Save error:", error);
    return new Response(JSON.stringify({ error: "Save failed" }), { status: 500 });
  } finally {
    await connection.end();
  }
}
const POST = async ({ request }) => {
  console.log("POST called for access-db");
  try {
    const body = await request.json();
    const { action, name, password, userData } = body;
    if (action === "login") {
      const result = await loginUser(name, password);
      if (result.success) {
        return new Response(JSON.stringify(result.data), { status: 200 });
      } else {
        return new Response(JSON.stringify({ error: result.error }), { status: 400 });
      }
    } else if (action === "save") {
      return await handleSave(name, userData);
    } else {
      return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400 });
    }
  } catch (error) {
    console.error("Request error:", error);
    return new Response(JSON.stringify({ error: "Request failed" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
