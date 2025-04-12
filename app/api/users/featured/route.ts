import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME!;

export async function GET() {
  // Connect to MongoDB
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db(MONGODB_DB_NAME);
    const usersCollection = db.collection('users');
    
    // Get a random selection of users (up to 6)
    const featuredUsers = await usersCollection
      .find({}, { projection: { password: 0 } }) // Exclude password field
      .limit(6)
      .sort({ createdAt: -1 }) // Sort by newest first (can be changed to random if desired)
      .toArray();

    return NextResponse.json(featuredUsers);
  } catch (error) {
    console.error('Error fetching featured users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await client.close();
  }
}