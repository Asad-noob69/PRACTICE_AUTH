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