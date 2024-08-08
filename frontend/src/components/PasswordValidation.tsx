import Typography from '@mui/material/Typography';
import LockIcon from '@mui/icons-material/Lock';
import { orange, red, green } from "@mui/material/colors";
import Popover from '@mui/material/Popover';
import { useState, MouseEvent } from "react";

// PasswordValidation 컴포넌트 정의
export default function PasswordValidation({ password }: { password: string }) {
  const [anchorEl, setAnchorEl] = useState<SVGSVGElement|null>(null);

  const handlePopoverOpen = (event: MouseEvent<SVGSVGElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const a = /^.{8,}$/.test(password); // 최소 8자
  const b = /(?=.*[0-9])/.test(password); // 숫자 포함
  const c = /(?=.*[a-z])/.test(password); // 소문자 포함
  const d = /(?=.*[!@#$%^&+=])/.test(password); // 특수 문자 포함
  const e = /^\S*$/.test(password); // 공백 없음

  // 조건 통과 개수 계산
  const passedChecks = [a, b, c, d, e].filter(Boolean).length;

  // 아이콘 색상 결정
  let iconColor;

  switch (true) {
    case passedChecks === 5:
      // eslint-disable-next-line prefer-destructuring
      iconColor = green[500]
      break
    case passedChecks > 2:
      // eslint-disable-next-line prefer-destructuring
      iconColor = orange[500]
      break
    default:
      // eslint-disable-next-line prefer-destructuring
      iconColor = red[500]
      break
  }

  // 유효성 검사 항목과 색상 결정
  const getTextColor = (isValid: boolean) => isValid ? 'black' : 'red';

  // 유효성 검사 메시지
  const validationMessages = [
    { text: '최소 8자를 포함해야 합니다.', valid: a },
    { text: '최소 1개의 숫자를 포함해야 합니다.', valid: b },
    { text: '최소 1개의 영어 대소문자를 포함해야 합니다.', valid: c },
    { text: '특수 문자 (!,@,#,$,%,^,&,+,=)를 포함해야 합니다.', valid: d },
    { text: '공백은 허용되지 않습니다.', valid: e }
  ];

  return (
    <>
      <LockIcon
        sx={{
          color: iconColor
        }}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      />
      <Popover
        id="mouse-over-popover"
        sx={{
          pointerEvents: 'none',
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography sx={{ p: 1 }}>
          {validationMessages.map(({ text, valid }, index) => (
            <Typography key={index} sx={{ color: getTextColor(valid) }}>
              {text}
            </Typography>
          ))}
        </Typography>
      </Popover>
    </>
  );
}
