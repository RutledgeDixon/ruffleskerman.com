import fs from 'fs';
import path from 'path';
export { renderers } from '../../renderers.mjs';

const POST = async ({ request }) => {
  console.log("Contact submission API called");
  console.log("process.cwd():", process.cwd());
  try {
    const data = await request.json();
    console.log("Received data:", data);
    if (!data.name || !data.email || !data.phone) {
      return new Response(JSON.stringify({
        error: "Missing required fields: name, email, and phone are required"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return new Response(JSON.stringify({
        error: "Invalid email format"
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-").split("T");
    const dateStr = timestamp[0].replace(/-/g, "");
    const timeStr = timestamp[1].split("-")[0].replace(/-/g, "");
    const randomId = Math.random().toString(36).substring(2, 8);
    const filename = `contact-${dateStr}-${timeStr}-${randomId}.json`;
    const contactData = {
      id: randomId,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      company: data.company ? data.company.trim() : "",
      message: data.message ? data.message.trim() : "",
      verificationMethod: data.verificationMethod || "unknown",
      submittedAt: (/* @__PURE__ */ new Date()).toISOString(),
      ipAddress: request.headers.get("x-forwarded-for") || request.headers.get("cf-connecting-ip") || request.headers.get("x-real-ip") || "unknown"
    };
    const secureDataDir = path.join(process.cwd(), "..", "contact-submissions");
    let dataDir = secureDataDir;
    try {
      if (!fs.existsSync(secureDataDir)) {
        fs.mkdirSync(secureDataDir, { recursive: true });
      }
      const testFile = path.join(secureDataDir, ".test");
      fs.writeFileSync(testFile, "test");
      fs.unlinkSync(testFile);
    } catch (error) {
      console.error("Failed to write to secure contact-submissions directory:", error);
      console.log("Cannot write to secure directory, using local data directory");
      dataDir = path.join(process.cwd(), "data", "contact-submissions");
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
    }
    console.log(`Using data directory: ${dataDir}`);
    try {
      const filePath = path.join(dataDir, filename);
      fs.writeFileSync(filePath, JSON.stringify(contactData, null, 2));
      console.log(`New contact submission saved: ${filename} in ${dataDir}`);
    } catch (saveError) {
      console.error("Failed to save contact submission:", saveError);
      return new Response(JSON.stringify({
        error: "Failed to save submission. Please try again later."
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({
      success: true,
      message: "Contact information saved successfully",
      id: randomId
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error processing contact form:", error);
    return new Response(JSON.stringify({
      error: "Internal server error. Please try again later."
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
const GET = async () => {
  return new Response(JSON.stringify({
    error: "Method not allowed. Use POST to submit contact information."
  }), {
    status: 405,
    headers: { "Content-Type": "application/json" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
