import type { VercelRequest, VercelResponse } from '@vercel/node';
import fs from 'fs';
import path from 'path';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed. Use POST to submit contact information.' 
    });
  }

  console.log('Contact submission API called');
  
  try {
    // Parse body if it's a string (Vercel sometimes doesn't auto-parse)
    let data = req.body;
    if (typeof data === 'string') {
      data = JSON.parse(data);
    }
    
    console.log('Received data:', data);
    
    // Validate required fields
    if (!data || !data.name || !data.email || !data.phone) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, email, and phone are required' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return res.status(400).json({ 
        error: 'Invalid email format' 
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
      ipAddress: req.headers['x-forwarded-for'] || 
                 req.headers['cf-connecting-ip'] || 
                 req.headers['x-real-ip'] || 
                 'unknown'
    };

    // For Vercel, use /tmp directory which is writable
    const dataDir = '/tmp/contact-submissions';
    
    try {
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
    } catch (error) {
      console.error('Failed to create data directory:', error);
      return res.status(500).json({ 
        error: 'Failed to save submission. Please try again later.' 
      });
    }

    console.log(`Using data directory: ${dataDir}`);

    // Save to JSON file
    try {
      const filePath = path.join(dataDir, filename);
      fs.writeFileSync(filePath, JSON.stringify(contactData, null, 2));

      console.log(`New contact submission saved: ${filename} in ${dataDir}`);
    } catch (saveError) {
      console.error('Failed to save contact submission:', saveError);
      return res.status(500).json({ 
        error: 'Failed to save submission. Please try again later.' 
      });
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Contact information saved successfully',
      id: randomId
    });

  } catch (error) {
    console.error('Error processing contact form:', error);
    
    return res.status(500).json({ 
      error: 'Internal server error. Please try again later.' 
    });
  }
}
