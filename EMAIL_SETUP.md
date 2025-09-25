# Email Setup Instructions for aedxpx@outlook.com

## To Enable Real Email Sending:

### Step 1: Get an App Password for Outlook
1. Go to https://account.microsoft.com/security
2. Sign in with **aedxpx@outlook.com**
3. Click on "Security" tab
4. Under "Advanced security options", click "App passwords"
5. Click "Create a new app password"
6. Give it a name like "AedxCorp Website"
7. Copy the generated password (it will look like: abcd-efgh-ijkl-mnop)

### Step 2: Update the .env.local file
1. Open `.env.local` in your website folder
2. Replace `your_outlook_app_password_here` with the actual app password
3. Save the file

### Step 3: Restart the Dev Server
```bash
cd c:\Users\aedxp\AedxCorpWebsite\website
npm run dev
```

### Step 4: Test the Email
1. Go to http://localhost:3000/en
2. Click any flip card
3. Check the acceptance checkbox
4. Click "Send Response"
5. Check your server console and aedxpx@outlook.com inbox

## Current Configuration:
- **SMTP Server:** smtp-mail.outlook.com:587
- **From Email:** aedxpx@outlook.com  
- **To Email:** aedxpx@outlook.com
- **Security:** TLS enabled

The system will automatically detect if SMTP is configured and either:
✅ Send real emails (if app password is set)
⚠️ Log to console (if app password is missing)

## Troubleshooting:
- If emails don't send, check the server console for error messages
- Make sure 2FA is enabled on the Outlook account
- The app password is different from your regular login password