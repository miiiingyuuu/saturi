"use client"

import React from "react";
import { Link, Card, CardHeader, CardBody, CardFooter, Divider, Image, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Progress, Avatar } from "@nextui-org/react";
import { FaCrown, FaFire } from "react-icons/fa";

export default function ProfileCard() {
  return (
    <div>
      {/* 프로필 */}
      <div className="flex justify-center items-center bg-gray-100">
        <Card style={{ width: '900px', marginTop: '50px' }}>
          <CardHeader className="flex items-center py-6">
          {/* 프로필 사진 */}
          <div className="flex-shrink-0 pr-6">
            <div style={{ height: '200px', display: 'flex', alignItems: 'center' }}>
              <Image
                alt="profile image"
                height={230}
                radius="sm"
                src="https://via.placeholder.com/150"
                width={150}
              />
            </div>
          </div>
          {/* 사용자 정보 */}
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

      {/* 대쉬보드 */}
      <div className="flex justify-center items-center bg-gray-100 h-screen">
      <Card style={{ width: '900px', marginTop: '20px' }}>
        <CardHeader className="flex py-6">
          <h2 className="text-2xl font-bold">학습 대시보드</h2>
        </CardHeader>
        <CardBody>
          <div className="gap-4 grid grid-cols-1 sm:grid-cols-12">
            {/* 전체 19위 섹션 */}
            <div className="col-span-1 sm:col-span-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <FaCrown color="gold" />
                <p className="text-lg font-semibold">전체 19위</p>
              </div>
              <Progress
                aria-label="Progress"
                value={59.01}
                className="max-w-md"
                color="warning"
              />
              <p className="mt-2">59.01%</p>
              <p className="text-sm">4일째 접속중!</p>
            </div>

            {/* 최근 푼 문제 섹션 */}
            <div className="col-span-1 sm:col-span-8 bg-gradient-to-br from-green-500 to-cyan-500 rounded-lg p-4 text-white">
              <h4 className="text-lg font-semibold mb-2">최근 푼 문제</h4>
              <div className="flex items-center gap-4">
                <Avatar radius="sm" content="GO" color="success" />
                <div>
                  <p>경상도 사투리 - 휘미</p>
                  <Progress aria-label="Progress" value={75.93} className="max-w-md" color="success" />
                  <p className="text-sm mt-1">평균 정확도: 75.93%</p>
                </div>
              </div>
            </div>

            {/* 주간 학습 섹션 */}
            <div className="col-span-1 sm:col-span-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg p-4 text-white">
              <h4 className="text-lg font-semibold mb-2">주간 학습</h4>
              <div className="flex gap-2 flex-wrap">
                {['월', '화', '수', '목', '금', '토', '일'].map((day, index) => (
                  <Button key={day} color={index < 4 ? "danger" : "default"} variant="flat" size="sm">
                    {day}
                    {index < 4 && <FaFire className="ml-1" />}
                  </Button>
                ))}
              </div>
            </div>

            {/* 연간 학습 섹션 */}
            <div className="col-span-1 sm:col-span-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg p-4 text-white">
              <h4 className="text-lg font-semibold mb-2">연간 학습</h4>
              <Table aria-label="연간 학습 달력" className="text-white">
                <TableHeader>
                  <TableColumn>Jan</TableColumn>
                  <TableColumn>Feb</TableColumn>
                  {/* ... 나머지 월 */}
                </TableHeader>
                <TableBody>
                  <TableRow key="1">
                    <TableCell>{/* Jan 1주차 데이터 */}</TableCell>
                    <TableCell>{/* Feb 1주차 데이터 */}</TableCell>
                    {/* ... 나머지 월 */}
                  </TableRow>
                  {/* ... 나머지 주차 */}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardBody>
      </Card>
      </div>
      
    </div>
    
  );
}
