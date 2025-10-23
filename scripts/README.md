# Create Super Admin Script

This script creates a super admin user in Firebase with a hashed password stored in Firestore.

## Setup

### 1. Get Firebase Admin SDK Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Project Settings** (gear icon) > **Service Accounts**
4. Click **"Generate New Private Key"**
5. Download the JSON file

### 2. Configure Environment Variables

Create a `.env.admin` file in the project root with your Firebase Admin credentials:

```bash
cp .env.admin.example .env.admin
```

Then edit `.env.admin` and fill in the values from your downloaded JSON file:

- `FIREBASE_PROJECT_ID` - from `project_id`
- `FIREBASE_PRIVATE_KEY_ID` - from `private_key_id`
- `FIREBASE_PRIVATE_KEY` - from `private_key` (keep the quotes and newlines)
- `FIREBASE_CLIENT_EMAIL` - from `client_email`
- `FIREBASE_CLIENT_ID` - from `client_id`
- `FIREBASE_CLIENT_CERT_URL` - from `client_x509_cert_url`

**Important:** Add `.env.admin` to your `.gitignore` to keep credentials secure!

## Usage

Run the script with:

```bash
npm run create-admin
```

The script will prompt you for:
- Admin email
- Admin password
- Admin name (optional)

## What the Script Does

1. Creates a Firebase Authentication user with the provided email/password
2. Hashes the password using bcrypt
3. Creates a document in the `super-admin` Firestore collection with:
   - `uid` - Firebase Auth user ID (used as document ID)
   - `email` - Admin email
   - `passwordHash` - Bcrypt hashed password
   - `name` - Admin name
   - `role` - Set to "super-admin"
   - `active` - Set to true
   - `createdAt` - Timestamp
4. Sets custom claims on the Firebase Auth user for authorization

## Security Notes

- Passwords are hashed using bcrypt with 10 salt rounds
- Never commit `.env.admin` to version control
- The script requires Firebase Admin SDK credentials which have elevated permissions
- Keep your service account JSON file secure
