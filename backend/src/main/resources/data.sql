-- /*지역*/
-- INSERT INTO location (name) VALUES ('default'), ('gyungsang'), ('gyunggi'), ('gangwon'), ('chungcheong'), ('jeonra'), ('jeju');

-- /*사투리무새*/
-- INSERT INTO bird (name, description) VALUES
--                                          ('miner', '광부'), ('banker', '은행원'), ('clown', '어릿광대'), ('sailor', '선원'),
--                                          ('deckhand', '갑판원'), ('evil_king', '악의수장'),('cavalry', '총기병'), ('cute_killer', '귀여운 살인마'),
--                                          ('store_owner', '잡화상'), ('agent', '요원'), ('oil_mogul', '석유부자'), ('redhair', '빨간머리'), ('scout', '정찰대'),
--                                          ('secret_society', '비밀결사'), ('showhost', '쇼호스트'), ('mercenary', '용병'), ('engineer', '기관사'), ('musketeer', '삼총사');

-- /*회원*/
-- INSERT INTO user (location_id, email, nickname, password, reg_date, exp, gender, age_range, role, deleted_dt, is_deleted, bird_id, return_dt) VALUES
--                                                                                                                                                   (1, 'email1@email.com', '내이름은1번', 'ZevNV3FYY6lSw9HDnbhTpA==', NOW(), 1024, 'MALE', 'TWENTEEN', 'BASIC', null, false, 2, null),
--                                                                                                                                                   (2, 'email2@email.com', '내이름은2번', 'IbL8z6/rg+2CK6iZ7J6hEA==', NOW(), 5010, 'FEMALE', 'DEFAULT', 'BASIC', null, false, 4, null),
--                                                                                                                                                   (2, 'email3@email.com', '내이름은3번', '9d3ULzS+ihS84sIW60rEOw==', NOW(), 512, 'DEFAULT', 'TEENAGER', 'BASIC', null, false, 11, null),
--                                                                                                                                                   (2, 'email4@email.com', '내이름은4번', '1oj+RRZxZWwWS/gHbJFHHQ==', NOW(), 22, 'FEMALE', 'CHILD', 'BASIC', null, false, 3, null),
--                                                                                                                                                   (2, 'email5@email.com', '내이름은5번', 'qt1B/2K9NtekZ1yYH+7Gbw==', NOW(), 518, 'MALE', 'TWENTEEN', 'BASIC', null, false, 1, null),
--                                                                                                                                                   (2, 'email6@email.com', '내이름은6번', '8UJvdYxj9gW9EMSOfSAb9A==', NOW(), 1940, 'DEFAULT', 'FOURTEEN', 'BASIC', null, false, 2, null),
--                                                                                                                                                   (2, 'email7@email.com', '내이름은7번', 'kLrALa1lJ3CCqd76hwg+5g==', NOW(), 2062, 'MALE', 'DEFAULT', 'BASIC', null, false, 3, null),
--                                                                                                                                                   (2, 'email8@email.com', '내이름은8번', '9GkS5XTJ1bR11jntL06AfA==', NOW(), 1244, 'FEMALE', 'TWENTEEN', 'BASIC', null, false, 4, null),
--                                                                                                                                                   (2, 'email9@email.com', '내이름은9번', 'SaeO8PZsmRzRp0tpQcOOnw==', NOW(), 4464, 'DEFAULT', 'THIRTEEN', 'BASIC', null, false, 5, null),
--                                                                                                                                                   (2, 'email10@email.com', '내이름은10번', 'fyZo6+9GVhiRTZdKtbay0A==', NOW(), 2910, 'FEMALE', 'TEENAGER', 'BASIC', null, false, 6, null),
--                                                                                                                                                   (3, 'email11@email.com', '내이름은11번', 'lgSnP5XLFl354+RRR3r+/A==', NOW(), 2488, 'MALE', 'TWENTEEN', 'BASIC', null, false, 18, null),
--                                                                                                                                                   (4, 'email12@email.com', '내이름은12번', '9QFEEcBjL0WxF4GgcSC+zw==', NOW(), 4984, 'DEFAULT', 'DEFAULT', 'BASIC', null, false, 11, null),
--                                                                                                                                                   (5, 'email13@email.com', '내이름은13번', 'RxdX27bJg5bb9XxLapeWgw==', NOW(), 3082, 'MALE', 'TWENTEEN', 'BASIC', null, false, 15, null),
--                                                                                                                                                   (6, 'email14@email.com', '내이름은14번', 'muIa2aMpNjx17BA05lPpGA==', NOW(), 3820, 'FEMALE', 'FIFTEEN', 'BASIC', null, false, 17, null),
--                                                                                                                                                   (7, 'email15@email.com', '내이름은15번', 'R5Rog5Cv0gEfwB5Lw2byCw==', NOW(), 2924, 'DEFAULT', 'TEENAGER', 'BASIC', null, false, 18, null),
--                                                                                                                                                   (3, 'email16@email.com', '내이름은16번', 'jAQJQk4rlifmM2++ELo1Sg==', NOW(), 904, 'FEMALE', 'TWENTEEN', 'BASIC', null, false, 7, null),
--                                                                                                                                                   (4, 'email17@email.com', '내이름은17번', 'VV6NHy5EDo2PqY2QAl+n+Q==', NOW(), 692, 'MALE', 'THIRTEEN', 'BASIC', null, false, 8, null),
--                                                                                                                                                   (5, 'email18@email.com', '내이름은18번', 'u5hCBcKZrKJBHUfmRh6txA==', NOW(), 1320, 'DEFAULT', 'DEFAULT', 'BASIC', null, false, 9, null),
--                                                                                                                                                   (6, 'email19@email.com', '내이름은19번', 'v4I56UqMoLXesXJglNC8FA==', NOW(), 2716, 'MALE', 'FOURTEEN', 'BASIC', null, false, 9, null),
--                                                                                                                                                   (7, 'email20@email.com', '내이름은20번', 'xyxyJBOEkEoOuBC5e0M8BQ==', NOW(), 400, 'FEMALE', 'TWENTEEN', 'BASIC', null, false, 8, null),
--                                                                                                                                                   (3, 'email21@email.com', '내이름은21번', 'xlEocKV+ZFh9m45f+68Apw==', NOW(), 300, 'DEFAULT', 'CHILD', 'BASIC', null, false, 7, null),
--                                                                                                                                                   (4, 'email22@email.com', '내이름은22번', 'DO5bEMlDI3yUeceshq2Gdg==', NOW(), 422, 'FEMALE', 'TWENTEEN', 'BASIC', null, false, 6, null),
--                                                                                                                                                   (5, 'email23@email.com', '내이름은23번', 'qKGSNk3NJqOHGEB1WPjv7A==', NOW(), 1234, 'MALE', 'DEFAULT', 'BASIC', null, false, 5, null),
--                                                                                                                                                   (6, 'email24@email.com', '내이름은24번', 'suTwS23de/+ucP5B17Osfg==', NOW(), 4444, 'DEFAULT', 'TWENTEEN', 'BASIC', null, false, 13, null),
--                                                                                                                                                   (7, 'email25@email.com', '내이름은25번', 'Yiq8hHihGAPFTlCNIP3oLQ==', NOW(), 3322, 'MALE', 'TWENTEEN', 'BASIC', null, false, 2, null),
--                                                                                                                                                   (3, 'email26@email.com', '내이름은26번', 'pshFCg+sA/dWvnPVy0wWmA==', NOW(), 2210, 'FEMALE', 'TWENTEEN', 'BASIC', null, false, 1, null),
--                                                                                                                                                   (4, 'email27@email.com', '내이름은27번', 'sNCsUuvxIdqPH6z/lyY9sw==', NOW(), 1122, 'DEFAULT', 'TEENAGER', 'BASIC', null, false, 5, null),
--                                                                                                                                                   (5, 'email28@email.com', '내이름은28번', 'C8gTB3MMzRon2oAAVoh6tg==', NOW(), 998, 'FEMALE', 'DEFAULT', 'BASIC', null, false, 15, null),
--                                                                                                                                                   (6, 'email29@email.com', '내이름은29번', 'LnoQHR3GDUaO4M33VajJ9Q==', NOW(), 124, 'MALE', 'TWENTEEN', 'BASIC', null, false, 15, date_add(now(), interval 30 day)),
--                                                                                                                                                   (7, 'email30@email.com', '내이름은30번', '7xCjDgrlVI5cKaArr0UeCg==', date_sub(now(), interval 30 day), 136, 'DEFAULT', 'THIRTEEN', 'BASIC', NOW(), true, 11, null),
--                                                                                                                                                   (7, 'email30@email.com', '내이름은30번', '7xCjDgrlVI5cKaArr0UeCg==', date_sub(now(), interval 30 day), 136, 'DEFAULT', 'THIRTEEN', 'BASIC', NOW(), true, 11, null),
--                                                                                                                                                   (2, 'dashboard1@email.com', '돌잔치때사투리잡음', '7eh85f9tkMX5Qz/bzyoDsQ==', date_sub(now(), interval 180 day), 2875, 'MALE', 'THIRTEEN', 'BASIC', null, false, 5, null),
--                                                                                                                                                   (3, 'dashboard2@email.com', '서울빼고다시골', 'RXPAnZOn/22vmblnZ3/cHA==', date_sub(now(), interval 180 day), 5025, 'FEMALE', 'TWENTEEN', 'BASIC', null, false, 11, null),
--                                                                                                                                                   (2, 'lesson1@email.com', '저표준어잘해요', '0NZ2iWzTKRTvpnQgcUKVcQ==', date_sub(now(), interval 180 day), 1212, 'MALE', 'THIRTEEN', 'BASIC', null, false, 3, null),
--                                                                                                                                                   (3, 'lesson2@email.com', '저사투리잘해요', 'dTJAFQ9N9X9yfFjtO2I5+A==', date_sub(now(), interval 180 day), 412, 'FEMALE', 'TWENTEEN', 'BASIC', null, false, 8, null),
--                                                                                                                                                   (1, 'admin@email.com', '나는어드민이다', '7/ahP/BRTeXlDeeWFXJhyg==', NOW(), 422, 'DEFAULT', 'DEFAULT', 'ADMIN', null, false, 1, null),
--                                                                                                                                                   (1, 'adminback@email.com', '나는어드민백이다', '9jbCY94o+tabxGD48B+zVQ==', NOW(), 422, 'DEFAULT', 'DEFAULT', 'ADMIN', null, false, 1, null);

-- /*게임 팁*/
-- INSERT INTO game_tip (content) VALUES ('타자가 빠르면 유리합니다.'), ('손가락의 유연성을 높이기 위한 운동을 하세요.'), ('화면을 주의 깊게 살펴보며 빠르게 대응하세요.'),
--                                       ('손가락을 워밍업하고 시작하세요.'), ('빠른 판단력이 중요합니다.'), ('경상도 사투리는 예, 아니오로 대답하는 질문에는 ''~나'' 를 쓰고 이외의 질문에는 ''~노''를 씁니다.'),
--                                       ('경상도 사투리는 감탄문에서 의문사를 생략하고 ''~노''를 사용하기도 합니다.');

-- /*레슨 카테고리*/
-- INSERT INTO lesson_category (name) VALUES ('일상'), ('드라마 대사'), ('영화 대사'), ('밈');

-- /*레슨 그룹*/
-- INSERT INTO lesson_group (lesson_category_id, location_id, name) VALUES
--                                                                      (2, 2, '경상도 드라마 대사 첫번째 퍼즐'), (2, 2, '경상도 드라마 대사 두번째 퍼즐'), (2, 2, '경상도 드라마 대사 세번째 퍼즐'), (2, 2, '경상도 드라마 대사 네번째 퍼즐'), (2, 2, '경상도 드라마 대사 다섯번째 퍼즐'),
--                                                                      (2, 2, '경상도 드라마 대사 여섯번째 퍼즐'),(2, 2, '경상도 드라마 대사 일곱번째 퍼즐'),(2, 2, '경상도 드라마 대사 여덟번째 퍼즐'),(2, 2, '경상도 드라마 대사 아홉번째 퍼즐'),
--                                                                      (3, 2, '경상도 영화 대사 첫번째 퍼즐'), (3, 2, '경상도 영화 대사 두번째 퍼즐'), (3, 2, '경상도 영화 대사 세번째 퍼즐'), (3, 2, '경상도 영화 대사 네번째 퍼즐'), (3, 2, '경상도 영화 대사 다섯번째 퍼즐'),
--                                                                      (3, 2, '경상도 영화 대사 여섯번째 퍼즐'),(3, 2, '경상도 영화 대사 일곱번째 퍼즐'),(3, 2, '경상도 영화 대사 여덟번째 퍼즐'),(3, 2, '경상도 영화 대사 아홉번째 퍼즐'),
--                                                                      (4, 2, '경상도 밈 첫번째 퍼즐'), (4, 2, '경상도 밈 두번째 퍼즐'), (4, 2, '경상도 밈 세번째 퍼즐'), (4, 2, '경상도 밈 네번째 퍼즐'), (4, 2, '경상도 밈 다섯번째 퍼즐'),
--                                                                      (4, 2, '경상도 밈 여섯번째 퍼즐'),(4, 2, '경상도 밈 일곱번째 퍼즐'),(4, 2, '경상도 밈 여덟번째 퍼즐'),(4, 2, '경상도 밈 아홉번째 퍼즐'),
--                                                                      (1, 2, '경상도 일상 첫번째 퍼즐'), (1, 2, '경상도 일상 두번째 퍼즐'), (1, 2, '경상도 일상 세번째 퍼즐'), (1, 2, '경상도 일상 네번째 퍼즐'), (1, 2, '경상도 일상 다섯번째 퍼즐'),
--                                                                      (1, 2, '경상도 일상 여섯번째 퍼즐'), (1, 2, '경상도 일상 일곱번째 퍼즐'), (1, 2, '경상도 일상 여덟번째 퍼즐'), (1, 2, '경상도 일상 아홉번째 퍼즐'),
--                                                                      (2, 3, '경기도 드라마 대사 첫번째 퍼즐'), (2, 3, '경기도 드라마 대사 두번째 퍼즐'), (2, 3, '경기도 드라마 대사 세번째 퍼즐'), (2, 3, '경기도 드라마 대사 네번째 퍼즐'), (2, 3, '경기도 드라마 대사 다섯번째 퍼즐'),
--                                                                      (3, 3, '경기도 영화 대사 첫번째 퍼즐'), (3, 3, '경기도 영화 대사 두번째 퍼즐'), (3, 3, '경기도 영화 대사 세번째 퍼즐'), (3, 3, '경기도 영화 대사 네번째 퍼즐'), (3, 3, '경기도 영화 대사 다섯번째 퍼즐'),
--                                                                      (4, 3, '경기도 밈 첫번째 퍼즐'), (4, 3, '경기도 밈 두번째 퍼즐'), (4, 3, '경기도 밈 세번째 퍼즐'), (4, 3, '경기도 밈 네번째 퍼즐'), (4, 3, '경기도 밈 다섯번째 퍼즐'),
--                                                                      (1, 3, '경기도 일상 첫번째 퍼즐'), (1, 3, '경기도 일상 두번째 퍼즐'), (1, 3, '경기도 일상 세번째 퍼즐'), (1, 3, '경기도 일상 네번째 퍼즐'), (1, 3, '경기도 일상 다섯번째 퍼즐'),

--                                                                      (2, 4, '강원도 드라마 첫번째 퍼즐'), (2, 4, '강원도 드라마 두번째 퍼즐'), (2, 5, '충청도 드라마 첫번째 퍼즐'), (2, 5, '충청도 드라마 두번째 퍼즐'),
--                                                                      (2, 6, '전라도 드라마 첫번째 퍼즐'), (2, 6, '전라도 드라마 두번째 퍼즐'), (2, 7, '제주도 드라마 첫번째 퍼즐'), (2, 7, '제주도 드라마 두번째 퍼즐');

-- /*레슨_경상도_드라마*/
-- INSERT INTO lesson (lesson_group_id, sample_voice_path, sample_voice_name, script, last_update_dt, is_deleted) VALUES
--                                                                                                                    (1, 'no path', '경상도_드라마_1_1994_가시나운동하나도안했네', '가시나 운동 하나도 안했네', NOW(), false),
--                                                                                                                    (1, 'no path', '경상도_드라마_2_1994_그거내만안되는거아니거든', '그거 내만 안되는거 아니거든', NOW(), false),
--                                                                                                                    (1, 'no path', '경상도_드라마_3_1994_그거하나몬해주나', '그거 하나 몬해주나', NOW(), false),
--                                                                                                                    (1, 'no path', '경상도_드라마_4_1994_그런거아이다', '그런거 아이다', NOW(), false),
--                                                                                                                    (1, 'no path', '경상도_드라마_5_1994_난당신이싫습니다', '난 당신이 싫습니다', NOW(), false),
--                                                                                                                    (2, 'no path', '경상도_드라마_6_1994_난당신이좋습니다', '난 당신이 좋습니다', NOW(), false),
--                                                                                                                    (2, 'no path', '경상도_드라마_7_1994_니같은금수한테뮤지컬이웬말이고', '니같은 금수한테 뮤지컬이 웬말이고', NOW(), false),
--                                                                                                                    (2, 'no path', '경상도_드라마_8_1994_니하고아무상관없다', '니하고 아무 상관없다', NOW(), false),
--                                                                                                                    (2, 'no path', '경상도_드라마_9_1994_떡볶이나쳐묵자', '떡볶이나 쳐먹자', NOW(), false),
--                                                                                                                    (2, 'no path', '경상도_드라마_10_1994_밥무라, 고마 셰리 마 주디를 마 주잡아째삘라마', '밥무라 고마 셰리 마 주디 마 주 잡아 째삘라 마 쯧', NOW(), false),
--                                                                                                                    (3, 'no path', '경상도_드라마_11_1994_병문안안가봐도되나', '병문안 안가봐도 되나', NOW(), false),
--                                                                                                                    (3, 'no path', '경상도_드라마_12_1994_야 밥은 내가 주는데 왜 오빠한테 고맙다카는데, 내 서운타이', '야 밥은 내가 주는데 와 오빠한테 고맙다 카는데 내 서운타이', NOW(), false),
--                                                                                                                    (3, 'no path', '경상도_드라마_13_1994_어이 꼬매이, 니는 그 학교나 제대로 나오고 그런 소리 해라이 닌 오늘도 학교 안나오면 닌 내 손에 죽는다이, 섀끼 어디 삐리하구로', '어이 꼬매이 니는 거 학교나 제대로 나오고 그런 소리 해라잉 닌 오늘도 학교 안나오면 내손에 죽는다이 새끼 어데 삐대하구로', NOW(), false),
--                                                                                                                    (3, 'no path', '경상도_드라마_14_1994_여기짜장면억수로맛있는데', '여기 짜장면 억수로 맛있는데', NOW(), false),
--                                                                                                                    (3, 'no path', '경상도_드라마_15_1994_오늘도안들어온다카드나', '오늘도 안들어온다 카드나', NOW(), false),
--                                                                                                                    (4, 'no path', '경상도_드라마_16_1994_일찍자야안되겠나', '일찍 자야 안되겠나', NOW(), false),
--                                                                                                                    (4, 'no path', '경상도_드라마_17_1994_저중에서오빠가제일파이거든', '쩌 중에서 오빠가 제일 파이거든', NOW(), false),
--                                                                                                                    (4, 'no path', '경상도_드라마_18_1994_지금말해주면안되나', '지금 말해주면 안되나', NOW(), false),
--                                                                                                                    (4, 'no path', '경상도_드라마_19_1997_만나지마까', '만나지마까', NOW(), false),
--                                                                                                                    (4, 'no path', '경상도_드라마_20_1997_모르겠다', '모르겠다', NOW(), false),
--                                                                                                                    (5, 'no path', '경상도_드라마_21_1997_뭐가미안한데', '뭐가 미안한데', NOW(), false),
--                                                                                                                    (5, 'no path', '경상도_드라마_22_1997_이상한거아이가', '이상한거 아이가', NOW(), false),
--                                                                                                                    (5, 'no path', '경상도_드라마_23_1997_잘모르겠다', '잘 모르겠다', NOW(), false),
--                                                                                                                    (5, 'no path', '경상도_드라마_24_미스터션샤인_도련님 내 그래 안봤는데 사람이 좀 야박한데가 있네예', '도련님 내 그래 안봤는데 사람이 좀 야박한데가 있네예', NOW(), false),
--                                                                                                                    (5, 'no path', '경상도_드라마_25_미스터션샤인_아니_--님 욕을 왜 그 궁 앞에 가서 하시냐고요 아이구 사람들 다 듣구로 참말로', '아니 나라님 욕을 왜 그 궁 앞에가서 하시냐고요 아이고 사람들 다 듣구로 참말로', NOW(), false),
--                                                                                                                    (6, 'no path', '경상도_드라마_26_미스터션샤인_에이 뭔소리 합니까 -- 중에 제일 예쁘던데', '에이 뭔소리 합니까 한성 바닥서 본 중에 제일 예삐던데', NOW(), false),
--                                                                                                                    (6, 'no path', '경상도_드라마_27_이상한-일이가-그게', '이상한일이가 그게', NOW(), false),
--                                                                                                                    (6, 'no path', '경상도_드라마_28_야야뿌라진다응안뿌러져', '야야 뿌라진다 안뿌라진다', NOW(), false),
--                                                                                                                    (6, 'no path', '경상도_드라마_29_고마 잠이나 자야지', '고마 잠이나 자야지', NOW(), false),
--                                                                                                                    (6, 'no path', '경상도_드라마_30_그랬다 아이가', '그랬다 아이가', NOW(), false),
--                                                                                                                    (7, 'no path', '경상도_드라마_31_근데여는어쩐일인데', '근데 여는 어쩐일인데', NOW(), false),
--                                                                                                                    (7, 'no path', '경상도_드라마_32_내서운타이', '내 서운타이', NOW(), false),
--                                                                                                                    (7, 'no path', '경상도_드라마_33_니딱34편까지만볼래', '니 딱 34편까지만 볼래', NOW(), false),
--                                                                                                                    (7, 'no path', '경상도_드라마_34_사실이니까 그렇지 사실이니까', '사실이니까 그렇지 사실이니까', NOW(), false),
--                                                                                                                    (7, 'no path', '경상도_드라마_35_아이거삼만원짜리란말이야', '아 이 삼만원 짜리란 말이야', NOW(), false),
--                                                                                                                    (8, 'no path', '경상도_드라마_36_아저씨누군데요', '아저씨 누군데요', NOW(), false),
--                                                                                                                    (8, 'no path', '경상도_드라마_37_와그라는데 진짜', '와그라는데 진짜', NOW(), false),
--                                                                                                                    (8, 'no path', '경상도_드라마_38_결혼은 와할라하는데', '결혼은 와 할라하는데', NOW(), false),
--                                                                                                                    (8, 'no path', '경상도_드라마_39_1994_내불편해서그라나', '내 불편해서 그라나', NOW(), false),
--                                                                                                                    (8, 'no path', '경상도_드라마_40_근데어제부터궁금했는데', '근데어제부터궁금했는데', NOW(), false),
--                                                                                                                    (9, 'no path', '경상도_드라마_41_뭐라도입에빨리집어넣뿌야된다', '뭐라도 입에 빨리 집어 넣뿌야된다', NOW(), false),
--                                                                                                                    (9, 'no path', '경상도_드라마_42_서울사람들은그런거잘안먹드라', '서울 사람들은 그런거 잘 안먹드라', NOW(), false),
--                                                                                                                    (9, 'no path', '경상도_드라마_43_앞뒤가딱딱맞아야되나', '_앞뒤가 딱딱 맞아야되나', NOW(), false),
--                                                                                                                    (9, 'no path', '경상도_드라마_44_연애는무슨 고마 친구다', '연애는 무슨 고마 친구다', NOW(), false),
--                                                                                                                    (9, 'no path', '경상도_드라마_45_오바하지마라잉', '오바하지마라잉', NOW(), false);

-- /*레슨_경상도_영화*/
-- INSERT INTO lesson (lesson_group_id, sample_voice_path, sample_voice_name, script, last_update_dt, is_deleted) VALUES
--                                                                                                                    (10, 'no path', '경상도_영화_1_바람_보면안되나', '보면 안되나', NOW(), false),
--                                                                                                                    (10, 'no path', '경상도_영화_2_바람_와이라노', '와이라노', NOW(), false),
--                                                                                                                    (10, 'no path', '경상도_영화_3_범죄와의전쟁_나도 가오가 있다 아이가', '나도 가오가 있다아이가', NOW(), false),
--                                                                                                                    (10, 'no path', '경상도_영화_4_범죄와의전쟁_이제 곧 추석인데, 니 동생 고향집에 굴비 세트라도 하나 사가게 내 용돈 좀 챙겨주이소', '이제 곧 추석인데 이 동생 고향집에 굴비세트라도 하나 사가게 내 용돈좀 챙겨주이소', NOW(), false),
--                                                                                                                    (10, 'no path', '경상도_영화_5_변호인_아이고 뭐 저 주시라도 드실랍니까', '아이고 뭐 저 주시라도 드실랍니까', NOW(), false),
--                                                                                                                    (11, 'no path', '경상도_영화_6_변호인_이 집을 꼭 사야하는 뭔 사연이라도 있는갑지예', '이 집을 꼭 사야하는 뭔 사연이라도 있는갑지예', NOW(), false),
--                                                                                                                    (11, 'no path', '경상도_영화_7_짱구오늘첫날이재', '짱구 오늘 첫 날이제', NOW(), false),
--                                                                                                                    (11, 'no path', '경상도_영화_8_임마는학술적으로도분석이', '임마는 학술적으로도 분석이 안된단다', NOW(), false),
--                                                                                                                    (11, 'no path', '경상도_영화_9_그게다내탓이가', '그게 다 내탓이가', NOW(), false),
--                                                                                                                    (11, 'no path', '경상도_영화_10_맞나아이가', '맞나아이가', NOW(), false),
--                                                                                                                    (12, 'no path', '경상도_영화_11_범인은도사가잡형잡', '범인은 도사가 잡는게 아이고 형사가 잡는기다', NOW(), false),
--                                                                                                                    (12, 'no path', '경상도_영화_12_사람사는게뭐별일있습니까', '사람 사는게 뭐 별일 있습니까', NOW(), false),
--                                                                                                                    (12, 'no path', '경상도_영화_13_잔돈 때문에 그런거면', '잔돈 때문에 그런거면 자자자 아나 가져가소', NOW(), false),
--                                                                                                                    (12, 'no path', '경상도_영화_14_그 가시나 니 형사인거 모르나', '그 가시나 니 저저 형산거 모르나', NOW(), false),
--                                                                                                                    (12, 'no path', '경상도_영화_15_부잣집 아줌마들 꼬시가꼬', '전시내 거 부잣집 아줌마들 꼬시갖고 사부작 사부작 댕기면서 맛있는거 얻어묵고', NOW(), false),
--                                                                                                                    (13, 'no path', '경상도_영화_16_내도 급하다', '봐라 니 빌려간 그 간장 쫑바리 내놔라 내도 급하다', NOW(), false),
--                                                                                                                    (13, 'no path', '경상도_영화_17_여자들은 이게 문젠기라', '여자들은 이게 문젠기라 응', NOW(), false),
--                                                                                                                    (13, 'no path', '경상도_영화_18_승만이가 니한테는 형님아이가', '승만이가 니한테는 형님아이가', NOW(), false),
--                                                                                                                    (13, 'no path', '경상도_영화_19_아따 마 집구석 잘 돌아간다', '아따 마 집구석 잘 돌아간다', NOW(), false),
--                                                                                                                    (13, 'no path', '경상도_영화_20_니 같으면 너거 아한테', '니 같으면 너거 아한테 저런거 사주겄나', NOW(), false);

-- /*레슨_경상도_밈, 일상*/
-- INSERT INTO lesson (lesson_group_id, sample_voice_path, sample_voice_name, script, last_update_dt, is_deleted) VALUES
--                                                                                                                    (19, 'no path', '경상도_밈_1_가가가가', '어 가가가가', NOW(), false),
--                                                                                                                    (19, 'no path', '경상도_밈_2_블루베리스무디', '블루베리스무디', NOW(), false),
--                                                                                                                    (19, 'no path', '경상도_밈_3_어느정도높이까지올라가는거에요', '어느정도높이까지올라가는거예요', NOW(), false),
--                                                                                                                    (19, 'no path', '경상도_밈_4_어어어', '어어어 아인데', NOW(), false),
--                                                                                                                    (19, 'no path', '경상도_밈_5_이에이승', '이에이승 이에이승 이에이승 이에이승', NOW(), false),

--                                                                                                                    (28, 'no path', '경상도_일상_1_사장님주문좀할게요', '사장님 주문 좀 할게요', NOW(), false),
--                                                                                                                    (28, 'no path', '경상도_일상_2_아이스아메리카노한잔주세요', '아이스 아메리카노 한 잔 주세요', NOW(), false),
--                                                                                                                    (28, 'no path', '경상도_일상_3_반월당역갈라면어떻게가야합니까', '반월당역 갈라면 어떻게 가야합니까', NOW(), false),
--                                                                                                                    (28, 'no path', '경상도_일상_4_반갑다친구야오랜만이네', '반갑다 친구야 오랜만이네', NOW(), false),
--                                                                                                                    (28, 'no path', '경상도_일상_5_아내지금진짜배고프다', '아 내 지금 진짜 배고프다', NOW(), false);

-- /*퀴즈 등록*/
-- INSERT INTO quiz (location_id, question, is_objective, creation_dt) VALUES
--                                                                         (1, '대기 중 대화용', false, NOW()),
--                                                                         (2, '만다꼬 그라노에서 ''만다꼬''의 뜻으로 알맞은 것은?', true, NOW()),
--                                                                         (2, '애비다 의 뜻으로 알맞은 것은?', true, NOW()),
--                                                                         (2, '어디까지올라가는거에요의 음정으로 알맞은 것은?', true, NOW()),
--                                                                         (2, '다음 중 ''어어어 그 옷 파이다'' 에서 ''파이다''의 뜻을 잘 해석한 것은?', true, NOW()),
--                                                                         (2, '다음 중 경상도 사투리가 아닌 것은?', true, NOW()),
--                                                                         (2, '쪼매의 뜻은?', false, NOW()),
--                                                                         (2, '퍼뜩의 뜻은?', false, NOW()),
--                                                                         (2, '표준어 ''그만''을 경상도 사투리로 바꾸면?', false, NOW()),
--                                                                         (2, '고닥꾜솩쌔미의 뜻은?', false, NOW()),
--                                                                         (2, '디비라의 뜻은?', false, NOW());

-- INSERT INTO quiz_choice (is_answer, choice_id, quiz_id, content) VALUES
--                                                                      (false, 1, 2, '가만 두라고'),(true, 1, 3, '야위다'),(true, 1, 4, '도레미파솔라시도레미레'),(false, 1, 5, '파였다'),(false, 1, 6, '정구지'),
--                                                                      (true, 1, 7, '조금'),(true, 1, 8, '빨리'),(true, 1, 9, '고마'),(true, 1, 10, '고등학교 수학 선생님이'),(true, 1, 11, '뒤집어라'),
--                                                                      (true, 2, 2, '뭐 한다고'),(false, 2, 3, '아프다'),(false, 2, 4, '도레미파솔라시도레미파'),(true, 2, 5, '별로다'),(false, 2, 6, '단디'),
--                                                                      (false, 3, 2, '그만 두라고'),(false, 3, 3, '예쁘다'),(false, 3, 4, '레미레도시라솔파미레도'),(false, 3, 5, 'Pie다'),(true, 3, 6, '솔'),
--                                                                      (false, 4, 2, '많다고'),(false, 4, 3, 'Im your father'),(false, 4, 4, '도레미파솔라시도시도레'),(false, 4, 5, 'π'),(false, 4, 6, '잠온다');

-- /* 학습 결과 데이터 */
-- /* 대쉬보드 용 */
-- /* 레슨 그룹 결과 */
-- INSERT INTO lesson_group_result (is_completed,avg_accuracy,avg_similarity,end_dt,lesson_group_id,start_dt,user_id) VALUES
--                                                                                                                        (0,88,77,null,12,date_sub(now(), interval 179 day), 32),
--                                                                                                                        (0,88,77,null,11,date_sub(now(), interval 179 day), 32),
--                                                                                                                        (1,88,77,now(),10,date_sub(now(), interval 179 day), 32),

--                                                                                                                        (1,88,77,now(),1,date_sub(now(), interval 179 day), 33),
--                                                                                                                        (1,88,77,date_sub(now(), interval 1 day),2,date_sub(now(), interval 179 day), 33),
--                                                                                                                        (1,88,77,date_sub(now(), interval 5 day),3,date_sub(now(), interval 179 day), 33),
--                                                                                                                        (1,88,77,date_sub(now(), interval 9 day),4,date_sub(now(), interval 179 day), 33),
--                                                                                                                        (1,88,77,date_sub(now(), interval 12 day),5,date_sub(now(), interval 179 day), 33),
--                                                                                                                        (1,88,77,date_sub(now(), interval 17 day),6,date_sub(now(), interval 179 day), 33),
--                                                                                                                        (1,88,77,date_sub(now(), interval 21 day),7,date_sub(now(), interval 179 day), 33),
--                                                                                                                        (1,88,77,date_sub(now(), interval 26 day),8,date_sub(now(), interval 179 day), 33),
--                                                                                                                        (1,88,77,date_sub(now(), interval 31 day),9,date_sub(now(), interval 179 day), 33);

-- /* 개별 레슨 결과 */
-- INSERT INTO lesson_result (is_skipped, accent_similarity, lesson_dt, lesson_group_result_id, lesson_id, pronunciation_accuracy) VALUES
--                                                                                                                                     (false, 77, now(), 3, 46, 88), (false, 77, date_sub(now(), interval 1 day), 3, 47, 88), (false, 77, date_sub(now(), interval 2 day), 3, 48, 88), (false, 77, date_sub(now(), interval 3 day), 3, 49, 88), (false, 77, date_sub(now(), interval 4 day), 3, 50, 88),
--                                                                                                                                     (false, 77, date_sub(now(), interval 5 day), 2, 51, 88), (false, 77, date_sub(now(), interval 6 day), 2, 52, 88), (true, null, date_sub(now(), interval 6 day), 2, 53, null), (true, null, date_sub(now(), interval 6 day), 2, 54, null), (true, null, date_sub(now(), interval 6 day), 2, 55, null),
--                                                                                                                                     (false, 77, date_sub(now(), interval 7 day), 1, 56, 88), (false, 77, date_sub(now(), interval 8 day), 1, 57, 88),

--                                                                                                                                     (false, 77, now(), 4, 1, 88), (false, 77, now(), 4, 2, 88), (false, 77, now(), 4, 3, 88), (false, 77, now(), 4, 4, 88), (false, 77, now(), 4, 5, 88),
--                                                                                                                                     (false, 77, date_sub(now(), interval 1 day), 5, 6, 88), (false, 77, date_sub(now(), interval 2 day), 5, 7, 88), (false, 77, date_sub(now(), interval 2 day), 5, 8, 88), (false, 77, date_sub(now(), interval 3 day), 5, 9, 88), (false, 77, date_sub(now(), interval 4 day), 5, 10, 88),
--                                                                                                                                     (false, 77, date_sub(now(), interval 5 day), 6, 11, 88), (false, 77, date_sub(now(), interval 5 day), 6, 12, 88), (false, 77, date_sub(now(), interval 6 day), 6, 13, 88), (false, 77, date_sub(now(), interval 7 day), 6, 14, 88), (false, 77, date_sub(now(), interval 8 day), 6, 15, 88),
--                                                                                                                                     (false, 77, date_sub(now(), interval 9 day), 7, 16, 88), (false, 77, date_sub(now(), interval 9 day), 7, 17, 88), (false, 77, date_sub(now(), interval 9 day), 7, 18, 88), (false, 77, date_sub(now(), interval 10 day), 7, 19, 88), (false, 77, date_sub(now(), interval 11 day), 7, 20, 88),
--                                                                                                                                     (false, 77, date_sub(now(), interval 12 day), 8, 21, 88), (false, 77, date_sub(now(), interval 13 day), 8, 22, 88), (false, 77, date_sub(now(), interval 14 day), 8, 23, 88), (false, 77, date_sub(now(), interval 15 day), 8, 24, 88), (false, 77, date_sub(now(), interval 16 day), 8, 25, 88),
--                                                                                                                                     (false, 77, date_sub(now(), interval 17 day), 9, 26, 88), (false, 77, date_sub(now(), interval 18 day), 9, 27, 88), (false, 77, date_sub(now(), interval 18 day), 9, 28, 88), (false, 77, date_sub(now(), interval 19 day), 9, 29, 88), (false, 77, date_sub(now(), interval 20 day), 9, 30, 88),
--                                                                                                                                     (false, 77, date_sub(now(), interval 21 day), 10, 31, 88), (false, 77, date_sub(now(), interval 22 day), 10, 32, 88), (false, 77, date_sub(now(), interval 23 day), 10, 33, 88), (false, 77, date_sub(now(), interval 24 day), 10, 34, 88), (false, 77, date_sub(now(), interval 25 day), 10, 35, 88),
--                                                                                                                                     (false, 77, date_sub(now(), interval 26 day), 11, 36, 88), (false, 77, date_sub(now(), interval 27 day), 11, 37, 88), (false, 77, date_sub(now(), interval 28 day), 11, 38, 88), (false, 77, date_sub(now(), interval 29 day), 11, 39, 88), (false, 77, date_sub(now(), interval 30 day), 11, 40, 88),
--                                                                                                                                     (false, 77, date_sub(now(), interval 31 day), 12, 41, 88), (false, 77, date_sub(now(), interval 32 day), 12, 42, 88), (false, 77, date_sub(now(), interval 33 day), 12, 43, 88), (false, 77, date_sub(now(), interval 34 day), 12, 44, 88), (false, 77, date_sub(now(), interval 34 day), 12, 45, 88);

-- INSERT INTO lesson_record_file (lesson_result_id, user_voice_file_name, user_voice_file_path, user_voice_script) VALUES
--                                                                                                                      (1, 'file_sample.wav', 'no path', '보며안되니'), (2, 'file_sample.wav', 'no path', '왜이래'), (3, 'file_sample.wav', 'no path', '나도가호가있잖니'), (4, 'file_sample.wav', 'no path', '이제곧추석이네'), (5, 'file_sample.wav', 'no path', '쥬스마셔야지'),
--                                                                                                                      (6, 'file_sample.wav', 'no path', '사연있나'), (7, 'file_sample.wav', 'no path', '장구오늘첫날이니'), (11, 'file_sample.wav', 'no path', '사연있나'), (12, 'file_sample.wav', 'no path', '사연있나'),

--                                                                                                                      (13, 'file_sample.wav', 'no path', '가시내운동하나도안했니'), (14, 'file_sample.wav', 'no path', '그거 내만 안되는거 아니거든'), (15, 'file_sample.wav', 'no path', '그거 하나 몬해주나'), (16, 'file_sample.wav', 'no path', '그런거 아이다'),
--                                                                                                                      (17, 'file_sample.wav', 'no path', '난 당신이 싫습니다'), (18, 'file_sample.wav', 'no path', '난 당신이 좋습니다'), (19, 'file_sample.wav', 'no path', '니같은 금수한테 뮤지컬이 웬말이고'), (20, 'file_sample.wav', 'no path', '니하고 아무 상관없다'),
--                                                                                                                      (21, 'file_sample.wav', 'no path', '떡볶이나 쳐먹자'), (22, 'file_sample.wav', 'no path', '장구오늘첫날이니'), (23, 'file_sample.wav', 'no path', '사연있나'), (24, 'file_sample.wav', 'no path', '사연있나'),
--                                                                                                                      (25, 'file_sample.wav', 'no path', '사연있나'), (26, 'file_sample.wav', 'no path', '장구오늘첫날이니'), (27, 'file_sample.wav', 'no path', '사연있나'), (28, 'file_sample.wav', 'no path', '사연있나'),
--                                                                                                                      (29, 'file_sample.wav', 'no path', '사연있나'), (30, 'file_sample.wav', 'no path', '장구오늘첫날이니'), (31, 'file_sample.wav', 'no path', '사연있나'), (32, 'file_sample.wav', 'no path', '사연있나'),
--                                                                                                                      (33, 'file_sample.wav', 'no path', '사연있나'), (34, 'file_sample.wav', 'no path', '장구오늘첫날이니'), (35, 'file_sample.wav', 'no path', '사연있나'), (36, 'file_sample.wav', 'no path', '사연있나'),
--                                                                                                                      (37, 'file_sample.wav', 'no path', '사연있나'), (38, 'file_sample.wav', 'no path', '장구오늘첫날이니'), (39, 'file_sample.wav', 'no path', '사연있나'), (40, 'file_sample.wav', 'no path', '사연있나'),
--                                                                                                                      (41, 'file_sample.wav', 'no path', '사연있나'), (42, 'file_sample.wav', 'no path', '장구오늘첫날이니'), (43, 'file_sample.wav', 'no path', '사연있나'), (44, 'file_sample.wav', 'no path', '사연있나'),
--                                                                                                                      (45, 'file_sample.wav', 'no path', '사연있나'), (46, 'file_sample.wav', 'no path', '장구오늘첫날이니'), (47, 'file_sample.wav', 'no path', '사연있나'), (48, 'file_sample.wav', 'no path', '사연있나'),
--                                                                                                                      (49, 'file_sample.wav', 'no path', '사연있나'), (50, 'file_sample.wav', 'no path', '장구오늘첫날이니'), (51, 'file_sample.wav', 'no path', '사연있나'), (52, 'file_sample.wav', 'no path', '사연있나'),
--                                                                                                                      (53, 'file_sample.wav', 'no path', '사연있나'), (54, 'file_sample.wav', 'no path', '장구오늘첫날이니'), (55, 'file_sample.wav', 'no path', '사연있나'), (56, 'file_sample.wav', 'no path', '사연있나'),
--                                                                                                                      (57, 'file_sample.wav', 'no path', '사연있나');


-- INSERT INTO lesson_record_graph (lesson_result_id, graph_x, graph_y) VALUES
--                                                                        (1, '[x]', '[y]'), (2, '[x]', '[y]'), (3, '[x]', '[y]'), (4, '[x]', '[y]'), (5, '[x]', '[y]'), (6, '[x]', '[y]'), (7, '[x]', '[y]'), (11, '[x]', '[y]'), (12, '[x]', '[y]'),

--                                                                        (13, '[x]', '[y]'), (14, '[x]', '[y]'), (15, '[x]', '[y]'), (16, '[x]', '[y]'), (17, '[x]', '[y]'), (18, '[x]', '[y]'), (19, '[x]', '[y]'), (20, '[x]', '[y]'), (21, '[x]', '[y]'),
--                                                                        (22, '[x]', '[y]'), (23, '[x]', '[y]'), (24, '[x]', '[y]'), (25, '[x]', '[y]'), (26, '[x]', '[y]'), (27, '[x]', '[y]'), (28, '[x]', '[y]'), (29, '[x]', '[y]'), (30, '[x]', '[y]'),
--                                                                        (31, '[x]', '[y]'), (32, '[x]', '[y]'), (33, '[x]', '[y]'), (34, '[x]', '[y]'), (35, '[x]', '[y]'), (36, '[x]', '[y]'), (37, '[x]', '[y]'), (38, '[x]', '[y]'), (39, '[x]', '[y]'),
--                                                                        (40, '[x]', '[y]'), (41, '[x]', '[y]'), (42, '[x]', '[y]'), (43, '[x]', '[y]'), (44, '[x]', '[y]'), (45, '[x]', '[y]'), (46, '[x]', '[y]'), (47, '[x]', '[y]'), (48, '[x]', '[y]'),
--                                                                        (49, '[x]', '[y]'), (50, '[x]', '[y]'), (51, '[x]', '[y]'), (52, '[x]', '[y]'), (53, '[x]', '[y]'), (54, '[x]', '[y]'), (55, '[x]', '[y]'), (56, '[x]', '[y]'), (57, '[x]', '[y]');

-- /* 레슨 신고 기록 */
-- INSERT INTO lesson_claim (claim_dt, lesson_id, user_id, content) VALUES
--                                                                      (date_sub(now(), interval 5 day), 13, 5, '문제가 너무 길어요'),(date_sub(now(), interval 4 day), 13, 7, '문제가 너무 무서워요'),(date_sub(now(), interval 7 day), 13, 9, 'so hard'),
--                                                                      (date_sub(now(), interval 3 day), 13, 2, '개어렵네요'),(date_sub(now(), interval 1 day), 13, 14, '문제 좀 바꿔라 에휴'),(date_sub(now(), interval 1 day), 20, 4, '너무 짧아서 음성인식이 안돼요'),
--                                                                      (date_sub(now(), interval 2 day), 20, 6, '뭐라하는지 모르겠습니다'),(date_sub(now(), interval 3 day), 20, 8, '뭘 모르는데'),(date_sub(now(), interval 7 day), 28, 3, '사람이 왜 두명입니까'),
--                                                                      (date_sub(now(), interval 11 day), 28, 15, '저는 조용히 하고싶은데요'),(date_sub(now(), interval 5 day), 28, 6, '별로'),(date_sub(now(), interval 2 day), 49, 3, '너무 길다고요'),
--                                                                      (date_sub(now(), interval 5 day), 49, 2, '문제 차이가 너무 심한데'),(date_sub(now(), interval 6 day), 69, 3, '녹음하신분 목소리가 킹받아요'),(date_sub(now(), interval 1 day), 69, 16, '아 열받네요'),
--                                                                      (date_sub(now(), interval 1 day), 69, 13, '킹받네'),(date_sub(now(), interval 1 day), 73, 21, '발음이 너무 안좋은데요');

-- /* 지역별 레슨 평균 유사도/정확도 통계를 위한 레슨 그룹 결과 */
-- INSERT INTO lesson_group_result (is_completed,avg_accuracy,avg_similarity,end_dt,lesson_group_id,start_dt,user_id) VALUES
--                                                                                                                        (1,87,79,date_sub(now(), interval 1 day),37,date_sub(now(), interval 179 day), 34),
--                                                                                                                        (1,85,81,date_sub(now(), interval 1 day),57,date_sub(now(), interval 179 day), 34),
--                                                                                                                        (1,83,77,date_sub(now(), interval 1 day),59,date_sub(now(), interval 179 day), 34),
--                                                                                                                        (1,81,82,date_sub(now(), interval 1 day),61,date_sub(now(), interval 179 day), 34),
--                                                                                                                        (1,79,74,date_sub(now(), interval 1 day),63,date_sub(now(), interval 179 day), 34);






