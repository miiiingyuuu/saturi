import React from 'react';
import { Button, ButtonProps, styled } from '@mui/material';
import { teal } from '@mui/material/colors';

// 일반 버튼 및 outlined 버튼 커스텀 색상 정의
const customColors = {
  background: teal[500],  // 기본 배경색
  hover: teal[600],       // 호버 시 배경색
  active: teal[700],      // 클릭 시 배경색
  text: '#ffffff',        // 텍스트 색상
  outlinedBorder: teal[500], // outlined 버튼 테두리 색상
  outlinedText: teal[500],   // outlined 버튼 텍스트 색상
  outlinedHover: teal[50],   // outlined 버튼 호버 시 배경색
};

// 스타일이 적용된 Button 컴포넌트 생성
const StyledButton = styled(Button)<ButtonProps>(({ theme, variant }) => ({
  padding: '10px 20px',
  textTransform: 'none', // 대문자 변환 방지
  fontWeight: 'bold',
  borderRadius: '4px',

  ...(variant === 'contained' && {
    backgroundColor: customColors.background,
    color: customColors.text,
    '&:hover': {
      backgroundColor: customColors.hover,
    },
    '&:active': {
      backgroundColor: customColors.active,
    },
  }),

  ...(variant === 'outlined' && {
    backgroundColor: 'transparent',
    color: customColors.outlinedText,
    borderColor: customColors.outlinedBorder,
    '&:hover': {
      backgroundColor: customColors.outlinedHover,
      borderColor: customColors.hover,
    },
    '&:active': {
      borderColor: customColors.active,
    },
  }),
}));

// CustomButton 컴포넌트 정의
export const CustomButton: React.FC<ButtonProps> = (props) => {
  return <StyledButton {...props} />;
};

export default CustomButton;