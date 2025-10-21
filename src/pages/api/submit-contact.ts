import fs from 'fs';
import path from 'path';
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  console.log('Contact submission API called');
  console.log('process.cwd():', process.cwd());
  try {
    const data = await request.json();
    console.log('Received data:', data);
    
    // Validate required fields
    if (!data.name || !data.email || !data.phone) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields: name, email, and phone are required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return new Response(JSON.stringify({ 
        error: 'Invalid email format' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate unique filename with timestamp and random ID
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T');
    const dateStr = timestamp[0].replace(/-/g, '');
    const timeStr = timestamp[1].split('-')[0].replace(/-/g, '');
    const randomId = Math.random().toString(36).substring(2, 8);
    const filename = `contact-${dateStr}-${timeStr}-${randomId}.json`;
    
    // Prepare data to save
    const contactData = {
      id: randomId,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      company: data.company ? data.company.trim() : '',
      message: data.message ? data.message.trim() : '',
      verificationMethod: data.verificationMethod || 'unknown',
      submittedAt: new Date().toISOString(),
      ipAddress: request.headers.get('x-forwarded-for') || 
                 request.headers.get('cf-connecting-ip') || 
                 request.headers.get('x-real-ip') || 
                 'unknown'
    };

    // Create secure data directory outside public_html folder (for production)
    const secureDataDir = path.join(process.cwd(), '..', 'contact-submissions');
    
    // Fallback to local data folder if outside directory isn't writable (for development)
    let dataDir = secureDataDir;
    try {
      if (!fs.existsSync(secureDataDir)) {
        fs.mkdirSync(secureDataDir, { recursive: true });
      }
      // Test write permissions
      const testFile = path.join(secureDataDir, '.test');
      fs.writeFileSync(testFile, 'test');
      fs.unlinkSync(testFile);
    } catch (error) {
      console.error('Failed to write to secure contact-submissions directory:', error);
      console.log('Cannot write to secure directory, using local data directory');
      dataDir = path.join(process.cwd(), 'data', 'contact-submissions');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
    }

    console.log(`Using data directory: ${dataDir}`);

    // Save to JSON file
    try {
      const filePath = path.join(dataDir, filename);
      fs.writeFileSync(filePath, JSON.stringify(contactData, null, 2));

      console.log(`New contact submission saved: ${filename} in ${dataDir}`);
    } catch (saveError) {
      console.error('Failed to save contact submission:', saveError);
      return new Response(JSON.stringify({ 
        error: 'Failed to save submission. Please try again later.' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Contact information saved successfully',
      id: randomId
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error processing contact form:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error. Please try again later.' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle non-POST requests
export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ 
    error: 'Method not allowed. Use POST to submit contact information.' 
  }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' }
  });
}