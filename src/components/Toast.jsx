import { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 2800);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="toast show" style={{ background: type === 'error' ? 'var(--error)' : 'var(--charcoal)' }}>
      <span className="toast-icon">{type === 'error' ? '✗' : '✓'}</span>
      <span>{message}</span>
    </div>
  );
};

export default Toast;
