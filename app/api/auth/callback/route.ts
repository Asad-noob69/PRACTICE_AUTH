import { NextResponse } from 'next/server';
import { AuthorizationCode } from 'simple-oauth2';

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (state !== 'random_state_string') {
    return NextResponse.json({ error: 'Invalid state parameter' }, { status: 403 });
  }

  const redirectUri = 'https://4e30-205-164-148-169.ngrok-free.app/api/auth/callback';

  try {
    const accessToken = await client.getToken({
      code: code as string,
      redirect_uri: redirectUri,
    });

    const accessTokenValue = accessToken.token.access_token;

    // Fetch user data from GitHub
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessTokenValue}`,
        Accept: 'application/json',
      },
    });

    const userData = await userResponse.json();
    console.log('User Data:', userData);

    return NextResponse.redirect('https://4e30-205-164-148-169.ngrok-free.app/success');
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    return NextResponse.json(
      { error: 'Failed to exchange code for token' },
      { status: 500 }
    );
  }
}