import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken');

  if (accessToken) {
    return NextResponse.redirect(new URL('/main', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/start', // 이 미들웨어가 작동할 경로를 지정합니다.
};
