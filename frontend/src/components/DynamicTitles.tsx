// app/components/DynamicTitle.tsx
"use client"

import { usePathname } from 'next/navigation';
import { Metadata } from 'next';

const routeTitles: Record<string, string> = {
  '/start': '사투리가 서툴러유',
  '/main': '사투리가 서툴러유',
  '/login': '로그인',
  '/register': '회원가입',
  '/user/profile': '프로필',
  '/user/profile/update': '프로필 수정',
  '/game': '스피드 퀴즈',
  '/lesson': '학습',
  '/findpassword': '비밀번호 찾기',
  '/user/auth/changepassword': '비밀번호 재설정',
  // 추가 경로와 타이틀을 여기에 정의
};

export function generateMetadata(): Metadata {
  const pathname = usePathname();
  
  // pathname이 null이 아닌 경우에만 routeTitles에서 title을 찾습니다.
  const title = pathname ? (routeTitles[pathname] || '사투리가 서툴러유') : '사투리가 서툴러유';

  return {
    title,
  };
}

export default function DynamicTitle() {
  // 이 컴포넌트는 실제로 아무것도 렌더링하지 않습니다.
  // 메타데이터만 생성합니다.
  return null;
}