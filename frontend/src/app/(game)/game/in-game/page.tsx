export default function App() {
  return <div>ㅎㅎㅈㅅ</div>
}

// "use client";

// import React, { useState } from 'react';
// import { MessagesProps } from "@/utils/props";
// import SendIcon from '@mui/icons-material/Send';
// import { handleValueChange } from "@/utils/utils";
// import {
//   Box,
//   TextField,
//   Button,
//   List,
//   ListItem,
//   ListItemText,
//   Paper,
//   Typography,
//   Card,
//   LinearProgress
// } from '@mui/material';

// export default function ChatApp() {
//   const [messages, setMessages] = useState<MessagesProps[]>([]);
//   const [message, setMessage] = useState('');



//   return (
//     <Box>
//       <Box
//         sx = {{
//           display: "grid",
//           placeItems: "center",
//           marginBottom: "150px",
//         }}>
//         <Typography
//           sx={{
//             fontSize: "39px",
//             fontWeight: "bold",
//           }}
//         >
//           주관식 퀴즈
//         </Typography>
//         <Typography>
//           정구지의 표준말은?
//         </Typography>
//       </Box>

//       <Box
//         sx = {{
//           display: "grid",
//           placeItems: "center",
//         }}>
//         <Box
//           sx = {{
//             display: "flex",
//             justifyContent: "space-between",
//             width: "1100px",
//           }}
//         >
//           <Card sx={{width: "200px", height: "300px"}}> 플레이어 </Card>
//           <Card sx={{width: "200px", height: "300px"}}> 플레이어 </Card>
//           <Card sx={{width: "200px", height: "300px"}}> 플레이어 </Card>
//           <Card sx={{width: "200px", height: "300px"}}> 플레이어 </Card>
//           <Card sx={{width: "200px", height: "300px"}}> 플레이어 </Card>
//         </Box>
//       </Box>
      



//       <Box
//         sx={{
//           display: 'flex',
//           flexDirection: 'column',
//           height: '100vh',
//           p: 2,
//           backgroundColor: '#f5f5f5',
//         }}
//       >
//         <Paper
//           sx={{
//             flex: 1,
//             p: 2,
//             overflowY: 'auto',
//             mb: 2,
//           }}
//         >
//           <Typography variant="h6" gutterBottom>
//             Chat
//           </Typography>

//           <List>
//             {messages.map((message, index) => (
//               <ListItem key={index}>
//                 <ListItemText primary={message} />
//               </ListItem>
//             ))}
//           </List>
//         </Paper>
//         <Box sx={{ display: 'flex' }}>
//           <TextField
//             variant="outlined"
//             fullWidth
//             value={message}
//             onChange={event => handleValueChange(event, setMessage)}
//             placeholder="Type your message..."
//           />
//           <Button
//             variant="contained"
//             color="primary"
//             endIcon={<SendIcon />}
//             // onClick={}
//             sx={{ ml: 1 }}
//           >
//             Send
//           </Button>
//         </Box>
//       </Box>

//       <Box
//         sx={{
//           display: "grid",
//           placeItems: "center",
//           margin: "10px",
//         }}>
//         <Card
//           sx = {{
//             width: "200px",
//             height: "350px",
//           }}>
//           <Card sx={{margin: "10px"}}>
//             <Typography> 당신은 1등입니다! </Typography>
//           </Card>
//           <LinearProgress variant="determinate" value={20} />
//           <br/>
//           <LinearProgress variant="determinate" value={20} />
//           <br/>
//           <LinearProgress variant="determinate" value={50} />
//           <br/>
//           <LinearProgress variant="determinate" value={20} />
//           <br/>
//           <LinearProgress variant="determinate" value={35} />
//           <br/>
//           <hr/>
//           플레이타임: 
//         </Card>
//         <Button variant="contained" sx={{ marginTop: "10px" }}>
//           다음
//         </Button>
//       </Box>
//     </Box>
//   );
// };