"use client"

import React, { useState, useMemo } from "react";
import { Card, CardHeader, CardBody, CardFooter, Divider, Image, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Link, Input } from "@nextui-org/react";

export default function EditProfilePage() {
  // 상태 변수 선언 -> DB연결 필요
  const [nickname, setNickname] = useState('');
  const [email] = useState('email@gmail.com');
  const [dialectKeys, setDialectKeys] = useState(new Set(["경상도"]));
  const [genderKeys, setGenderKeys] = useState(new Set(["남성"]));
  const [ageGroupKeys, setAgeGroupKeys] = useState(new Set(["20대-30대"]));

  // 선택된 값을 문자열로 변환하여 저장
  const dialect = useMemo(
    () => Array.from(dialectKeys).join(", ").replaceAll("_", " "),
    [dialectKeys]
  );

  const gender = useMemo(
    () => Array.from(genderKeys).join(", ").replaceAll("_", " "),
    [genderKeys]
  );

  const ageGroup = useMemo(
    () => Array.from(ageGroupKeys).join(", ").replaceAll("_", " "),
    [ageGroupKeys]
  );

  // 수정 완료 버튼 클릭 시 호출되는 함수
  const handleSave = () => {
    alert('수정된 내용을 저장했습니다.');
  };

  return (
    <div className="flex justify-center items-center bg-gray-100 h-screen">
      <Card style={{ width: '900px', marginTop: '50px' }}>
        <CardHeader className="flex items-center py-6">
          {/* 사진을 왼쪽에 고정 */}
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
          {/* 오른쪽에는 수정 가능한 정보 입력 */}
          <div className="flex-1">
            <CardBody className="flex flex-col mb-6">
              <p className="text-md font-semibold">닉네임</p>
              <Input 
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="border rounded p-2"
              />
            </CardBody>
            <Divider />
            <CardBody className="flex flex-col my-6">
              <p className="text-md font-semibold">이메일</p>
              <p className="text-default-500">{email}</p> {/* 수정 불가능한 이메일 */}
            </CardBody>
            <Divider />
            <CardBody className="flex flex-col my-6">
              <p className="text-md font-semibold">사용하는 사투리</p>
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="bordered" className="capitalize">
                    {dialect}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu 
                  aria-label="선호하는 사투리 선택"
                  variant="flat"
                  disallowEmptySelection
                  selectionMode="single"
                  selectedKeys={dialectKeys}
                  onSelectionChange={setDialectKeys}
                >
                  <DropdownItem value="gyeonggi" key="경기도">경기도</DropdownItem>
                  <DropdownItem value="gyeongsang" key="경상도">경상도</DropdownItem>
                  <DropdownItem value="jeolla" key="전라도">전라도</DropdownItem>
                  <DropdownItem value="chungchung" key="충청도">충청도</DropdownItem>
                  <DropdownItem value="kangwon" key="강원도">강원도</DropdownItem>
                  <DropdownItem value="jeju" key="제주도">제주도</DropdownItem>
                  <DropdownItem value="null" key="알려주고 싶지 않아요">알려주고 싶지 않아요</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </CardBody>
            <Divider />
            <CardBody className="flex flex-col my-6">
              <p className="text-md font-semibold">성별</p>
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="bordered" className="capitalize">
                    {gender}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu 
                  aria-label="성별 선택"
                  variant="flat"
                  disallowEmptySelection
                  selectionMode="single"
                  selectedKeys={genderKeys}
                  onSelectionChange={setGenderKeys}
                >
                  <DropdownItem value="male" key="남성">남성</DropdownItem>
                  <DropdownItem value="female" key="여성">여성</DropdownItem>
                  <DropdownItem value="null" key="알려주고 싶지 않아요">알려주고 싶지 않아요</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </CardBody>
            <Divider />
            <CardBody className="flex flex-col my-6">
              <p className="text-md font-semibold">연령대</p>
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="bordered" className="capitalize">
                    {ageGroup}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu 
                  aria-label="연령대 선택"
                  variant="flat"
                  disallowEmptySelection
                  selectionMode="single"
                  selectedKeys={ageGroupKeys}
                  onSelectionChange={setAgeGroupKeys}
                >
                  <DropdownItem value="teen-twen" key="10대-20대">10대-20대</DropdownItem>
                  <DropdownItem value="thri-four" key="30대-40대">30대-40대</DropdownItem>
                  <DropdownItem value="fif-six" key="50대-60대">50대-60대</DropdownItem>
                  <DropdownItem value="over-seven" key="70대 이상">70대 이상</DropdownItem>
                  <DropdownItem value="null" key="알려주고 싶지 않아요">알려주고 싶지 않아요</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </CardBody>
          </div>
        </CardHeader>
        <Divider />
        <CardFooter className="flex justify-between items-center">
          {/* 뒤로가기 버튼 */}
          <Link href="/accounts/profile">
            <Button color="default">
              뒤로가기
            </Button>
          </Link>
          <div className="flex space-x-4"> {/* 여백 추가 */}
            {/* 수정 완료 버튼 */}
            <Link href="/accounts/profile">
              <Button color="primary" onClick={handleSave}>
                수정 완료
              </Button>
            </Link>
            {/* 비밀번호 변경 버튼 */}
            <Link href="/accounts/changepassword">
              <Button color="secondary">
                비밀번호 변경
              </Button>
            </Link> 
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
