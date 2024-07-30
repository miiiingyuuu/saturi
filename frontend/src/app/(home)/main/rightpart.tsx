import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';

interface RightPartProps {}

export default function RightPart({}: RightPartProps) {
    const router = useRouter();
  
    function GameStartButton() {
      console.log("hey");
      router.push("/game");
    }
  
    return (
      <div className="rightpart" style={{ height: '100vh' }}>
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
      </div>
    );
  }