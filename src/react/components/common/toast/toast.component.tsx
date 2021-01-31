import React, { useEffect } from 'react';
import { useSnackbar } from 'notistack';

export enum ToastType {
  success = 'success',
  error = 'error',
  warning = 'warning',
  info = 'info',
  close = 'close'
}

const ToastComponent: React.FC<{}> = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    const handleEvent: (e: any) => any = ({ detail }) => {
      if (detail.type === ToastType.close) {
        closeSnackbar();
      } else {
        enqueueSnackbar(detail.message, {
          variant: detail.type
        });
      }
    };
    document.addEventListener('toast', handleEvent);
    return () => {
      window.removeEventListener('toast', () => { });
    };
  }, [enqueueSnackbar, closeSnackbar]);


  return <> </>;
};

export default ToastComponent;
