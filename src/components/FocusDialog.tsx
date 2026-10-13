import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import '../styles/focus-dialog.css';

/** A shared reading overlay. Opening it never changes the article's height. */
export default function FocusDialog({
  open,
  onClose,
  title,
  eyebrow,
  children,
  footer,
  className = '',
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const heading = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (!open) {
      if (dialog.open) dialog.close();
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (!dialog.open) dialog.showModal();
    return () => {
      document.body.style.overflow = previousOverflow;
      if (dialog.open) dialog.close();
    };
  }, [open]);

  return createPortal(
    <dialog
      ref={ref}
      className={`focus-dialog ${className}`}
      aria-labelledby={heading}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      {open && (
        <div className="focus-dialog-layout">
          <header className="focus-dialog-header">
            <div>
              {eyebrow && <p className="focus-dialog-eyebrow">{eyebrow}</p>}
              <h2 id={heading}>{title}</h2>
            </div>
            <button className="focus-button" onClick={onClose} autoFocus>
              Close <span aria-hidden="true">×</span>
            </button>
          </header>
          <div className="focus-dialog-body">{children}</div>
          {footer && <footer className="focus-dialog-footer">{footer}</footer>}
        </div>
      )}
    </dialog>,
    document.body,
  );
}
