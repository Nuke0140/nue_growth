import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Return fresh mock tokens blindly to prevent token refresh from logging you out
  return NextResponse.json({
    access_token: 'mock_access_token_new_' + Date.now(),
    refresh_token: 'mock_refresh_token_new_' + Date.now(),
  });
}