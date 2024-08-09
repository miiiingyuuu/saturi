import {
  useState,
  useMemo,
  useEffect
} from "react";
import {
  Alert,
  Typography,
  Collapse
} from "@mui/material";

export default function PasswordValidation({ password }: { password: string }) {
  const [open, setOpen] = useState(true);

  const { passedChecks, validationMessages } = useMemo(() => {
    const a = /^.{8,}$/.test(password);
    const b = /(?=.*[0-9])/.test(password);
    const c = /(?=.*[a-z])/.test(password);
    const d = /(?=.*[!@#$%^&+=])/.test(password);
    const e = /^\S*$/.test(password);

    const passedChecks = [a, b, c, d, e].filter(Boolean).length;

    const validationMessages = [
      { id: "a", text: "최소 8자 이상이어야 합니다.", valid: a },
      { id: "b", text: "최소 1개의 숫자를 포함해야 합니다.", valid: b },
      { id: "c", text: "최소 1개의 소문자를 포함해야 합니다.", valid: c },
      { id: "d", text: "특수 문자를 포함해야 합니다.", valid: d },
      { id: "e", text: "공백은 허용되지 않습니다.", valid: e }
    ];

    return { passedChecks, validationMessages };
  }, [password]);

  useEffect(() => {
    if (passedChecks === 5) {
      const timer = setTimeout(() => {
        setOpen(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setOpen(true);
    }
  }, [passedChecks]);

  return (
    <Collapse
      in={open}
      timeout={{
        enter: 500, // 열림 애니메이션 시간
        exit: 1000, // 닫힘 애니메이션 시간
      }}
    >
      <Alert
        severity={
          passedChecks === 5
            ? "success"
            : passedChecks > 2
              ? "warning"
              : "error"
        }
      >
        {validationMessages.map((message) =>
          !message.valid ? (
            <Typography key={message.id}>{message.text}</Typography>
          ) : null
        )}
        {passedChecks === 5 && (
          <Typography>안전한 비밀번호 입니다.</Typography>
        )}
      </Alert>
    </Collapse>
  );
}
