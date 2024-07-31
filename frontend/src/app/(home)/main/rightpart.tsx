import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';

interface RightPartProps {}

export default function RightPart({}: RightPartProps) {
    const router = useRouter();
  
    function GameStartButton() {
      console.log("hey");
      router.push("/game");
    }
  
    return (
      <div className="rightpart" style={{ height: '100vh' }}>
        {/* <div className="rightpart" style={{ height: '100vh' }}>
          <div style={{ position: 'absolute', margin: "50px", top: "10%", right: "220px", display: 'flex' }}>
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
        </div> */}

        <Box sx={{ position: 'absolute', margin: "25px", top: "7%", right: "70px", width: "25vw" }}>
          <Typography variant="h1" sx={{ fontSize: 30, fontWeight: "bold" }}>게임 페이지</Typography>
          <br />
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
            <img src="/MainPage/buttonFood.png" alt="" />            
          </Box>
          <Button variant="contained" onClick={GameStartButton} style={{ marginTop: '20px' }}>게임 시작</Button>
        </Box>
        

      </div>
      






    );
  }