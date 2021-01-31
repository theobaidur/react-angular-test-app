import { ToastType } from '../components/common/toast/toast.component';

const notificationService = {
  hideAlerts() {
    let event = new CustomEvent('toast', {
      detail: {
        type: ToastType.close
      }
    });
    document.dispatchEvent(event);
  },
  showSuccessMessage(message: string) {
    let event = new CustomEvent('toast', {
      detail: {
        type: ToastType.success,
        message: message
      }
    });
    document.dispatchEvent(event);
  },
  showErrorMessage(message: string) {
    let event = new CustomEvent('toast', {
      detail: {
        type: ToastType.error,
        message: message
      }
    });
    document.dispatchEvent(event);
  },
  showWarningMessage(message: string) {
    let event = new CustomEvent('toast', {
      detail: {
        type: ToastType.warning,
        message: message
      }
    });
    document.dispatchEvent(event);
  },
  showInfoMessage(message: string) {
    let event = new CustomEvent('toast', {
      detail: {
        type: ToastType.info,
        message: message
      }
    });
    document.dispatchEvent(event);
  }
};

export default notificationService;
