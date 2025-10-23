import React, { useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

export interface ZmanimDialogProps {
  open: boolean;
  onClose: () => void;  
}

export default function ZmanimDialog(props: ZmanimDialogProps) {
  const {open, onClose} = props;

  useEffect(() => {
      if (open) {
        console.log('Zmanim Dialog is now open!');
      } 
    }, [open]); // Depend on the isOpen state

    return (
        <Dialog open={open} 
                onClose={onClose}
                fullWidth={true}
                maxWidth="sm">
          <DialogTitle>Please enter your user name and password
            {onClose ? (
              <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            ) : null}
          </DialogTitle>
            
        </Dialog>
      );
}