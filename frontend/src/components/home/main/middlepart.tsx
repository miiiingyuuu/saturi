import "../../../styles/home/main/background.css";
import { MiddlePartProps } from "@/utils/props";
import { Box, Card, Typography } from "@mui/material";

export default function MiddlePart({ middlePosition, mainPageIndicator }: MiddlePartProps) {
  return (
    <Box 
      className="middlepart" 
      style={{        
        backgroundImage: "url(/MainPage/mainBackground2.png)",
        backgroundSize: "auto 100%",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
      }}>
      
      {/* 배경 엘리먼트 */}
      {/* <Box className="area">
        <ul className="circles">
          <li/>
          <li/>
          <li/>
          <li/>
          <li/>
          <li/>
          <li/>
          <li/>
          <li/>
          <li/>
        </ul>
      </Box> */}
      <Card 
        className="blink" 
        style={{
          position: 'absolute',          
          transform: 'translate(-50%, -50%)',
          top: '10%',
          left: '50%',
          padding:"10px",
          border:"3px solid lightgray",
          borderRadius:"15px",
        }}
      >
        <Typography 
          variant = "h1"          
          style={{
            // backgroundColor:"blue",            
            textShadow: "2px 2px 0px white",
            fontSize: 25,
            fontWeight: "bold",
        }}> {mainPageIndicator} </Typography>
      </Card>
    </Box>
  );
}
