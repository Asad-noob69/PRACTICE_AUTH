import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import * as bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME!;

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json();
    
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Password validation
    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }
    
    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI);
    try {
      await client.connect();
      const db = client.db(MONGODB_DB_NAME);
      const usersCollection = db.collection('users');
      
      // Check if user with this email already exists
      const existingUser = await usersCollection.findOne({ email });
      if (existingUser) {
        return NextResponse.json(
          { message: 'User with this email already exists' },
          { status: 409 }
        );
      }
      
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Create default avatar URL using initials (as fallback if no image is uploaded)
      const initials = username
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase();
      const defaultPicture = `https://ui-avatars.com/api/?name=${initials}&background=random`;
      
      // Insert user into database
      const result = await usersCollection.insertOne({
        username,
        email,
        password: hashedPassword,
        picture: defaultPicture,
        bio: '',
        createdAt: new Date(),
      });
      
      return NextResponse.json(
        { 
          message: 'User created successfully',
          userId: result.insertedId,
          email
        }, 
        { status: 201 }
      );
    } finally {
      await client.close();
    }
  } catch (error) {
    console.error('Error during signup:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}