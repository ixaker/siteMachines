import * as React from 'react';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface CustomSnackbarProps {
  openSnackbar: boolean;
  setOpenSnackbar: (param: boolean) => void;
}

const CustomSnackbar: React.FC<CustomSnackbarProps> = ({ openSnackbar, setOpenSnackbar }) => {
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
  };

  return (
    <div style={{ position: 'fixed', top: '50%', right: '55%', transform: 'translate(50%, -50%)' }}>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: '100%', textWrap: 'nowrap' }}>
          Дані успішно оновлені!
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CustomSnackbar;
