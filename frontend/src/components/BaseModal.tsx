import type { ReactNode } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface BaseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  onCancel?: () => void;
  onConfirm?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmDisabled?: boolean;
  confirmLoading?: boolean;
}

export function BaseModal({
  open,
  onOpenChange,
  title,
  children,
  footer,
  onCancel,
  onConfirm,
  confirmLabel = "Підтвердити",
  cancelLabel = "Скасувати",
  confirmDisabled = false,
  confirmLoading = false,
}: BaseModalProps) {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  const defaultFooter = (onCancel || onConfirm) && (
    <div className="flex gap-3 pt-2">
      {onCancel && (
        <Button
          variant="outline"
          onClick={handleCancel}
          className="flex-1 border-border hover:bg-secondary"
          disabled={confirmLoading}
        >
          {cancelLabel}
        </Button>
      )}
      {onConfirm && (
        <Button
          onClick={onConfirm}
          className="flex-1 bg-primary hover:bg-primary/90"
          disabled={confirmDisabled || confirmLoading}
        >
          {confirmLoading ? "Завантаження..." : confirmLabel}
        </Button>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {children}
          {footer !== undefined ? footer : defaultFooter}
        </div>
      </DialogContent>
    </Dialog>
  );
}
