import { NextResponse } from 'next/server';
import crypto from 'crypto';

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || '';

export async function POST(request: Request) {
  const body = await request.json();
  const signature = request.headers.get('x-hub-signature-256') || '';

  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  const digest = 'sha256=' + hmac.update(JSON.stringify(body)).digest('hex');

  if (signature !== digest) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  console.log('Received webhook event:', body);
  return NextResponse.json({ message: 'Webhook received successfully!' });
}