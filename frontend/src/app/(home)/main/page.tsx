"use client"; // 클라이언트 컴포넌트로 지정

import { useState, useRef, useEffect } from 'react';
import { redirect } from 'next/navigation';
import { useRouter } from 'next/navigation';
// import { ReactComponent as KoreaMap } from './koreaMap.svg';
import './style.css';
// import { Button, Popover, PopoverTrigger, PopoverContent } from '@nextui-org/react';
import KoreaMap from './koreaMap';
import Button from '@mui/material/Button'
import { Router } from 'next/router';


// ///////////////////////
// // 헤더 파트
// ///////////////////////

// function Header({ onProfileClick }) {
//   const [isPopoverOpen, setPopoverOpen] = useState(false);

//   const handlePopoverOpen = () => {
//     setPopoverOpen(true);
//   };

//   const handlePopoverClose = () => {
//     setPopoverOpen(false);
//   };

//   return (
//     <div>
//       <nav className="navbar">
//         <ul className="nav-list">
//           <li className="nav-item logo">
//             <a href="">
//               <img src="/MainPage/logo.png" alt="LOGO" width={250} />
//             </a>
//           </li>
//           <li className="nav-item profile">
//             <Popover isOpen={isPopoverOpen} onOpenChange={setPopoverOpen}>
//               <PopoverTrigger>
//                 <Button href="#" onClick={handlePopoverOpen}>Profile</Button>
//               </PopoverTrigger>
//               <PopoverContent>
//                 <div style={{ padding: '10px' }}>
//                   <h2>Profile</h2>
//                   <p>This is the profile popover content.</p>
//                 </div>
//               </PopoverContent>
//             </Popover>
//           </li>          
//         </ul>          
//       </nav>
//       <hr />
//       {/* <hr style={{ borderWidth: '1.5px', borderColor: 'black', borderStyle: 'solid', zIndex:99 }} />             */}
//     </div>
//   );
// }

// ///////////////////////////////
// // Left, Middle, Right 파트
// ///////////////////////////////

function LeftPart({ middlePosition, moveDirection, selectedRegion }) {
  useEffect(() => {
    if (middlePosition === 2) {
      // 사용 가능한 오디오 입력 장치 확인
      navigator.mediaDevices.enumerateDevices()
        .then(devices => {
          const audioInputDevices = devices.filter(device => device.kind === 'audioinput');
          if (audioInputDevices.length > 0) {
            // 오디오 입력 장치가 있으면 getUserMedia 호출
            navigator.mediaDevices.getUserMedia({ audio: true })
              .then((stream) => {
                console.log('마이크 허용됨');
                // 마이크 스트림을 사용할 수 있습니다.
              })
              .catch((error) => {
                console.error('마이크 허용 오류:', error);
              });
          } else {
            console.error('사용 가능한 오디오 입력 장치가 없습니다.');
          }
        })
        .catch(error => {
          console.error('장치 나열 오류:', error);
        });
    }
  }, [middlePosition]);

  function buttonLearn(num : number) {
    const router = useRouter()
    let region = 0
    if (selectedRegion === "경기도") {
      region = 1;
    }
    console.log("hey2")
    router.push(`/lesson/${region}/${num}`)
    // redirect(`/lesson/${region}/${num}`);
  }

  return (
    <div 
      className="leftpart" 
      style={{ 
        zIndex: (() => {
          if (middlePosition === 0) {
            return 0;
          } 
          else if (middlePosition === 1) {
            if (moveDirection == "left"){
              console.log("left")
              return 0;
            }
            else if (moveDirection == "right") {
              console.log("right")
              return 2;
            }            
          } 
          else if (middlePosition === 2) {
            return 2;
          } 
        })()
      }}>
      <div style={{position:'absolute', margin: "50px", top:"5%", left: "70px"}}>
        <div>
          <h1 style={{fontSize:30, fontWeight:"bold"}}>학습 페이지</h1>
        </div>
        <br />
        <div className="button-grid">
          <img src="/MainPage/learnButton1.png" alt="" onClick={() => {buttonLearn(1)}}/>
          <img src="/MainPage/learnButton2.png" alt="" onClick={() => {buttonLearn(2)}}/>
          <img src="/MainPage/learnButton3.png" alt="" onClick={() => {buttonLearn(3)}}/>
          <img 
            src={selectedRegion !== "경기도" ? "/MainPage/learnButton4.png" : "/MainPage/learnButton5.png"}  
            onClick={() => {buttonLearn(4)}}           
            alt="" 
          />       
        </div>
      </div>
    </div>
      
  );
}

function MiddlePart({ middlePosition, mainPageIndicator, selectedRegion }) {
  return (
    <div className="middlepart" style={{ 
      left: (() => {
        if (middlePosition === 0) {
          return "-110%";
        } else if (middlePosition === 1) {
          return "0%";
        } else if (middlePosition === 2) {
          return "110%";
        } else {
          return null;
        }
      })()
    }}>
      <h1 className="blink" style={{position: 'absolute', 
        top: '75%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)',
        fontSize: 25,
      }}> { mainPageIndicator } </h1>   
    </div>
  );
}



function RightPart() {

  const router = useRouter()

  function GameStartButton() {
    console.log("hey");
    router.push("/game");
  }
  



  return (
    <div className="rightpart" style={{ height: '100vh' }}>
      <div style={{position:'absolute', margin: "50px", top:"10%", right: "220px", display:'flex'}}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: 30, fontWeight: 'bold' }}>게임 페이지</h1>
          </div>
          <div className="profile-grid" style={{ margin: '20px 0' }}>
            <img src="/MainPage/buttonFood.png" alt="" />
          </div>
          <Button variant="contained" onClick={GameStartButton} style={{ marginTop: '20px' }}>게임 시작</Button>
        </div>
      </div>
    </div>
  );
}

// ///////////////////////
// // Footer 파트
// ///////////////////////

// function Footer () {
//   return (
//     console.log("")
//   )
// }






///////////////////////
// 버튼과 맵 
///////////////////////
function ButtonPart({ onLeftClick, onRightClick, middleToWhere, selectedRegion }) {
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

function MiddleMap({ left, onRegionClick, selectedRegion }) {
  return (
    <div className="middleMap" style={{ left: left === "null" ? null : left, top: "39%" }}>
      <h1 style={{ textAlign: "center" }}> { selectedRegion }</h1>
      <div style={{ width: '50%', height: '50%' }}>
        <KoreaMap onRegionClick={onRegionClick} />
      </div>
    </div>
  );
}

export default function App() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [mapLeft, setMapLeft] = useState('50%'); // 초기 left 값을 50%로 설정
  const [middleToWhere, setMiddleToWhere] = useState(1); // 0, 1, 2 이 세 가지 값을 사용
  let moveDirection = useRef("null");
  const [isCapitalChoosed, setIsCapitalChoosed] = useState(false)
  const [mainPageIndicator, setMainPageIndicator] = useState("지역을 선택하세요");
  const currentMainPageRef = useRef(1);
  const [selectedRegion, setSelectedRegion] = useState("_");

  const handleRegionClick = (region) => {
    setSelectedRegion(region);
    if (region !== "null"){
      setMainPageIndicator("학습 또는 게임을 선택하세요")      
    }
  };

  const handleProfileClick = (e) => {
    e.preventDefault();
    setModalOpen(true);
  };

//   const closeModal = () => {
//     setModalOpen(false);
//   };

  const handleLeftClick = (e) => {
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

  const handleRightClick = (e) => {
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
        {/* <Header onProfileClick={handleProfileClick} />         */}
        
        <LeftPart 
          middlePosition = {middleToWhere} 
          moveDirection = {moveDirection.current} 
          selectedRegion = {selectedRegion} />
        <MiddlePart middlePosition = {middleToWhere} mainPageIndicator = {mainPageIndicator} selectedRegion = {selectedRegion} />
        <RightPart />
        <ButtonPart onLeftClick={handleLeftClick} onRightClick={handleRightClick} middleToWhere = {middleToWhere} selectedRegion = {selectedRegion} />
        <MiddleMap left={mapLeft} onRegionClick={handleRegionClick} selectedRegion = {selectedRegion}/>
      </div>
    </div>
  );
}
