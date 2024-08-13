import "../../../styles/home/main/background.css";
import { MiddlePartProps } from "@/utils/props";
import { Box, Typography } from "@mui/material";

export default function MiddlePart({ middlePosition, mainPageIndicator }: MiddlePartProps) {
  return (
    <Box 
      className="middlepart" 
      style={{        
        backgroundColor:"#f3f4f6",
        backgroundImage: "url(/MainPage/mainBackground.png)",
        backgroundSize: "auto 100%",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
        left: (() => {
          if (middlePosition === 0) {
            return "-110%";
          } if (middlePosition === 1) {
            return "0%";
          } if (middlePosition === 2) {
            return "110%";
          } return "0%";              
        })()
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
      <Box>
        <Typography 
          variant = "h1"
          className="blink" 
          style={{
            backgroundColor:"blue",
            position: 'absolute',
            top: '10%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textShadow: "2px 2px 0px black",
            fontSize: 25,
            fontWeight: "bold",
            color:"white",
        }}> {mainPageIndicator} </Typography>
      </Box>
    </Box>
  );
}
