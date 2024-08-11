import "../../../styles/home/main/background.css";
import { MiddlePartProps } from "@/utils/props";
import { Box, Typography } from "@mui/material";

export default function MiddlePart({ middlePosition, mainPageIndicator }: MiddlePartProps) {
  return (
    <Box 
      className="middlepart" 
      style={{
        backgroundImage: "url(/MainPage/mainBackground2.jpeg)",
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
      
      <Typography 
        variant = "h1"
        className="blink" 
        style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textShadow: "1px 1px 0px whitesmoke",
          fontSize: 25,
          fontWeight: "bold",
        }}> {mainPageIndicator} </Typography>
    </Box>
  );
}
