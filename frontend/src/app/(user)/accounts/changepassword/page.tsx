"use client"

import React, { useState } from "react";
import { Card, CardHeader, CardBody, CardFooter, Button, Input, Link } from "@nextui-org/react";

export default function ChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleChangePassword = async () => {
    // 비밀번호 변경 로직
    if (newPassword !== confirmPassword) {
      setError('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }
    
    const isChanged = await fakePasswordChange(currentPassword, newPassword);

    if (isChanged) {
      alert('비밀번호가 변경되었습니다.');
      router.push('/accounts/profile');
    } else {
      setError('현재 비밀번호가 일치하지 않습니다.');
    }
  };

  // 가짜 비밀번호 변경 함수 (실제 API 호출로 대체)
  const fakePasswordChange = async (currentPassword, newPassword) => {
    return currentPassword === "correctpasswo`rd"; // 가짜 비밀번호 "correctpassword" 체크
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card style={{ width: '400px' }}>
        <CardHeader>
          <h3>비밀번호 변경</h3>
        </CardHeader>
        <CardBody className="space-y-4">
          <Input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            fullWidth
            placeholder="현재 비밀번호를 입력하세요"
          />
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            placeholder="새 비밀번호를 입력하세요"
          />
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            placeholder="새 비밀번호 확인"
          />
          {error && <p className="text-red-500">{error}</p>}
        </CardBody>
        <CardFooter className="flex justify-between">
          <Link href="/accounts/profile/update">
            <Button color="default">
              뒤로가기
            </Button>
          </Link>
          <Button color="primary" onClick={handleChangePassword}>
            비밀번호 변경
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
