import { NextResponse } from 'next/server';

export function middleware(request) {
  const destination = request.nextUrl.clone();
  destination.pathname = '/en';
  return NextResponse.redirect(destination, 307);
}

export const config = {
  matcher: '/',
};
