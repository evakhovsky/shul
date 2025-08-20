import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

export interface LoginDlgProps {
  open: boolean;
  onSubmitLogin: () => void;
}

export default function LoginDlg(props: LoginDlgProps) {
  const { onSubmitLogin, open } = props;

  const handleSubmit = async() => {
    onSubmitLogin();
  }

  return (
    <Dialog open={open}>
      <DialogTitle>Login</DialogTitle>
      <Button onClick={handleSubmit}>
        Submit                    
      </Button>
    </Dialog>
  );
}