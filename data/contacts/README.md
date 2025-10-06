# Contact Data Storage

This folder contains user contact information submitted through the contact form.

## Production vs Development Storage

### Production (Your Web Host):
- Files stored in: `../contact-submissions/` (one level above your website root)
- This folder is NOT web-accessible (secure from public viewing)
- Access via WinSCP or your hosting control panel file manager
- Path example: If your site is in `/public_html/`, data goes in `/contact-submissions/`

### Development (Local Testing):
- Files stored in: `./data/contacts/` (this folder)
- Protected by .htaccess file to deny web access

## File Structure
- Each submission is stored as an individual JSON file
- Files are named with timestamp and random ID for uniqueness
- Format: `contact-YYYYMMDD-HHMMSS-randomid.json`

## Data Format
Each JSON file contains:
- id: Unique random identifier
- name: Full name
- email: Email address (lowercase)
- phone: Phone number
- company: Company name (optional)
- message: Message (optional)
- verificationMethod: "phone" or "email"
- submittedAt: ISO timestamp of submission
- ipAddress: Submitter's IP address

## Security Features
- Files stored outside web-accessible directory
- .htaccess protection as backup
- No directory listing allowed
- Input validation and sanitization

## Accessing Your Data
1. Connect to your web host via WinSCP
2. Navigate one level above your website root folder
3. Look for the `contact-submissions` folder
4. Download JSON files to view contact submissions

## Privacy Note
This folder contains personal information. Ensure proper access controls and data protection measures are in place. Regularly back up and securely delete old submissions as needed.