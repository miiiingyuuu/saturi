import { Box, Popover, Typography } from "@mui/material";
import React, { useState, useRef } from "react";

interface JigsawProps {
  dataGroup: {
    lessonGroupId: number;
    lessonGroupName: string;
    groupProgress: number;
    avgAccuracy: number;
    }[];
}


const Icon: React.FC<JigsawProps> = ({ dataGroup }) => {

  // 클릭 시 변동되는 State
  const [isClicked1, setIsClicked1] = useState(false);
  const [isClicked2, setIsClicked2] = useState(false);
  const [isClicked3, setIsClicked3] = useState(false);
  const [isClicked4, setIsClicked4] = useState(false);
  const [isClicked5, setIsClicked5] = useState(false);
  const [isClicked6, setIsClicked6] = useState(false);
  const [isClicked7, setIsClicked7] = useState(false);
  const [isClicked8, setIsClicked8] = useState(false);
  const [isClicked9, setIsClicked9] = useState(false);

  // 각 path의 중심 좌표 설정
  const transformOriginX1 = 100; 
  const transformOriginY1 = 150; 
  const transformOriginX2 = 400;
  const transformOriginY2 = 150;
  const transformOriginX3 = 900;
  const transformOriginY3 = 150;
  const transformOriginX4 = 100;
  const transformOriginY4 = 600;
  const transformOriginX5 = 400;
  const transformOriginY5 = 450;
  const transformOriginX6 = 900;
  const transformOriginY6 = 600;
  const transformOriginX7 = 100;
  const transformOriginY7 = 900;
  const transformOriginX8 = 400;
  const transformOriginY8 = 900;
  const transformOriginX9 = 900;
  const transformOriginY9 = 900;

  // 버튼 클릭 시 사용되는 function
  // function jigsawClick (e : any) {
  //     e.preventDefault();
  //     console.log("for test");
  // }
  // Popover 부분
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const selectedIndex = useRef(0);
  var index = 0;
  const open = Boolean(anchorEl);

  const jigsawClick1 = (event: React.MouseEvent<HTMLElement>) => {
    selectedIndex.current = 0;
    setAnchorEl(event.currentTarget);
    console.log(dataGroup)    
  };
  const jigsawClick2 = (event: React.MouseEvent<HTMLElement>) => {
    selectedIndex.current = 1;
    setAnchorEl(event.currentTarget);
    console.log(dataGroup)    
  };
  const jigsawClick3 = (event: React.MouseEvent<HTMLElement>) => {
    selectedIndex.current = 2;
    setAnchorEl(event.currentTarget);
    console.log(dataGroup)    
  };
  const jigsawClick4 = (event: React.MouseEvent<HTMLElement>) => {
    selectedIndex.current = 3;
    setAnchorEl(event.currentTarget);
    console.log(dataGroup)    
  };
  const jigsawClick5 = (event: React.MouseEvent<HTMLElement>) => {
    selectedIndex.current = 4;
    setAnchorEl(event.currentTarget);
    console.log(dataGroup)    
  };
  const jigsawClick6 = (event: React.MouseEvent<HTMLElement>) => {
    selectedIndex.current = 5;
    setAnchorEl(event.currentTarget);
    console.log(dataGroup)    
  };
  const jigsawClick7 = (event: React.MouseEvent<HTMLElement>) => {
    selectedIndex.current = 6;
    setAnchorEl(event.currentTarget);
    console.log(dataGroup)    
  };
  const jigsawClick8 = (event: React.MouseEvent<HTMLElement>) => {
    selectedIndex.current = 7;
    setAnchorEl(event.currentTarget);
    console.log(dataGroup)    
  };
  const jigsawClick9 = (event: React.MouseEvent<HTMLElement>) => {
    selectedIndex.current = 8;
    setAnchorEl(event.currentTarget);
    console.log(dataGroup)    
  };

  const jigsawClose = () => {
    setAnchorEl(null);
  };
  
  const id = open ? "simple-popover" : undefined;

  return (
    <Box>
      <Popover
        open = {open}
        onClose={jigsawClose}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <div className="p-1 rounded-full">
          <Typography variant="h6" className="font-bold text-center">
            {dataGroup[selectedIndex.current].lessonGroupName}
          </Typography>
          <Typography variant="subtitle1" className="">
            달성율 : {dataGroup[selectedIndex.current].groupProgress}%
          </Typography>
        </div>
      </Popover>



      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="300"
        height="300"
        x="0"
        y="0"
        viewBox="-379.86 -250.305 1356 1342"
      >
        <path          
          onClick={jigsawClick1}
          style={{
            cursor: "pointer",
            transition: "transform 0.2s ease",
            transformOrigin: `${transformOriginX1}px ${transformOriginY1}px`,
            transform: isClicked9 ? "scale(0.95)" : "scale(1)"
          }}
          onMouseDown={() => setIsClicked9(true)}
          onMouseUp={() => setIsClicked9(false)}
          onMouseLeave={() => setIsClicked9(false)}
          fill="#CCC"
          stroke="#000"
          strokeMiterlimit="10"
          strokeWidth="2"
          d="M-234.29-248.496h-37.902c-43.251 0-47.669.465-62.086 7.673-12.324 6.046-23.485 17.208-29.764 29.764-6.977 14.417-7.674 18.835-7.674 61.854v247.18c0 43.252.465 47.67 7.674 62.086 6.278 12.557 17.439 23.719 29.996 29.996 14.417 6.977 18.835 7.674 61.854 7.674h37.67l.465-15.813c.698-21.393 4.186-33.484 13.72-47.9 12.092-18.604 29.066-30.695 52.087-36.973 4.418-1.162 10.696-1.859 19.766-1.859 9.068 0 15.347.697 19.765 1.859 23.021 6.277 39.995 18.369 52.087 36.973 9.534 14.416 12.789 26.508 13.72 47.668l.465 15.813h37.67c43.019 0 47.437-.465 61.854-7.674 12.557-6.277 23.718-17.439 29.996-29.996 6.977-14.416 7.674-18.834 7.674-61.854v-37.67l15.813-.465c18.137-.697 25.578-2.326 38.367-8.371 17.207-8.139 31.856-22.789 39.995-39.996 6.511-13.486 8.139-21.393 8.139-38.135 0-12.789-.465-15.58-3.022-23.719-10.464-32.088-35.577-54.179-68.597-59.992-3.488-.698-11.859-1.163-18.603-1.163H74.744v-37.438c0-43.251-.465-47.437-7.674-61.854-6.278-12.557-17.439-23.718-29.996-29.997-14.417-6.976-18.603-7.673-61.854-7.673h-209.51z"
        ></path>
        <path
          onClick={jigsawClick2}
          style={{
            cursor: "pointer",
            transition: "transform 0.2s ease",
            transformOrigin: `${transformOriginX2}px ${transformOriginY2}px`,
            transform: isClicked8 ? "scale(0.95)" : "scale(1)"
          }}
          onMouseDown={() => setIsClicked8(true)}
          onMouseUp={() => setIsClicked8(false)}
          onMouseLeave={() => setIsClicked8(false)}
          fill="#CCC"
          stroke="#000"
          strokeMiterlimit="10"
          strokeWidth="2"
          d="M211.523-248.496H173.62c-43.251 0-47.669.465-62.086 7.673-12.324 6.046-23.485 17.208-29.764 29.764-6.977 14.417-7.674 18.835-7.674 61.854v37.67l15.813.465c21.16.697 33.252 4.186 47.669 13.719 43.018 27.904 52.087 86.27 19.765 126.266-16.742 20.928-40.926 31.391-71.154 31.391H74.097v37.67c0 43.252.465 47.67 7.674 62.086 6.278 12.557 17.439 23.719 29.996 29.996 14.417 6.977 18.835 7.674 61.854 7.674h37.67l.465-15.813c.698-21.393 4.186-33.484 13.72-47.9 12.092-18.604 29.066-30.695 52.087-36.973 4.418-1.162 10.696-1.859 19.766-1.859 9.068 0 15.347.697 19.765 1.859 23.021 6.277 39.995 18.369 52.087 36.973 9.534 14.416 12.789 26.508 13.72 47.668l.465 15.813h37.67c43.019 0 47.437-.465 61.854-7.674 12.557-6.277 23.718-17.439 29.996-29.996 6.977-14.416 7.674-18.834 7.674-61.854v-37.67l15.813-.465c18.137-.697 25.578-2.326 38.367-8.371 17.207-8.139 31.856-22.789 39.995-39.996 6.511-13.486 8.139-21.393 8.139-38.135 0-12.789-.465-15.58-3.022-23.719-10.464-32.088-35.577-54.18-68.597-59.992-3.488-.697-11.859-1.162-18.603-1.162H520.56v-37.438c0-43.251-.465-47.437-7.674-61.854-6.278-12.557-17.439-23.718-29.996-29.997-14.417-6.976-18.603-7.673-61.854-7.673H211.523z"
        ></path>           
        <path
          onClick={jigsawClick3}
          style={{
            cursor: "pointer",
            transition: "transform 0.2s ease",
            transformOrigin: `${transformOriginX3}px ${transformOriginY3}px`,
            transform: isClicked7 ? "scale(0.95)" : "scale(1)"
          }}
          onMouseDown={() => setIsClicked7(true)}
          onMouseUp={() => setIsClicked7(false)}
          onMouseLeave={() => setIsClicked7(false)}
          fill="#CCC"
          stroke="#000"
          strokeMiterlimit="10"
          strokeWidth="2"
          d="M966.995-111.07v-37.902c0-43.251-.465-47.669-7.673-62.086-6.046-12.324-17.208-23.485-29.765-29.764-14.416-6.977-18.834-7.674-61.854-7.674h-247.18c-43.252 0-47.67.465-62.086 7.674-12.557 6.278-23.719 17.439-29.996 29.996-6.977 14.417-7.674 18.835-7.674 61.854v37.67l15.813.465c21.393.698 33.484 4.186 47.9 13.72 18.604 12.092 30.695 29.066 36.973 52.087 1.162 4.418 1.859 10.696 1.859 19.766 0 9.068-.697 15.347-1.859 19.765-6.277 23.021-18.369 39.995-36.973 52.087-14.416 9.534-26.508 12.789-47.668 13.72l-15.813.465v37.67c0 43.019.465 47.437 7.674 61.854 6.277 12.557 17.439 23.718 29.996 29.996 14.416 6.977 18.834 7.674 61.854 7.674h37.67l.465 15.813c.697 18.137 2.326 25.578 8.371 38.367 8.139 17.207 22.789 31.856 39.996 39.995 13.486 6.511 21.393 8.139 38.135 8.139 12.789 0 15.58-.465 23.719-3.022 32.088-10.464 54.18-35.577 59.992-68.597.697-3.488 1.162-11.859 1.162-18.603v-12.092h37.438c43.252 0 47.438-.465 61.854-7.674 12.557-6.278 23.719-17.439 29.997-29.996 6.976-14.417 7.673-18.603 7.673-61.854V-111.07z"
        ></path>       
        <path
          onClick={jigsawClick4}
          style={{
            cursor: "pointer",
            transition: "transform 0.2s ease",
            transformOrigin: `${transformOriginX4}px ${transformOriginY4}px`,
            transform: isClicked4 ? "scale(0.95)" : "scale(1)"
          }}
          onMouseDown={() => setIsClicked4(true)}
          onMouseUp={() => setIsClicked4(false)}
          onMouseLeave={() => setIsClicked4(false)}
          fill="#CCC"
          stroke="#000"
          strokeMiterlimit="10"
          strokeWidth="2"
          d="M-371.716 506.185v37.902c0 43.25.465 47.668 7.673 62.086 6.046 12.324 17.208 23.484 29.764 29.764 14.417 6.977 18.835 7.674 61.854 7.674h37.67l.465-15.813c.697-21.16 4.186-33.252 13.719-47.67 27.904-43.018 86.27-52.086 126.266-19.764 20.928 16.742 31.391 40.926 31.391 71.154v12.092h37.67c43.252 0 47.67-.465 62.086-7.674 12.557-6.279 23.719-17.439 29.996-29.996 6.977-14.418 7.674-18.836 7.674-61.854v-37.67l-15.813-.465c-21.393-.699-33.484-4.186-47.9-13.721-18.604-12.092-30.695-29.066-36.973-52.086-1.162-4.418-1.859-10.697-1.859-19.766 0-9.068.697-15.347 1.859-19.765 6.277-23.021 18.369-39.995 36.973-52.087 14.416-9.534 26.508-12.789 47.668-13.72l15.813-.465v-37.67c0-43.019-.465-47.437-7.674-61.854-6.277-12.557-17.439-23.718-29.996-29.996-14.416-6.977-18.834-7.674-61.854-7.674h-37.67l-.465-15.813c-.697-18.137-2.326-25.578-8.371-38.367-8.139-17.207-22.789-31.856-39.996-39.995-13.486-6.511-21.393-8.139-38.135-8.139-12.789 0-15.58.465-23.719 3.022-32.088 10.464-54.18 35.577-59.992 68.597-.697 3.488-1.162 11.859-1.162 18.603v12.092h-37.438c-43.251 0-47.437.465-61.854 7.674-12.557 6.278-23.718 17.439-29.997 29.996-6.976 14.417-7.673 18.603-7.673 61.854v209.514z"
        ></path>
        <path 
          onClick={jigsawClick5}
          style={{
            cursor: "pointer",
            transition: "transform 0.2s ease",
            transformOrigin: `${transformOriginX5}px ${transformOriginY5}px`,
            transform: isClicked1 ? "scale(0.95)" : "scale(1)"
          }}
          onMouseDown={() => setIsClicked1(true)}
          onMouseUp={() => setIsClicked1(false)}
          onMouseLeave={() => setIsClicked1(false)}
          fill="#CCC"
          stroke="#000"
          strokeMiterlimit="10"
          strokeWidth="2"
          d="M619.849 395.633c-10.465-32.088-35.578-54.18-68.598-59.992-3.488-.697-11.859-1.162-18.602-1.162h-12.092v-37.438c0-43.252-.465-47.438-7.674-61.854-1.963-3.924-4.402-7.712-7.211-11.258-6.184-7.808-14.162-14.439-22.801-18.759-3.779-1.828-6.871-3.222-10.15-4.288l-.221-.071a40.994 40.994 0 00-1.299-.395 46.538 46.538 0 00-3.355-.836l-.268-.056c-8.539-1.768-20.418-2.028-46.561-2.028h-37.67l-.002.021h-.215v-12.324c0-20.928-4.186-36.74-13.953-51.391-12.092-18.369-29.299-30.693-51.621-36.739-8.139-2.325-27.671-3.022-36.275-1.163-35.81 7.674-61.389 33.484-68.364 69.063-.931 4.418-1.396 13.486-1.396 20.23v12.324h-37.902c-43.251 0-47.669.465-62.086 7.673-12.324 6.046-23.485 17.208-29.764 29.765-5.024 10.383-6.792 15.583-7.388 33.75-.244 7.123-.302 16.255-.302 28.547v37.67l-15.813.465c-18.137.697-25.578 2.326-38.367 8.371-17.207 8.139-31.856 22.789-39.995 39.996-6.511 13.486-8.139 21.393-8.139 38.135 0 12.789.465 15.58 3.022 23.719 10.464 32.088 35.577 54.18 68.597 59.992 3.488.697 11.859 1.162 18.603 1.162h12.092V544.2c0 43.252.465 47.438 7.674 61.854 1.962 3.924 4.401 7.713 7.211 11.258 6.183 7.808 14.161 14.439 22.801 18.759 3.777 1.828 6.87 3.222 10.148 4.288l.224.071a40.905 40.905 0 001.297.394 41.56 41.56 0 001.234.337c.257.066.517.132.778.195l.427.101c.301.069.607.138.916.203l.268.056c8.539 1.768 20.42 2.028 46.563 2.028h37.67l.001-.021h.216v12.324c0 20.928 4.186 36.74 13.952 51.391 12.092 18.369 29.299 30.693 51.622 36.739 8.139 2.325 27.671 3.022 36.275 1.163 35.809-7.674 61.389-33.484 68.363-69.063.932-4.418 1.396-13.486 1.396-20.23v-12.324h37.902c43.25 0 47.668-.465 62.086-7.673 12.324-6.046 23.484-17.208 29.764-29.765 5.023-10.383 6.791-15.583 7.387-33.75.244-7.123.303-16.255.303-28.548v-37.67l15.813-.465c18.137-.697 25.578-2.326 38.367-8.371 17.207-8.139 31.855-22.789 39.994-39.996 6.512-13.486 8.139-21.393 8.139-38.135 0-12.787-.464-15.578-3.021-23.717z"
        ></path>       
        <path
          onClick={jigsawClick6}
          style={{
            cursor: "pointer",
            transition: "transform 0.2s ease",
            transformOrigin: `${transformOriginX6}px ${transformOriginY6}px`,
            transform: isClicked6 ? "scale(0.95)" : "scale(1)"
          }}
          onMouseDown={() => setIsClicked6(true)}
          onMouseUp={() => setIsClicked6(false)}
          onMouseLeave={() => setIsClicked6(false)}
          fill="#CCC"
          stroke="#000"
          strokeMiterlimit="10"
          strokeWidth="2"
          d="M966.995 335.157v-37.902c0-43.251-.465-47.669-7.673-62.086-6.046-12.324-17.208-23.485-29.765-29.764-14.416-6.977-18.834-7.674-61.854-7.674h-37.67l-.465 15.813c-.697 21.16-4.186 33.252-13.719 47.669-27.904 43.018-86.27 52.087-126.266 19.765-20.928-16.742-31.391-40.926-31.391-71.154v-12.092h-37.67c-43.252 0-47.67.465-62.086 7.674-12.557 6.278-23.719 17.439-29.996 29.996-6.977 14.417-7.674 18.835-7.674 61.854v37.67l15.813.465c21.393.698 33.484 4.186 47.9 13.72 18.604 12.092 30.695 29.066 36.973 52.087 1.162 4.418 1.859 10.696 1.859 19.766 0 9.068-.697 15.347-1.859 19.765-6.277 23.021-18.369 39.995-36.973 52.087-14.416 9.534-26.508 12.789-47.668 13.72l-15.813.465v37.67c0 43.019.465 47.437 7.674 61.854 6.277 12.557 17.439 23.718 29.996 29.996 14.416 6.977 18.834 7.674 61.854 7.674h37.67l.465 15.813c.697 18.137 2.326 25.578 8.371 38.367 8.139 17.207 22.789 31.856 39.996 39.995 13.486 6.511 21.393 8.139 38.135 8.139 12.789 0 15.58-.465 23.719-3.022 32.088-10.464 54.18-35.577 59.992-68.597.697-3.488 1.162-11.859 1.162-18.603v-12.092h37.438c43.252 0 47.438-.465 61.854-7.674 12.557-6.278 23.719-17.439 29.997-29.996 6.976-14.417 7.673-18.603 7.673-61.854V335.157z"
        ></path>
        <path
          onClick={jigsawClick7}
          style={{
            cursor: "pointer",
            transition: "transform 0.2s ease",
            transformOrigin: `${transformOriginX7}px ${transformOriginY7}px`,
            transform: isClicked3 ? "scale(0.95)" : "scale(1)"
          }}
          onMouseDown={() => setIsClicked3(true)}
          onMouseUp={() => setIsClicked3(false)}
          onMouseLeave={() => setIsClicked3(false)}
          fill="#CCC"
          stroke="#000"
          strokeMiterlimit="10"
          strokeWidth="2"
          d="M-371.715 952.96v37.902c0 43.252.465 47.67 7.673 62.086 6.046 12.324 17.208 23.486 29.765 29.764 14.416 6.977 18.834 7.674 61.854 7.674h247.18c43.252 0 47.67-.465 62.086-7.674 12.557-6.277 23.719-17.439 29.996-29.996 6.977-14.416 7.674-18.834 7.674-61.854v-37.67l-15.813-.465c-21.393-.697-33.484-4.186-47.9-13.719-18.604-12.092-30.695-29.066-36.973-52.088-1.162-4.418-1.859-10.695-1.859-19.766 0-9.068.697-15.346 1.859-19.764 6.277-23.021 18.369-39.996 36.973-52.088 14.416-9.533 26.508-12.789 47.668-13.719l15.813-.465v-37.67c0-43.02-.465-47.438-7.674-61.854-6.277-12.557-17.439-23.719-29.996-29.996-14.416-6.977-18.834-7.674-61.854-7.674h-37.67l-.465-15.813c-.697-18.137-2.326-25.578-8.371-38.367-8.139-17.207-22.789-31.857-39.996-39.996-13.486-6.51-21.393-8.139-38.135-8.139-12.789 0-15.58.465-23.719 3.023-32.088 10.463-54.18 35.576-59.992 68.596-.697 3.488-1.162 11.859-1.162 18.604v12.092h-37.438c-43.252 0-47.438.465-61.854 7.674-12.557 6.277-23.719 17.439-29.997 29.996-6.976 14.416-7.673 18.602-7.673 61.854V952.96z"
        ></path>
        <path
          onClick={jigsawClick8}
          style={{
            cursor: "pointer",
            transition: "transform 0.2s ease",
            transformOrigin: `${transformOriginX8}px ${transformOriginY8}px`,
            transform: isClicked5 ? "scale(0.95)" : "scale(1)"
          }}
          onMouseDown={() => setIsClicked5(true)}
          onMouseUp={() => setIsClicked5(false)}
          onMouseLeave={() => setIsClicked5(false)}
          fill="#CCC"
          stroke="#000"
          strokeMiterlimit="10"
          strokeWidth="2"
          d="M383.116 1090.386h37.902c43.25 0 47.668-.465 62.086-7.672 12.324-6.047 23.484-17.209 29.764-29.766 6.977-14.416 7.674-18.834 7.674-61.854v-37.67l-15.813-.465c-21.16-.697-33.252-4.186-47.67-13.719-43.018-27.904-52.086-86.27-19.764-126.266 16.742-20.928 40.926-31.391 71.154-31.391h12.092v-37.67c0-43.252-.465-47.67-7.674-62.086-6.279-12.557-17.439-23.719-29.996-29.996-14.418-6.977-18.836-7.674-61.854-7.674h-37.67l-.465 15.813c-.699 21.393-4.186 33.484-13.721 47.9-12.092 18.604-29.066 30.695-52.086 36.973-4.418 1.162-10.697 1.859-19.766 1.859-9.068 0-15.347-.697-19.765-1.859-23.021-6.277-39.995-18.369-52.087-36.973-9.534-14.416-12.789-26.508-13.72-47.668l-.465-15.813h-37.67c-43.019 0-47.437.465-61.854 7.674-12.557 6.277-23.718 17.439-29.996 29.996-6.977 14.416-7.674 18.834-7.674 61.854v37.67l-15.813.465c-18.137.697-25.578 2.326-38.367 8.371-17.207 8.139-31.856 22.789-39.995 39.996-6.511 13.486-8.139 21.393-8.139 38.135 0 12.789.465 15.58 3.022 23.719 10.464 32.088 35.577 54.18 68.597 59.992 3.488.697 11.859 1.162 18.603 1.162h12.092v37.438c0 43.252.465 47.438 7.674 61.854 6.278 12.557 17.439 23.719 29.996 29.998 14.417 6.975 18.603 7.672 61.854 7.672h209.514z"
        ></path>     
        <path
          onClick={jigsawClick9}
          style={{
            cursor: "pointer",
            transition: "transform 0.2s ease",
            transformOrigin: `${transformOriginX9}px ${transformOriginY9}px`,
            transform: isClicked2 ? "scale(0.95)" : "scale(1)"
          }}
          onMouseDown={() => setIsClicked2(true)}
          onMouseUp={() => setIsClicked2(false)}
          onMouseLeave={() => setIsClicked2(false)}
          fill="#CCC"
          stroke="#000"
          strokeMiterlimit="10"
          strokeWidth="2"
          d="M829.57 1090.386h37.902c43.252 0 47.67-.465 62.086-7.672 12.324-6.047 23.486-17.209 29.764-29.766 6.977-14.416 7.674-18.834 7.674-61.854v-247.18c0-43.252-.465-47.67-7.674-62.086-6.277-12.557-17.439-23.719-29.996-29.996-14.416-6.977-18.834-7.674-61.854-7.674h-37.67l-.465 15.813c-.697 21.393-4.186 33.484-13.719 47.9-12.092 18.604-29.066 30.695-52.088 36.973-4.418 1.162-10.695 1.859-19.766 1.859-9.068 0-15.346-.697-19.764-1.859-23.021-6.277-39.996-18.369-52.088-36.973-9.533-14.416-12.789-26.508-13.719-47.668l-.465-15.813h-37.67c-43.02 0-47.438.465-61.854 7.674-12.557 6.277-23.719 17.439-29.996 29.996-6.977 14.416-7.674 18.834-7.674 61.854v37.67l-15.813.465c-18.137.697-25.578 2.326-38.367 8.371-17.207 8.139-31.857 22.789-39.996 39.996-6.51 13.486-8.139 21.393-8.139 38.135 0 12.789.465 15.58 3.023 23.719 10.463 32.088 35.576 54.18 68.596 59.992 3.488.697 11.859 1.162 18.604 1.162h12.092v37.438c0 43.252.465 47.438 7.674 61.854 6.277 12.557 17.439 23.719 29.996 29.998 14.416 6.975 18.602 7.672 61.854 7.672H829.57z"
        ></path>
      </svg>
    </Box>
  );
}

export default Icon;
