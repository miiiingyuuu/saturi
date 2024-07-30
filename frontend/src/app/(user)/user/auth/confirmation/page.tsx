"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardBody, CardFooter, Button, Input } from "@nextui-org/react";

export default function Authenticate() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


  const handleAuthenticate = async () => {
    // 비밀번호 인증 로직
    const isAuthenticated = await fakePasswordCheck(password);

    if (isAuthenticated) {
      sessionStorage.setItem('isAuthenticated', 'true'); // 인증 성공 시 세션 스토리지에 플래그 저장
      router.push('/accounts/profile/update');
    } else {
      setError('비밀번호가 일치하지 않습니다.');
    }
  };

  // 가짜 비밀번호 체크 함수 (실제 API 호출로 대체)
  const fakePasswordCheck = async (password) => {
    return password === "correctpassword"; // 가짜 비밀번호 "correctpassword" 체크
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card style={{ width: '400px' }}>
        <CardHeader>
          <h3>비밀번호 인증</h3>
        </CardHeader>
        <CardBody>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            placeholder="비밀번호를 입력하세요"
          />
          {error && <p className="text-red-500">{error}</p>}
        </CardBody>
        <CardFooter className="flex justify-end">
          <Button onClick={handleAuthenticate}>
            인증
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
