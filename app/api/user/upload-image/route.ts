import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { cookies } from 'next/headers';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME!;
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

export async function POST(req: Request) {
  try {
    // Get the current user's session token
    const sessionToken = cookies().get('sessionToken')?.value;
    
    // Use formData for file uploads
    const formData = await req.formData();
    const file = formData.get('profileImage') as File;
    const email = formData.get('email') as string;

    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    // Generate a unique filename
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = path.join(UPLOADS_DIR, fileName);
    
    // Read file as array buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Write file to disk
    fs.writeFileSync(filePath, buffer);
    
    // Generate URL for the uploaded image
    const imageUrl = `/uploads/${fileName}`;
    
    // Connect to MongoDB to update user profile
    const client = new MongoClient(MONGODB_URI);
    
    try {
      await client.connect();
      const db = client.db(MONGODB_DB_NAME);
      const usersCollection = db.collection('users');
      
      // If session token exists, use it to find the user
      // Otherwise use email (for signup flow)
      let updateQuery;
      
      if (sessionToken) {
        const sessionsCollection = db.collection('sessions');
        const session = await sessionsCollection.findOne({ 
          token: sessionToken,
          expiresAt: { $gt: new Date() }
        });
        
        if (!session) {
          return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
        }
        
        updateQuery = { _id: session.userId };
      } else if (email) {
        updateQuery = { email };
      } else {
        return NextResponse.json({ error: 'No user identifier provided' }, { status: 400 });
      }
      
      // Update user's profile picture
      await usersCollection.updateOne(
        updateQuery,
        { $set: { picture: imageUrl } }
      );
      
      return NextResponse.json({ 
        message: 'Profile image uploaded successfully',
        imageUrl
      });
    } finally {
      await client.close();
    }
  } catch (error) {
    console.error('Error uploading profile image:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}