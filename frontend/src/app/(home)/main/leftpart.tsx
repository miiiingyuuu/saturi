import { useEffect } from "react";
import { useRouter } from "next/navigation";


interface LeftPartProps {
    middlePosition: number;
    moveDirection: string;
    selectedRegion: string;
  }

export default function LeftPart({ middlePosition, moveDirection, selectedRegion }: LeftPartProps) {
    const router = useRouter();

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
  
    function buttonLearn(num: number) {      
      let region = 0;
      if (selectedRegion === "경기도") {
        region = 1;
      }
      console.log("hey2");
      router.push(`/lesson/${region}/${num}`);
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
              if (moveDirection === "left") {
                console.log("left");
                return 0;
              }
              else if (moveDirection === "right") {
                console.log("right");
                return 2;
              }
            }
            else if (middlePosition === 2) {
              return 2;
            }
          })()
        }}>
        <div style={{ position: 'absolute', margin: "50px", top: "5%", left: "70px" }}>
          <div>
            <h1 style={{ fontSize: 30, fontWeight: "bold" }}>학습 페이지</h1>
          </div>
          <br />
          <div className="button-grid">
            <img src="/MainPage/learnButton1.png" alt="" onClick={() => { buttonLearn(1) }} />
            <img src="/MainPage/learnButton2.png" alt="" onClick={() => { buttonLearn(2) }} />
            <img src="/MainPage/learnButton3.png" alt="" onClick={() => { buttonLearn(3) }} />
            <img
              src={selectedRegion !== "경기도" ? "/MainPage/learnButton4.png" : "/MainPage/learnButton5.png"}
              onClick={() => { buttonLearn(4) }}
              alt=""
            />
          </div>
        </div>
      </div>
    );
  }