"use client";

import * as React from 'react';
import Link from "next/link";
import Image from "next/image";
import { Button, Accordion, AccordionDetails, AccordionSummary, Typography, Box  } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { styled } from '@mui/system'
import { spacing } from '@mui/system';

const AnimatedText: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <Box 
      ref={ref as React.RefObject<HTMLDivElement>}
      sx={{
        opacity: 0,
        transform: 'translateY(20px)',
        transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
        transitionDelay: `${delay}s`,
        ...(isVisible && {
          opacity: 1,
          transform: 'translateY(0)',
        }),
      }}
    >
      {children}
    </Box>
  );
};

export default function Start() {
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const router = useRouter();

  useEffect(() => {
    const accessToken = sessionStorage.getItem('accessToken');
    if (accessToken) {
      router.push('/main');
    }
  }, [router]);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box className="bg-gray-100" sx={{ p: '0 !important', m: '0 !important' }}>
      <Box 
        sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <main
          className="flex flex-col items-center text-center mb-[150px] text-black w-full"
          style={{
            background: `
              linear-gradient(to bottom, rgba(0,0,0,0) 30%, rgb(243, 244, 246) 100%),
              url('/background2.webp') no-repeat center center / cover
            `,
            minHeight: '66vh',
            paddingTop: '50px',
          }}
          >
          <Box className="content w-full" sx={{ mt: '10%' }}>
            <AnimatedText delay={0}>
              <Typography variant="h1" className="text-5xl m-0" sx={{ fontWeight: 'bold' }}>
                실시간 음성 분석, 게임으로
              </Typography>
            </AnimatedText>
            <AnimatedText delay={0.3}>
              <Typography variant="h1" className="text-5xl m-0 mb-10">
                사투리를 재미있게 배워보세요.
              </Typography>
            </AnimatedText>
            <AnimatedText delay={0.6}>
              <Typography variant="body1" className="text-2xl my-5 mb-[70px] font-bold">
                사투리를 배워볼 준비가 되셨나요? 서비스를 이용하기 위해 회원가입 하세요.
              </Typography>
            </AnimatedText>
            <AnimatedText delay={0.9}>
              <Link href="/login" style={{ textDecoration: 'none' }}>
                <Button 
                  variant="contained"
                  sx={{
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    width: '350px',
                    height: '60px',
                    margin: '30px 0',
                    padding: '5px 15px',
                    backgroundColor: '#d2e1ff',
                  }}
                >
                  시작하기
                </Button>
              </Link>
            </AnimatedText>
          </Box>
        </main>

        <main className="flex flex-col items-center text-center my-[50px] text-black w-full">
          <Box className="content w-full">
            <AnimatedText delay={0}>
              <Typography variant="h2" className="text-5xl mb-5">대한민국 전국 사투리를 한 곳에서</Typography>
            </AnimatedText>
            <AnimatedText delay={0.3}>
              <Typography variant="body1" className="text-xl font-bold">
                경상도, 전라도, 강원도 등 각 지역별로 존재하는 다양한 사투리를 경험해 보세요.
              </Typography>
            </AnimatedText>
            <AnimatedText delay={0.6}>
              <Typography variant="body1" className="text-xl font-bold">
                지역어 학습과 스피드 퀴즈 게임이 준비되어 있습니다.
              </Typography>
            </AnimatedText>
          </Box>
        </main>
      <Box
        component="img"
        src="/app/(home)/start/startPageExample.png"
        alt="Start Page Example"
        sx={{
          width: '80%',  
          marginBottom: "15%",
          maxWidth: '100%',
        }}
      />          

        <main className="flex flex-col items-center text-center my-[60px] text-black w-full">
          <Box className="content w-full">
          <AnimatedText delay={0}>
            <Typography variant="h2" className="text-5xl mb-5">발음 정확도, 억양 유사도를 통한 사투리 학습</Typography>
          </AnimatedText>
          <AnimatedText delay={0.3}>
            <Typography variant="body1" className="text-xl font-bold">
              원하는 지역과 유형을 선택한 뒤, 준비된 음성을 듣고 따라해 보세요.
            </Typography>
          </AnimatedText>
          <AnimatedText delay={0.6}>
            <Typography variant="body1" className="text-xl font-bold">
              전국의 사투리 뿐만 아니라, 표준어도 학습할 수 있습니다.
            </Typography>
          </AnimatedText>
          </Box>
        </main>
      <Box
        component="img"
        src="/app/(home)/start/startPageExample.png"
        alt="Start Page Example"
        sx={{
          width: '80%',  
          maxWidth: '100%',
          marginBottom: "15%",
        }}
      />

        <main className="flex flex-col items-center text-center my-[60px] text-black w-full">
          <Box className="content w-full">
          <AnimatedText delay={0}>
            <Typography variant="h2" className="text-5xl mb-5">실시간 채팅을 통한 스피드 퀴즈 게임</Typography>
          </AnimatedText>
          <AnimatedText delay={0.3}>
            <Typography variant="body1" className="text-xl font-bold">
              원하는 지역을 선택하여 게임에 입장해 보세요.
            </Typography>
          </AnimatedText>
          <AnimatedText delay={0.6}>
            <Typography variant="body1" className="text-xl font-bold">
              사투리 단어와 관련된 스피드 퀴즈를 즐겨보세요.
            </Typography>
          </AnimatedText>
          </Box>
        </main>
      <Box
        component="img"
        src="/app/(home)/start/startPageExample.png"
        alt="Start Page Example"
        sx={{
          width: '80%',  
          marginBottom: "15%",
          maxWidth: '100%',
        }}
      />

      <Box 
        className="contents text-black font-bold text-3xl text-center"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          marginBottom: '150px',
        }}
      >
        <Image src="/SSLogo.png" width={255} height={170} alt="SSLogo" />
        <Box sx={{ mt: 2, mb: 2 }}>바로 시작 해보세요</Box>
        <Link href="/login" style={{ textDecoration: 'none' }}>
          <Button 
            variant="contained"
            sx={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              width: '350px',
              height: '60px',
              margin: '30px 0',
              padding: '5px 15px',
            }}
          >
            시작하기
          </Button>
        </Link>
      </Box>
  
      {/* FAQ */}
      <Box className="w-full max-w-4xl mx-auto mt-10">
      <h2 className="text-4xl mb-5 text-center text-black">자주 묻는 질문</h2>
        {/* 아코디언 1 */}
        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography sx={{ width: '100%', flexShrink: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>사투리가 서툴러유는 무엇인가요?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography sx={{ width: '100%', flexShrink: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>
              사투리가 서툴러유는 실시간 녹음을 통해 발음 정확도와 억양 유사도를 분석하여 사투리와 얼마나 유사한지 보여줍니다. 또한 실시간 스피드 퀴즈 게임을 통해 다른 사람들과 경쟁을 해보세요.
            </Typography>
          </AccordionDetails>
        </Accordion>
        {/* 아코디언2 */}
        <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2bh-content"
            sx={{ width: '100%', flexShrink: 0, fontSize: '1.2rem' }}
            id="panel2bh-header"
          >
            <Typography sx={{ width: '100%', flexShrink: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>사투리란 무엇인가요?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography sx={{ width: '100%', flexShrink: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>
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
            <Typography sx={{ width: '100%', flexShrink: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>왜 사투리를 배워야 하나요?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography sx={{ width: '100%', flexShrink: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>
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
            <Typography sx={{ width: '100%', flexShrink: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>게임은 어떻게 진행되나요?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography sx={{ width: '100%', flexShrink: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>
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
            <Typography sx={{ width: '100%', flexShrink: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>마이크 사용은 필수인가요?</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography sx={{ width: '100%', flexShrink: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>
              교육 탭에서 마이크 사용은 필수입니다. 음성 녹음을 통한 억양, 발음 유사도 측정을 통해 그래프와 퍼센트를 결과로 보여줍니다. 게임 탭에서는 마이크는 별도로 필요하지 않으며, 채팅으로만 진행이 됩니다.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>

    <style jsx global>{`
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `}</style>
  </Box>
)};