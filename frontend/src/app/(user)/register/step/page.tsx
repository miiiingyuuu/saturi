"use client"

import React, { useState } from 'react';
import { Button ,RadioGroup, Radio } from '@nextui-org/react';
import "./styles.css"
import Link from 'next/link';

export default function Step() {
  const [ step, setStep ] = useState(1)

  const handleNext = () => {
    setStep(step + 1)
  }

  const handleBack = () => {
    setStep(step - 1)
  }

  return (
    <div className="select">
    {step === 1 && (
      <RadioGroup label="성별이 어떻게 되시나요?" defaultValue="null">
        <div className="box">
          <Radio value="male" className="content">남자</Radio>``
          <Radio value="female" className="content">여자</Radio>
          <Radio value="null" className="content">알려주고 싶지 않아요...</Radio>
        </div>
        <div className="first-button">
          <Button className="button" onClick={handleNext}>다음</Button>
        </div>
      </RadioGroup>
    )}
    {step === 2 && (
      <RadioGroup label="연령대가 어떻게 되시나요?" defaultValue="null">
        <div className="box">
          <Radio value="teen-twen" className="content">10대 ~ 20대</Radio>
          <Radio value="thri-four" className="content">30대 ~ 40대</Radio>
          <Radio value="fif-six" className="content">50대 ~ 60대</Radio>
          <Radio value="over-seven" className="content">70대 이상</Radio>
          <Radio value="null" className="content">알려주고 싶지 않아요...</Radio>
        </div>
        <div className="selectbutton">
          <Button className="button" onClick={handleBack}>뒤로가기</Button>
          <Button className="button" onClick={handleNext}>다음</Button>
        </div>
      </RadioGroup>
    )}
    {step === 3 && (
      <RadioGroup label="주로 사용하시는 사투리는 무엇인가요?" defaultValue="null">
        <div className="box">
          <Radio value="gyeonggi" className="content">경기도</Radio>
          <Radio value="gyeongsang" className="content">경상도</Radio>
          <Radio value="jeolla" className="content">전라도</Radio>
          <Radio value="chungchung" className="content">충청도</Radio>
          <Radio value="kangwon" className="content">강원도</Radio>
          <Radio value="jeju" className="content">제주도</Radio>
          <Radio value="null" className="content">알려주고 싶지 않아요...</Radio>
        </div>
        <div className="selectbutton">
          <Button className="button" onClick={handleBack}>뒤로가기</Button>
          <Button className="button" onClick={handleNext}>회원가입 완료</Button>
        </div>
    </RadioGroup>
    )}
    {step === 4 && (
        <div>
          <h2>회원가입이 완료되었습니다!</h2>
          <div className="final">
            <Link href="/login">
              <Button className="last-button">로그인 페이지로</Button>
            </Link>
          </div>
        </div>
      )}
  </div>
  )
}