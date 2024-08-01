import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ButtonBase from '@mui/material/ButtonBase';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface LeftPartProps {
  middlePosition: number;
  moveDirection: string;
  selectedRegion: string;
}

export default function LeftPart({
  middlePosition,
  moveDirection,
  selectedRegion,
}: LeftPartProps) {
  const router = useRouter();

  useEffect(() => {
    if (middlePosition === 2) {
      navigator.mediaDevices
        .enumerateDevices()
        .then(devices => {
          const audioInputDevices = devices.filter(
            device => device.kind === "audioinput",
          );
          if (audioInputDevices.length > 0) {
            navigator.mediaDevices.getUserMedia({ audio: true })
              .then(() => {
                // 마이크 허용됨
              })
              .catch((error) => {
                // eslint-disable-next-line no-console
                console.error('마이크 허용 오류:', error);
              });
          } else {
            // eslint-disable-next-line no-console
            console.error('사용 가능한 오디오 입력 장치가 없습니다.');
          }
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.error('장치 나열 오류:', error);
        });
    }
  }, [middlePosition]);

  function buttonLearn(num: number) {
    let region = 1;
    switch (selectedRegion) {
      case "경기도":
        region = 2;
        break;
      case "강원도":
        region = 3;
        break;
      case "충청도":
        region = 4;
        break;
      case "전라도":
        region = 5;
        break;
      case "경상도":
        region = 6;
        break;
      case "제주도":
        region = 7;
        break;
      default:
        // eslint-disable-next-line no-console
        console.error("지역 설정 에러");
    }
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
          if (middlePosition === 1) {
            return moveDirection === "right" ? 2 : 0;
          }
          if (middlePosition === 2) {
            return 2;
          }
          return 0;
        })()
      }}>
      <Box sx={{ position: 'absolute', margin: "25px", top: "7%", left: "70px", width: "25vw" }}>
        <Typography variant="h1" sx={{ fontSize: 30, fontWeight: "bold" }}>학습 페이지</Typography>
        <br />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 2,
          }}
        >
          <ButtonBase
            onClick={() => {
              buttonLearn(1);
            }}
            sx={{
              width: "100%",
              height: 0,
              paddingBottom: "100%",
              position: "relative",
            }}
          >
            <Box
              component="img"
              src="/MainPage/learnButton1.png"
              alt=""
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </ButtonBase>
          <ButtonBase
            onClick={() => {
              buttonLearn(2);
            }}
            sx={{
              width: "100%",
              height: 0,
              paddingBottom: "100%",
              position: "relative",
            }}
          >
            <Box
              component="img"
              src="/MainPage/learnButton2.png"
              alt=""
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </ButtonBase>
          <ButtonBase
            onClick={() => {
              buttonLearn(3);
            }}
            sx={{
              width: "100%",
              height: 0,
              paddingBottom: "100%",
              position: "relative",
            }}
          >
            <Box
              component="img"
              src="/MainPage/learnButton3.png"
              alt=""
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </ButtonBase>
          <ButtonBase
            onClick={() => {
              buttonLearn(4);
            }}
            sx={{
              width: "100%",
              height: 0,
              paddingBottom: "100%",
              position: "relative",
            }}
          >
            <Box
              component="img"
              src={
                selectedRegion !== "경기도"
                  ? "/MainPage/learnButton4.png"
                  : "/MainPage/learnButton5.png"
              }
              alt=""
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </ButtonBase>
        </Box>
      </Box>
    </div>
  );
}
