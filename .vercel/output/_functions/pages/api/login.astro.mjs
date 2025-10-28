import { l as loginUser } from '../../chunks/auth_Cd7quO6B.mjs';
export { renderers } from '../../renderers.mjs';

const POST = async ({ request }) => {
  console.log("POST request received at /api/login");
  const formData = await request.formData();
  const name = formData.get("name");
  const password = formData.get("password");
  console.log(`Login attempt for user: ${name}`);
  const result = await loginUser(name, password);
  console.log("Login result:", result);
  if (result.success) {
    console.log("Login successful [login.ts], returning user data");
    return new Response(JSON.stringify({ success: true, user: result.data }), { status: 200 });
  } else {
    console.log("Login failed [login.ts]");
    return new Response(JSON.stringify({ success: false, error: result.error }), { status: 400 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
