import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

interface BanDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  banDuration: string;
  onBanDurationChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const BanDialog: React.FC<BanDialogProps> = ({ open, onClose, onConfirm, banDuration, onBanDurationChange }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>사용자 정지</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="정지 기간 (일)"
          type="number"
          fullWidth
          value={banDuration}
          onChange={onBanDurationChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button onClick={onConfirm}>확인</Button>
      </DialogActions>
    </Dialog>
  );
};

export default BanDialog;