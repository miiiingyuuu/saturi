"use client";

import { useState, useRef } from 'react';
import Image from "next/image"

// 하위 컴포넌트들 
import LeftPart from '../../../components/home/main/leftpart';
import MiddlePart from '../../../components/home/main/middlepart';
import RightPart from '../../../components/home/main/rightpart';

import '../../../styles/home/main/mainPage.css';
import KoreaMap from '../../../components/home/main/koreaMap';

//Props
import { ButtonPartProps } from '@/utils/props';
import { MiddleMapProps } from '@/utils/props';

///////////////////////////////////////////////////////////////
// Main Page 설명
// Main Page는 
// 1. App과 
// 2. 하위 3가지 파트로 나뉨(leftpart, middlepart, rightpart)
// 
// 3가지 파트 모두에게 쓰이는 Button와 Map은
// 따로 분리되어 있지 않으며 
// 이 page 안, App function 위에 있음.
///////////////////////////////////////////////////////////////



// 버튼 부분과 맵 파트
function ButtonPart({ onLeftClick, onRightClick, middleToWhere, selectedRegion }: ButtonPartProps) {
  return (
    <div>
      {selectedRegion !== "_" && middleToWhere !== 2 && (
        <button type="button" className='buttonLeft' onClick={onLeftClick}>
          <Image src="/MainPage/buttonLeft.png" alt="button" width={60} height={60} />
        </button>
      )}

      {selectedRegion !== "_" && middleToWhere !== 0 && (
        <button type="button" className='buttonRight' onClick={onRightClick}>
          <Image src="/MainPage/buttonRight.png" alt="button" width={60} height={60} />
        </button>
      )}
    </div>
  );
}

function MiddleMap({ left, onRegionClick, selectedRegion }: MiddleMapProps) {
  return (
    <div className="middleMap" style={{ left: left === "null" ? undefined : left, top: "39vh" }}>
      <h1 style={{ textAlign: "center" }}> {selectedRegion}</h1>
      <div style={{ width: '100%', height: '100%' }}>
        <KoreaMap onRegionClick={onRegionClick} />
      </div>
    </div>
  );
}

// 컴포넌트 
export default function App() {
  const [mapLeft, setMapLeft] = useState<string>('50%'); // 초기 left 값을 50%로 설정
  const [middleToWhere, setMiddleToWhere] = useState<number>(1); // 0, 1, 2 이 세 가지 값을 사용
  const moveDirection = useRef<string>("null");
  const [mainPageIndicator, setMainPageIndicator] = useState<string>("지역을 선택하세요");
  const currentMainPageRef = useRef<number>(1);
  const [selectedRegion, setSelectedRegion] = useState<string>("_");

  const handleRegionClick = (region: string) => {
    setSelectedRegion(region);
    if (region !== "null") {
      setMainPageIndicator("학습 또는 게임을 선택하세요");
    }
  };

  const handleLeftClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    moveDirection.current = "left";
    if (currentMainPageRef.current === 1) {
      setMapLeft("70%");
      setMiddleToWhere(2);
      currentMainPageRef.current = 0; // 값 변경
    } else if (currentMainPageRef.current === 2) {
      setMapLeft("50%");
      setMiddleToWhere(1);
      currentMainPageRef.current = 1; // 값 변경
    }
  };

  const handleRightClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    moveDirection.current = "right";
    if (currentMainPageRef.current === 1) {
      setMapLeft("35%");
      setMiddleToWhere(0);
      currentMainPageRef.current = 2; // 값 변경
    } else if (currentMainPageRef.current === 0) {
      setMapLeft("50%");
      setMiddleToWhere(1);
      currentMainPageRef.current = 1; // 값 변경
    }
  };

  return (
    <div style={{ overflow: 'hidden' }}> {/* 부모 요소에 overflow: hidden 추가 */}
      <div style={{ position: 'relative', width: '100%', height: '95vh' }}>
        <LeftPart
          middlePosition={middleToWhere}
          moveDirection={moveDirection.current}
          selectedRegion={selectedRegion}
        />
        <MiddlePart
          middlePosition={middleToWhere}
          mainPageIndicator={mainPageIndicator}
          selectedRegion={selectedRegion}
        />
        <RightPart />
        <ButtonPart
          onLeftClick={handleLeftClick}
          onRightClick={handleRightClick}
          middleToWhere={middleToWhere}
          selectedRegion={selectedRegion}
        />
        <MiddleMap
          left={mapLeft}
          onRegionClick={handleRegionClick}
          selectedRegion={selectedRegion}
        />        
      </div>
    </div>
  );
}