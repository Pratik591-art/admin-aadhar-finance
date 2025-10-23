import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import bcrypt from 'bcrypt';
import { createInterface } from 'readline';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.admin
dotenv.config({ path: join(__dirname, '..', '.env.admin') });

// Validate required environment variables
const requiredVars = [
  'FIREBASE_PROJECT_ID',
  'FIREBASE_PRIVATE_KEY_ID',
  'FIREBASE_PRIVATE_KEY',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_CLIENT_ID',
];

const missingVars = requiredVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error('❌ Error: Missing required environment variables in .env.admin:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\nPlease create a .env.admin file based on .env.admin.example');
  console.error('See scripts/README.md for setup instructions.');
  process.exit(1);
}

// Load environment variables
const serviceAccount = {
  type: 'service_account',
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL,
};

// Initialize Firebase Admin
initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
const auth = getAuth();

// Create readline interface for user input
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function createSuperAdmin() {
  try {
    console.log('=== Create Super Admin ===\n');

    const email = await question('Enter admin email: ');
    const password = await question('Enter admin password: ');
    const name = await question('Enter admin name (optional): ');

    if (!email || !password) {
      console.error('Email and password are required!');
      process.exit(1);
    }

    console.log('\nCreating super admin...');

    // Create Firebase Auth user
    let userRecord;
    try {
      userRecord = await auth.createUser({
        email: email.trim(),
        password: password,
        displayName: name.trim() || undefined,
      });
      console.log(`✓ Firebase Auth user created with UID: ${userRecord.uid}`);
    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        // User already exists, get the user
        userRecord = await auth.getUserByEmail(email.trim());
        console.log(`✓ Using existing Firebase Auth user with UID: ${userRecord.uid}`);
      } else {
        throw error;
      }
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('✓ Password hashed');

    // Create super-admin document in Firestore
    const adminData = {
      email: email.trim(),
      passwordHash: hashedPassword,
      name: name.trim() || '',
      uid: userRecord.uid,
      createdAt: new Date().toISOString(),
      role: 'super-admin',
      active: true,
    };

    // Use the user's UID as the document ID
    await db.collection('super-admin').doc(userRecord.uid).set(adminData);
    console.log('✓ Super admin document created in Firestore');

    // Set custom claims for the user
    await auth.setCustomUserClaims(userRecord.uid, { superAdmin: true, role: 'super-admin' });
    console.log('✓ Custom claims set');

    console.log('\n=== Success! ===');
    console.log(`Super admin created successfully!`);
    console.log(`Email: ${email.trim()}`);
    console.log(`UID: ${userRecord.uid}`);
    console.log('\nYou can now login with this email and password.');

  } catch (error) {
    console.error('\n❌ Error creating super admin:', error.message);
    process.exit(1);
  } finally {
    rl.close();
    process.exit(0);
  }
}

createSuperAdmin();
