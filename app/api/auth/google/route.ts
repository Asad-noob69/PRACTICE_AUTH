import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const APPWRITE_ENDPOINT = process.env.APPWRITE_ENDPOINT!;
const APPWRITE_PROJECT_ID = process.env.APPWRITE_PROJECT_ID!;
const APPWRITE_GOOGLE_PROVIDER = 'google';

export async function GET(req: Request) {
  const redirectUrl = `${APPWRITE_ENDPOINT}/account/sessions/oauth2/${APPWRITE_GOOGLE_PROVIDER}?project=${APPWRITE_PROJECT_ID}&success=${process.env.OAUTH_REDIRECT_URI}&failure=${process.env.OAUTH_REDIRECT_URI}`;
  return NextResponse.redirect(redirectUrl);
}
// MongoDB connection URI and database name
const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME!;

// Add a new POST handler to store user information
export async function POST(req: Request) {
  const { name, email, picture } = await req.json();

  // Connect to MongoDB
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db(MONGODB_DB_NAME);
    const usersCollection = db.collection('users');

    // Insert user data into the 'users' collection
    const result = await usersCollection.insertOne({ name, email, picture });

    console.log('User data stored:', result);

    return NextResponse.json({ message: 'User data stored successfully!' });
  } catch (error) {
    console.error('Error storing user data:', error);
    return NextResponse.json({ message: 'Failed to store user data.' }, { status: 500 });
  } finally {
    await client.close();
  }
}
