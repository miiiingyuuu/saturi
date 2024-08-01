export default function ProfileCard() {
  return <div>ㅎㅎㅈㅅ</div>
}

// // app/profile/page.tsx
// "use client";

// import React from "react";
// import Link from "next/link";
// import { Card, CardHeader, CardContent, CardActions, Divider, Avatar, Button, Table, TableHead, TableBody, TableRow, TableCell, LinearProgress, Typography } from "@mui/material";
// import { FaCrown, FaFire } from "react-icons/fa";

// export default function ProfileCard() {
//   return (
//     <div>
//       {/* 프로필 */}
//       <div className="flex justify-center items-center bg-gray-100">
//         <Card style={{ width: '900px', marginTop: '50px' }}>
//           <CardHeader
//             avatar={
//               <Avatar
//                 alt="profile image"
//                 src="https://via.placeholder.com/150"
//                 sx={{ width: 150, height: 150 }}
//               />
//             }
//             title={
//               <div>
//                 <Typography variant="h6">응애에요</Typography>
//                 <Typography variant="body2" color="textSecondary">email@gmail.com</Typography>
//               </div>
//             }
//           />
//           <Divider />
//           <CardContent>
//             <Typography variant="subtitle1">사용하는 사투리</Typography>
//             <Typography variant="body2" color="textSecondary">경상도 사투리</Typography>
//             <Divider sx={{ my: 2 }} />
//             <Typography variant="subtitle1">성별</Typography>
//             <Typography variant="body2" color="textSecondary">남성</Typography>
//             <Divider sx={{ my: 2 }} />
//             <Typography variant="subtitle1">연령대</Typography>
//             <Typography variant="body2" color="textSecondary">20대-30대</Typography>
//           </CardContent>
//           <CardActions>
//             <Link href="/user/profile/update" passHref>
//               <Button color="primary">프로필 수정</Button>
//             </Link>
//           </CardActions>
//         </Card>
//       </div>

//       {/* 대쉬보드 */}
//       <div className="flex justify-center items-center bg-gray-100 h-screen">
//         <Card style={{ width: '900px', marginTop: '20px' }}>
//           <CardHeader
//             title={<Typography variant="h5" component="div">학습 대시보드</Typography>}
//           />
//           <CardContent>
//             <div className="gap-4 grid grid-cols-1 sm:grid-cols-12">
//               {/* 전체 19위 섹션 */}
//               <div className="col-span-1 sm:col-span-4" style={{ backgroundColor: '#a4508b', borderRadius: '8px', padding: '16px', color: 'white' }}>
//                 <div className="flex items-center gap-2 mb-2">
//                   <FaCrown color="gold" />
//                   <Typography variant="h6" component="p">전체 19위</Typography>
//                 </div>
//                 <LinearProgress variant="determinate" value={59.01} color="secondary" />
//                 <Typography variant="body2" component="p" sx={{ mt: 2 }}>59.01%</Typography>
//                 <Typography variant="body2" component="p">4일째 접속중!</Typography>
//               </div>

//               {/* 최근 푼 문제 섹션 */}
//               <div className="col-span-1 sm:col-span-8" style={{ backgroundColor: '#11998e', borderRadius: '8px', padding: '16px', color: 'white' }}>
//                 <Typography variant="h6" component="h4" sx={{ mb: 2 }}>최근 푼 문제</Typography>
//                 <div className="flex items-center gap-4">
//                   <Avatar>GO</Avatar>
//                   <div>
//                     <Typography variant="body2" component="p">경상도 사투리 - 휘미</Typography>
//                     <LinearProgress variant="determinate" value={75.93} color="success" />
//                     <Typography variant="body2" component="p" sx={{ mt: 1 }}>평균 정확도: 75.93%</Typography>
//                   </div>
//                 </div>
//               </div>

//               {/* 주간 학습 섹션 */}
//               <div className="col-span-1 sm:col-span-12" style={{ backgroundColor: '#fc4a1a', borderRadius: '8px', padding: '16px', color: 'white' }}>
//                 <Typography variant="h6" component="h4" sx={{ mb: 2 }}>주간 학습</Typography>
//                 <div className="flex gap-2 flex-wrap">
//                   {['월', '화', '수', '목', '금', '토', '일'].map((day, index) => (
//                     <Button key={day} color={index < 4 ? "error" : "default"} variant="contained" size="small">
//                       {day}
//                       {index < 4 && <FaFire className="ml-1" />}
//                     </Button>
//                   ))}
//                 </div>
//               </div>

//               {/* 연간 학습 섹션 */}
//               <div className="col-span-1 sm:col-span-12" style={{ backgroundColor: '#0575e6', borderRadius: '8px', padding: '16px', color: 'white' }}>
//                 <Typography variant="h6" component="h4" sx={{ mb: 2 }}>연간 학습</Typography>
//                 <Table sx={{ color: 'white' }}>
//                   <TableHead>
//                     <TableRow>
//                       <TableCell>Jan</TableCell>
//                       <TableCell>Feb</TableCell>
//                       {/* ... 나머지 월 */}
//                     </TableRow>
//                   </TableHead>
//                   <TableBody>
//                     <TableRow>
//                       <TableCell>{/* Jan 1주차 데이터 */}</TableCell>
//                       <TableCell>{/* Feb 1주차 데이터 */}</TableCell>
//                       {/* ... 나머지 월 */}
//                     </TableRow>
//                     {/* ... 나머지 주차 */}
//                   </TableBody>
//                 </Table>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
