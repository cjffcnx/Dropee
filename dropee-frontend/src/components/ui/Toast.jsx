import React, { useEffect } from 'react';
import useStore from '../../store/useStore';

const TOAST_ICONS = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
  warning: '⚠️',
};

const TOAST_COLORS = {
  success: 'border-success bg-success/10',
  error: 'border-error bg-error/10',
  info: 'border-blue-400 bg-blue-400/10',
  warning: 'border-yellow-400 bg-yellow-400/10',
};

const ToastItem = ({ toast }) => {
  const removeToast = useStore((s) => s.removeToast);

  useEffect(() => {
    const timer = setTimeout(() => removeToast(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, removeToast]);

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-xl border glass-card animate-slide-in max-w-sm w-full ${TOAST_COLORS[toast.type] || TOAST_COLORS.info}`}
    >
      <span className="text-lg flex-shrink-0 mt-0.5">{TOAST_ICONS[toast.type] || 'ℹ️'}</span>
      <div className="flex-1 min-w-0">
        {toast.title && <p className="font-semibold text-sm text-white">{toast.title}</p>}
        <p className="text-sm text-text-muted">{toast.message}</p>
      </div>
      <button
        onClick={() => removeToast(toast.id)}
        className="text-text-muted hover:text-white flex-shrink-0 text-lg leading-none"
      >
        ×
      </button>
    </div>
  );
};

const Toast = () => {
  const toasts = useStore((s) => s.toasts);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 items-end">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
};

export default Toast;
