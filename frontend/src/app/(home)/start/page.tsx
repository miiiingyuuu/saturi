"use client"

import Link from "next/link";
import Image from "next/image";
import { Button, Accordion, AccordionItem } from "@nextui-org/react";
import "./styles.css";

export default function Start() {
  const Content1 =
    "사투리가 서툴러유는 실시간 녹음을 통해 발음 정확도와 억양 유사도를 분석하여 사투리와 얼마나 유사한지 보여줍니다. 또한 실시간 채팅 게임을 통해 다른 사람들과 경쟁을 해보세요.";
  const Content2 =
    "사투리는 특정 지역에서 사용되는 독특한 언어적 표현이나 억양을 의미합니다. 표준어와는 다르게 지역마다 고유한 어휘, 발음, 문법이 존재하며, 이는 그 지역의 문화와 역사를 반영합니다.";
  const Content3 =
    "사투리를 배우면 지역의 문화와 사람들을 더 깊이 이해할 수 있습니다. 또한, 사투리는 지역 정체성의 중요한 부분이므로 이를 배우는 것은 지역 사회에 대한 존중과 소속감을 높일 수 있습니다.";
  const Content4 =
    "게임 탭에서 게임시작 버튼을 클릭하여 큐를 돌린 5명의 유저가 게임을 진행합니다. 주관식 혹은 객관식으로 이루어진 사투리 퀴즈를 통해 점수를 획득하여 높은 등수를 노려보세요.";
  const Content5 =
    "교육 탭에서 마이크 사용은 필수입니다. 음성 녹음을 통한 억양, 발음 유사도 측정을 통해 그래프와 퍼센트를 결과로 보여줍니다. 게임 탭에서는 마이크는 별도로 필요하지 않으며, 채팅으로만 진행이 됩니다.";

  return (    
    <div className="container">      
      <main className="main">
        <div className="content">
          <h1 className="title">실시간 음성 분석, 채팅으로</h1>
          <h3 className="title">사투리를 재미있게 배워보세요.</h3>
          <p className="description">
            사투리를 배워볼 준비가 되셨나요? 서비스를 이용하기 위해 회원가입 하세요.
          </p>
          <Link href="/login">
            <Button className="signupButton">회원 가입</Button>
          </Link>
        </div>
      </main>

      <div className="intro">
        <h2>대한민국 전국 사투리를 한 곳에</h2>
        <p>
          경상도, 전라도, 강원도 등 각 지역별로 존재하는 다양한 사투리를 경험해 보세요.
        </p>
        <p>
          사투리 학습과 채팅을 이용한 게임이 준비되어 있습니다.
        </p>
      </div>

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
        <Image src="/SSLogo.png" width={300} height={300} alt="SSLogo" />
        <div>바로 시작 해보세요</div>
        <Link href="/login">
          <Button className="signupButton">로그인</Button>
        </Link>
      </div>

      <div className="faq">
        <h2>자주 묻는 질문</h2>
        <Accordion variant="bordered" className="faq-item">
          <AccordionItem key="1" aria-label="Accordion 1" title="사투리가 서툴러유는 무엇인가요?">
            {Content1}
          </AccordionItem>
          <AccordionItem key="2" aria-label="Accordion 2" title="사투리란 무엇인가요?">
            {Content2}
          </AccordionItem>
          <AccordionItem key="3" aria-label="Accordion 3" title="왜 사투리를 배워야 하나요?">
            {Content3}
          </AccordionItem>
          <AccordionItem key="4" aria-label="Accordion 4" title="게임은 어떤 방식으로 진행되나요?">
            {Content4}
          </AccordionItem>
          <AccordionItem key="5" aria-label="Accordion 5" title="마이크 사용은 필수인가요?">
            {Content5}
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
