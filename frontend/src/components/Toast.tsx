import { useEffect, type ReactElement } from "react";

export type ToastKind = "success" | "error";

export interface ToastProps {
  readonly message: string | null | undefined;
  readonly kind?: ToastKind;
  readonly onDismiss?: () => void;
  readonly duration?: number;
}

export default function Toast({
  message,
  kind = "success",
  onDismiss,
  duration = 2400,
}: ToastProps): ReactElement | null {
  useEffect(() => {
    if (!message) return undefined;
    const t = window.setTimeout(() => {
      onDismiss?.();
    }, duration);
    return () => {
      window.clearTimeout(t);
    };
  }, [message, duration, onDismiss]);

  if (!message) return null;
  return (
    <div className={`toast toast--${kind}`} role="status" aria-live="polite">
      <span className="toast__dot" aria-hidden />
      <span className="toast__msg">{message}</span>
    </div>
  );
}
