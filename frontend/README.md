## 시작하기

```bash
# in terminal

npm install # install dependencies

npm run dev # run dev server

npm run build # build server

npm run start # start server 
```


```

'/login' (로그인)
│
├───── '/register' (회원가입) ───── '/step' (추가 질문)
│
│                ┌───────────────────────┬ '/changepassword' (비밀번호변경)
'/' ──┬────── '/user' ── '/profile'      │
      │                      │           │
      │                      └────── '/update' (개인정보수정)
      │
      │     (레슨)
      ├── '/lesson' ── '/{lesson_group_id}' (문제 그룹 설정)
      │                       └─ '/{category_id}' (카테고리 설정)
      │                              └─'/{lesson_id}'────'/result'  (결과 페이지)
      │                                  (문제 풀이)
      │    (게임)
      └── '/game' ─── [roomId] (소켓 주소)
                         │
                         ├─── 'in-queue' (대기열)
                         └─── 'in-game' (게임) ─── '/result' (게임 결과)
```

## Dev Stack

### 디자인 툴
- Figma          ( 디자인 및 목업, 와이어프레임 제작 )

### 협업 툴
- Gitlab         ( 버전 관리 )
- JIRA,notion    ( 일정 및 이벤트 관리 )

### 개발 툴
- Typescript     
-> 왜 굳이 TS? 자바스크립트에 대한 확실한 학습을 목적으로 함
- React.js       ( 프론트엔드 프레임워크 )
- Next.js        ( 프론트엔드 프레임워크 )
- Material ui    ( CSS 관련 라이브러리 )
- Tailwind       ( CSS 관련 라이브러리 )
- Axios          ( api 요청을 위한 라이브러리 )
-> fetch 대신 쓰는 이유가 있느냐? axios는 json형태로 반환하기에 추가적인 변환을 필요로 하지 않음
-> 또한 인터셉터를 활용하여 추가적인 조작이 가능해 채택
- stomp          ( 소켓 연결을 위한 라이브러리 )
-> 소켓 연결을 위해 사용. 채팅 기능만 구현했기에 지연율이 낮은 stomp가 최적의 선택이었음
