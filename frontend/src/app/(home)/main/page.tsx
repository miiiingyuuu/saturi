"use client";

import { useState, useRef } from "react";
import Image from "next/image"
import { Box, Button, Typography, useMediaQuery  } from "@mui/material"

// Props
import { ButtonPartProps, MiddleMapProps } from '@/utils/props';

// 하위 컴포넌트들 
import LeftPart from '../../../components/home/main/leftpart';
import MiddlePart from '../../../components/home/main/middlepart';
import RightPart from '../../../components/home/main/rightpart';

import '../../../styles/home/main/mainPage.css';
import KoreaMap from '../../../components/home/main/koreaMap';



// /////////////////////////////////////////////////////////////
// Main Page 설명
// Main Page는 
// 1. App과 
// 2. 하위 3가지 파트로 나뉨(leftpart, middlepart, rightpart)
// 
// 3가지 파트 모두에게 쓰이는 Button와 Map은
// 따로 분리되어 있지 않으며 
// 이 page 안, App function 위에 있음.
// /////////////////////////////////////////////////////////////



// 버튼 부분과 맵 파트
function ButtonPart({ onLeftClick, onRightClick, middleToWhere, selectedRegion }: ButtonPartProps) {
  return (
    <Box>
      {selectedRegion !== "_" && middleToWhere !== 2 && (
        <Button type="button" className='buttonLeft' onClick={onLeftClick}>
          <Image src="/MainPage/buttonLeft.png" alt="button" width={60} height={60} />
        </Button>
      )}

      {selectedRegion !== "_" && middleToWhere !== 0 && (
        <Button type="button" className='buttonRight' onClick={onRightClick}>
          <Image src="/MainPage/buttonRight.png" alt="button" width={60} height={60} />
        </Button>
      )}
    </Box>
  );
}

function MiddleMap({ left, onRegionClick, selectedRegion, middleToWhere }: MiddleMapProps) {
  // 반응형 부분 
  const isDesktop = useMediaQuery('(min-width:768px)');
  if (!isDesktop && middleToWhere !== 1) {
    return null;    
  }
  
  return (
    <Box className="middleMap" style={{ left: left === "null" ? undefined : left, top: "45vh" }}>
      <Typography 
        variant="h4" 
        sx={{ textAlign: "center", fontWeight: "bold", visibility: selectedRegion === "_" ? "hidden" : "visible" }}> {selectedRegion} </Typography>
      <Box style={{ width: '100%', height: '100%' }}>
        <KoreaMap onRegionClick={onRegionClick} />
      </Box>
    </Box>
  );
}

// ///////////////
// 컴포넌트     //
// /////////////// 
export default function App() {
  const [mapLeft, setMapLeft] = useState<string>('50%'); // 초기 left 값을 50%로 설정
  const [middleToWhere, setMiddleToWhere] = useState<number>(1); // 맵의 위치가 어디에 있는지. 0, 1, 2 이 세 가지 값을 사용
  const moveDirection = useRef<string>("null"); // 이동 방향. left or right. 
  const [mainPageIndicator, setMainPageIndicator] = useState<string>("지역을 선택하세요");
  const [selectedRegion, setSelectedRegion] = useState<string>("_");
  const currentMainPageRef = useRef<number>(1);
  

  // 지역 선택 시 
  const handleRegionClick = (region: string) => {
    setSelectedRegion(region);
    if (region !== "null") {
      setMainPageIndicator("학습 또는 게임을 선택하세요");
    }
  };

  // 왼쪽 버튼 클릭 시
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

  // 오른쪽 버튼 클릭 시 
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
    <Box style={{ overflow: 'hidden' }}> {/* 부모 요소에 overflow: hidden 추가 */}
      <Box style={{ position: 'relative', width: '100%', height: '920px' }}>
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
          middleToWhere = {middleToWhere}
        />        
      </Box>
    </Box>
  );
}