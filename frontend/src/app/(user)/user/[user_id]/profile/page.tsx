import React from "react";
import { Link, Card, CardHeader, CardBody, CardFooter, Divider, Image, Button } from "@nextui-org/react";

export default function ProfileCard() {
  return (
    <div>
      <div className="flex justify-center items-center bg-gray-100">
        <Card style={{ width: '900px', marginTop: '50px' }}>
          <CardHeader className="flex items-start py-6">
            {/* 사진은 왼쪽에 고정 */}
          <div className="flex-shrink-0 pr-6">
            <div style={{ height: '200px', display: 'flex', alignItems: 'center' }}>
              <Image
                alt="profile image"
                height={200}
                radius="sm"
                src="https://via.placeholder.com/150"
                width={150}
              />
            </div>
          </div>
          {/* 오른쪽에는 정보 입력 */}
          <div className="flex-1">
            <CardBody className="flex flex-col mb-6">
              <p className="text-md font-semibold">응애에요</p>
              <p className="text-default-500">email@gmail.com</p>
            </CardBody>
            <Divider />
            <CardBody className="flex flex-col my-6">
              <p className="text-md font-semibold">사용하는 사투리</p>
              <p className="text-default-500">경상도 사투리</p>
            </CardBody>
            <Divider />
            <CardBody className="flex flex-col my-6">
              <p className="text-md font-semibold">성별</p>
              <p className="text-default-500">남성</p>
            </CardBody>
            <Divider />
            <CardBody className="flex flex-col my-6">
              <p className="text-md font-semibold">연령대</p>
              <p className="text-default-500">20대-30대</p>
            </CardBody>
          </div>
          </CardHeader>
          <Divider />
          <CardFooter className="flex justify-end">
            <Link href="/accounts/profile/update">
              <Button color="primary">프로필 수정</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
      <div className="flex justify-center items-center bg-gray-100">
        <Card style={{ width: '900px',marginTop: '10px' }}>
          hi
        </Card>
      </div>
    </div>
    
  );
}
