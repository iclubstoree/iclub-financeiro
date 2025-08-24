
import { toast as sonnerToast } from 'sonner';

interface ToastOptions {
  duration?: number;
  autoClose?: boolean;
}

class ToastManager {
  private defaultDuration = 4000; // 4 seconds
  private successDuration = 3000; // 3 seconds
  private errorDuration = 5000; // 5 seconds
  private warningDuration = 4000; // 4 seconds

  success(message: string, options: ToastOptions = {}) {
    const duration = options.duration ?? this.successDuration;
    return sonnerToast.success(message, {
      duration: options.autoClose === false ? Infinity : duration,
      className: 'bg-green-50 border-green-200 text-green-800',
      dismissible: true,
      action: options.autoClose === false ? undefined : {
        label: '×',
        onClick: () => sonnerToast.dismiss()
      }
    });
  }

  error(message: string, options: ToastOptions = {}) {
    const duration = options.duration ?? this.errorDuration;
    return sonnerToast.error(message, {
      duration: options.autoClose === false ? Infinity : duration,
      className: 'bg-red-50 border-red-200 text-red-800',
      dismissible: true,
      action: options.autoClose === false ? undefined : {
        label: '×',
        onClick: () => sonnerToast.dismiss()
      }
    });
  }

  warning(message: string, options: ToastOptions = {}) {
    const duration = options.duration ?? this.warningDuration;
    return sonnerToast.warning(message, {
      duration: options.autoClose === false ? Infinity : duration,
      className: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      dismissible: true,
      action: options.autoClose === false ? undefined : {
        label: '×',
        onClick: () => sonnerToast.dismiss()
      }
    });
  }

  info(message: string, options: ToastOptions = {}) {
    const duration = options.duration ?? this.defaultDuration;
    return sonnerToast.info(message, {
      duration: options.autoClose === false ? Infinity : duration,
      className: 'bg-blue-50 border-blue-200 text-blue-800',
      dismissible: true,
      action: options.autoClose === false ? undefined : {
        label: '×',
        onClick: () => sonnerToast.dismiss()
      }
    });
  }

  // Custom method for expense-related notifications
  expenseAdded(count: number = 1) {
    const message = count === 1 ? 'Saída adicionada com sucesso!' : `${count} saídas adicionadas com sucesso!`;
    return this.success(message, { duration: 3000 });
  }

  expenseUpdated() {
    return this.success('Saída atualizada com sucesso!', { duration: 3000 });
  }

  expenseDeleted() {
    return this.success('Saída excluída com sucesso!', { duration: 3000 });
  }

  expenseMarkedPaid() {
    return this.success('Saída marcada como paga!', { duration: 3000 });
  }

  validationError(message: string = 'Por favor, corrija os campos obrigatórios') {
    return this.error(message, { duration: 4000 });
  }

  // Dismiss all toasts
  dismissAll() {
    sonnerToast.dismiss();
  }

  // Custom toast for AI chat responses
  aiResponse(message: string) {
    return sonnerToast(message, {
      icon: '🤖',
      duration: 4000,
      className: 'bg-purple-50 border-purple-200 text-purple-800',
      dismissible: true
    });
  }
}

export const toast = new ToastManager();

// Export the original sonner toast for cases where we need more control
export { toast as sonnerToast } from 'sonner';