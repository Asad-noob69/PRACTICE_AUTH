import { NextResponse } from 'next/server';
import { AuthorizationCode } from 'simple-oauth2';
import { MongoClient } from 'mongodb';
import * as bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { randomBytes } from 'crypto';

const config = {
  client: {
    id: process.env.OAUTH_CLIENT_ID || '',
    secret: process.env.OAUTH_CLIENT_SECRET || '',
  },
  auth: {
    tokenHost: 'https://github.com',
    authorizePath: '/login/oauth/authorize',
    tokenPath: '/login/oauth/access_token',
  },
};

const client = new AuthorizationCode(config);

const MONGODB_URI = process.env.MONGODB_URI!;
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME!;
const SESSION_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function GET() {
  const redirectUri = 'https://4e30-205-164-148-169.ngrok-free.app/api/auth/callback';
  const scope = 'read:user';
  const state = 'random_state_string';

  const authorizationUri = client.authorizeURL({
    redirect_uri: redirectUri,
    scope,
    state,
  });

  return NextResponse.redirect(authorizationUri);
}

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Connect to MongoDB
    const client = new MongoClient(MONGODB_URI);
    try {
      await client.connect();
      const db = client.db(MONGODB_DB_NAME);
      const usersCollection = db.collection('users');
      const sessionsCollection = db.collection('sessions');
      
      // Find user by email
      const user = await usersCollection.findOne({ email });
      
      if (!user) {
        return NextResponse.json(
          { message: 'Invalid email or password' },
          { status: 401 }
        );
      }
      
      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return NextResponse.json(
          { message: 'Invalid email or password' },
          { status: 401 }
        );
      }
      
      // Generate session token
      const sessionToken = randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + SESSION_EXPIRY);
      
      // Store session in database
      await sessionsCollection.insertOne({
        userId: user._id,
        token: sessionToken,
        expiresAt,
        createdAt: new Date(),
      });
      
      // Set session cookie
      cookies().set({
        name: 'sessionToken',
        value: sessionToken,
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: expiresAt,
      });
      
      // Return user data (excluding password)
      const { password: _, ...userWithoutPassword } = user;
      
      return NextResponse.json({
        message: 'Login successful',
        user: userWithoutPassword,
      });
    } finally {
      await client.close();
    }
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}