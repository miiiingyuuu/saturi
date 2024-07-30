"use client"; // 클라이언트 컴포넌트로 지정

// 하위 컴포넌트들 
import LeftPart from './leftpart';
import MiddlePart from './middlepart';
import RightPart from './rightpart';


import { useState, useRef, useEffect, ReactNode } from 'react';
import './style.css';
import KoreaMap from './koreaMap';
// import { Button, Popover, PopoverTrigger, PopoverContent } from '@nextui-org/react';           //헤더 한다고 import 한건데 지워도 될듯?





interface MiddlePartProps {
  middlePosition: number;
  mainPageIndicator: string;
  selectedRegion: string;
}



interface ButtonPartProps {
  onLeftClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  onRightClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  middleToWhere: number;
  selectedRegion: string;
}

interface MiddleMapProps {
  left: string;
  onRegionClick: (region: string) => void;
  selectedRegion: string;
}







function ButtonPart({ onLeftClick, onRightClick, middleToWhere, selectedRegion }: ButtonPartProps) {
  return (
    <div>
      {selectedRegion !== "_" && middleToWhere !== 2 && (
        <a href="#" className='buttonLeft' onClick={onLeftClick}>
          <img src="/MainPage/buttonLeft.png" alt="button" width={50} />
        </a>
      )}

      {selectedRegion !== "_" && middleToWhere !== 0 && (
        <a href="#" className='buttonRight' onClick={onRightClick}>
          <img src="/MainPage/buttonRight.png" alt="button" width={50} />
        </a>
      )}
    </div>
  );
}

function MiddleMap({ left, onRegionClick, selectedRegion }: MiddleMapProps) {
  return (
    <div className="middleMap" style={{ left: left === "null" ? null : left, top: "39%" }}>
      <h1 style={{ textAlign: "center" }}> {selectedRegion}</h1>
      <div style={{ width: '50%', height: '50%' }}>
        <KoreaMap onRegionClick={onRegionClick} />
      </div>
    </div>
  );
}

export default function App() {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [mapLeft, setMapLeft] = useState<string>('50%'); // 초기 left 값을 50%로 설정
  const [middleToWhere, setMiddleToWhere] = useState<number>(1); // 0, 1, 2 이 세 가지 값을 사용
  let moveDirection = useRef<string>("null");
  const [isCapitalChoosed, setIsCapitalChoosed] = useState<boolean>(false);
  const [mainPageIndicator, setMainPageIndicator] = useState<string>("지역을 선택하세요");
  const currentMainPageRef = useRef<number>(1);
  const [selectedRegion, setSelectedRegion] = useState<string>("_");

  const handleRegionClick = (region: string) => {
    setSelectedRegion(region);
    if (region !== "null") {
      setMainPageIndicator("학습 또는 게임을 선택하세요");
    }
  };

  const handleProfileClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setModalOpen(true);
  };

  const handleLeftClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    moveDirection.current = "left";
    if (currentMainPageRef.current === 1) {
      setMapLeft("80%");
      setMiddleToWhere(2);
      currentMainPageRef.current = 0; // 값 변경
    } else if (currentMainPageRef.current === 2) {
      setMapLeft("50%");
      setMiddleToWhere(1);
      currentMainPageRef.current = 1; // 값 변경
    }
  };

  const handleRightClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    moveDirection.current = "right";
    if (currentMainPageRef.current === 1) {
      setMapLeft("20%");
      setMiddleToWhere(0);
      currentMainPageRef.current = 2; // 값 변경
    } else if (currentMainPageRef.current === 0) {
      setMapLeft("50%");
      setMiddleToWhere(1);
      currentMainPageRef.current = 1; // 값 변경
    }
  };

  return (
    <div>
      <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
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
