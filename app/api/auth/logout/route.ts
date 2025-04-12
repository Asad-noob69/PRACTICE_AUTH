import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { cookies } from 'next/headers';

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME!;

export async function POST() {
  const sessionToken = cookies().get('sessionToken')?.value;
  
  if (!sessionToken) {
    return NextResponse.json({ message: 'Not logged in' });
  }
  
  // Connect to MongoDB
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db(MONGODB_DB_NAME);
    const sessionsCollection = db.collection('sessions');
    
    // Remove the session from the database
    await sessionsCollection.deleteOne({ token: sessionToken });
    
    // Remove the session cookie
    cookies().delete('sessionToken');
    
    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error during logout:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}