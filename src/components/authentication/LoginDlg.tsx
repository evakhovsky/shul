import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

export interface LoginDlgProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginDlg(props: LoginDlgProps) {
  const { onClose, open } = props;

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Set backup account</DialogTitle>      
    </Dialog>
  );
}