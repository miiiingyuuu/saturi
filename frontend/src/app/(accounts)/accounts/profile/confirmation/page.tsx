import React, { useState } from "react";
import { Card, Input, Button, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import { useRouter } from 'next/router';

export default function PasswordConfirmationPage() {
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = () => {
    // Here you should handle the password verification logic
    // After verification, navigate to the EditProfilePage
    router.push('/edit-profile');
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card style={{ width: '600px' }}>
        <CardHeader>
          <h3>비밀번호 확인</h3>
        </CardHeader>
        <CardBody>
          <Input.Password
            clearable
            underlined
            label="비밀번호"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </CardBody>
        <CardFooter>
          <Button auto flat color="primary" onClick={handleSubmit}>
            확인
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
