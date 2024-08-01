// components/Start.tsx
"use client";

import * as React from 'react';
import Link from "next/link";
import Image from "next/image";
import Button from "@mui/material/Button";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import "./styles.css";

// 색
const SignupButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#99DE83',  // 원래 색상
  '&:hover': {
    backgroundColor: '#7AB367',  // 호버 시 색상
  },
}));

export default function Start() {
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const router = useRouter();

  useEffect(() => {
    const accessToken = sessionStorage.getItem("accessToken");
    if (accessToken) {
      router.push("/main");
    }
  }, [router]);
  

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className="container">   
      {/* Start 1 */}
      <main className="main">
        <div className="content">
          <h1 className="title">실시간 음성 분석, 채팅으로</h1>
          <h3 className="title">사투리를 재미있게 배워보세요.</h3>
          <p className="description">
            사투리를 배워볼 준비가 되셨나요? 서비스를 이용하기 위해 회원가입 하세요.
          </p>
          <Link href="/login">
            <SignupButton 
              variant="contained"
              sx={{
                fontSize: {
                  sm: '25px',
                },
                fontWeight: 'bold',
                width: 450, // 픽셀 단위
                height: 70,
                margin: '10px 20px', // 상하 10px, 좌우 20px
                padding: '5px 15px', // 내부 패딩
              }}
            >
              회원 가입
            </SignupButton>
          </Link>
        </div>
      </main>

      {/* Start 2 */}
      <div className="intro">
        <h2>대한민국 전국 사투리를 한 곳에</h2>
        <p>
          경상도, 전라도, 강원도 등 각 지역별로 존재하는 다양한 사투리를 경험해 보세요.
        </p>
        <p>
          사투리 학습과 채팅을 이용한 게임이 준비되어 있습니다.
        </p>
      </div>

      {/* Start 3 */}
      <div className="intro">
        <h2>발음 정확도, 억양 유사도를 통한 사투리 학습</h2>
        <p>
          원하는 지역의 학습을 고른 뒤, 해당 음성을 듣고 따라하여 유사도를 얻을 수 있습니다.
        </p>
        <p>
          각 지역별로 준비된 음성파일로 쉽게 따라할 수 있습니다.
        </p>
        <p>
          실시간 채팅으로 여러 플레이어들과 사투리 맞추기를 겨뤄보세요.
        </p>
      </div>

      {/* Start 4 */}
      <div className="intro">
        <h2>다양한 컨텐츠를 통해 키우는 나만의 쿼카</h2>
        <p>
          사투리 학습, 실시간 채팅을 통한 경험치로 쿼카를 키워보세요.
        </p>
        <p>
          데일리 스트릭, 학습, 게임을 통해 귀여운 쿼카를 키울 수 있습니다.
        </p>
      </div>

      <div className="bottom">
        <Image src="/SSLogo.png" width={255} height={170} alt="SSLogo" />
        <div>바로 시작 해보세요</div>
        <Link href="/login">
            <SignupButton 
              variant="contained"
              sx={{
                fontSize: {
                  sm: '25px',
                },
                fontWeight: 'bold',
                width: 350, // 픽셀 단위
                height: 60,
                margin: '30px 20px', // 상하 10px, 좌우 20px
                padding: '5px 15px', // 내부 패딩
              }}
            >
              회원 가입
            </SignupButton>
          </Link>
      </div>

      {/* FAQ */}
      <div className="faq">
        <h2>자주 묻는 질문</h2>
        {/* 아코디언 1 */}
        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography sx={{ width: '33%', flexShrink: 0 }}>사투리가 서툴러유는 무엇인가요?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              사투리가 서툴러유는 실시간 녹음을 통해 발음 정확도와 억양 유사도를 분석하여 사투리와 얼마나 유사한지 보여줍니다. 또한 실시간 채팅 게임을 통해 다른 사람들과 경쟁을 해보세요.
            </Typography>
          </AccordionDetails>
        </Accordion>
        {/* 아코디언2 */}
        <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2bh-content"
            id="panel2bh-header"
          >
            <Typography sx={{ width: '33%', flexShrink: 0 }}>사투리란 무엇인가요?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              사투리는 특정 지역에서 사용되는 독특한 언어적 표현이나 억양을 의미합니다. 표준어와는 다르게 지역마다 고유한 어휘, 발음, 문법이 존재하며, 이는 그 지역의 문화와 역사를 반영합니다.
            </Typography>
          </AccordionDetails>
        </Accordion> 
        {/* 아코디언 3 */}
        <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3bh-content"
            id="panel3bh-header"
          >
            <Typography sx={{ width: '33%', flexShrink: 0 }}>왜 사투리를 배워야 하나요?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              사투리를 배우면 지역의 문화와 사람들을 더 깊이 이해할 수 있습니다. 또한, 사투리는 지역 정체성의 중요한 부분이므로 이를 배우는 것은 지역 사회에 대한 존중과 소속감을 높일 수 있습니다.
            </Typography>
          </AccordionDetails>
        </Accordion>
        {/* 아코디언 4 */}
        <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel4bh-content"
            id="panel4bh-header"
          >
            <Typography sx={{ width: '33%', flexShrink: 0 }}>게임은 어떻게 진행되나요?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              게임 탭에서 게임시작 버튼을 클릭하여 큐를 돌린 5명의 유저가 게임을 진행합니다. 주관식 혹은 객관식으로 이루어진 사투리 퀴즈를 통해 점수를 획득하여 높은 등수를 노려보세요.
            </Typography>
          </AccordionDetails>
        </Accordion>
        {/* 아코디언 5 */}
        <Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel5bh-content"
            id="panel5bh-header"
          >
            <Typography sx={{ width: '33%', flexShrink: 0 }}>마이크 사용은 필수인가요?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              교육 탭에서 마이크 사용은 필수입니다. 음성 녹음을 통한 억양, 발음 유사도 측정을 통해 그래프와 퍼센트를 결과로 보여줍니다. 게임 탭에서는 마이크는 별도로 필요하지 않으며, 채팅으로만 진행이 됩니다.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
}
