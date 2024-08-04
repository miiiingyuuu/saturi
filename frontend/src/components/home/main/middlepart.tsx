import "../../../styles/home/main/background.css";
import { MiddlePartProps } from "@/utils/props";
import { Box, Typography } from "@mui/material";

export default function MiddlePart({ middlePosition, mainPageIndicator }: MiddlePartProps) {
  return (
    <Box 
      className="middlepart" 
      style={{
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
      <Box className="area">
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

      </Box>
      <Typography 
        variant = "h1"
        className="blink" 
        style={{
          position: 'absolute',
          top: '75%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: 25,
        }}> {mainPageIndicator} </Typography>
    </Box>
  );
}
