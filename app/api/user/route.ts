import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { cookies } from 'next/headers';

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME!;

export async function GET() {
  // Check if user is authenticated via cookies
  const sessionToken = cookies().get('sessionToken')?.value;

  if (!sessionToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Connect to MongoDB
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db(MONGODB_DB_NAME);
    const sessionsCollection = db.collection('sessions');
    
    // Find valid session
    const session = await sessionsCollection.findOne({ 
      token: sessionToken,
      expiresAt: { $gt: new Date() }
    });

    if (!session) {
      // Session expired or invalid
      cookies().delete('sessionToken');
      return NextResponse.json({ error: 'Session expired' }, { status: 401 });
    }

    // Get user data
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ _id: session.userId });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Return user data without sensitive information
    const { password, ...safeUser } = user;
    return NextResponse.json(safeUser);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  } finally {
    await client.close();
  }
}

export async function PATCH(req: Request) {
  // Check if user is authenticated
  const sessionToken = cookies().get('sessionToken')?.value;

  if (!sessionToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const { bio } = await req.json();

    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI);
    
    try {
      await client.connect();
      const db = client.db(MONGODB_DB_NAME);
      const sessionsCollection = db.collection('sessions');
      
      // Find session
      const session = await sessionsCollection.findOne({ 
        token: sessionToken,
        expiresAt: { $gt: new Date() }
      });

      if (!session) {
        cookies().delete('sessionToken');
        return NextResponse.json({ error: 'Session expired' }, { status: 401 });
      }

      // Update user bio
      const usersCollection = db.collection('users');
      await usersCollection.updateOne(
        { _id: session.userId },
        { $set: { bio } }
      );

      return NextResponse.json({ message: 'Bio updated successfully' });
    } finally {
      await client.close();
    }
  } catch (error) {
    console.error('Error updating user bio:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
