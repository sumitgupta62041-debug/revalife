import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Package, RotateCcw, X, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { type Order, ReturnReason } from "../backend";

export type OrderActionType = "cancel" | "return" | "replace";

interface OrderActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: OrderActionType;
  order: Order;
  onSubmit: (reason: string) => Promise<void>;
  isSubmitting?: boolean;
}

const RETURN_REASONS: { value: ReturnReason; label: string }[] = [
  { value: ReturnReason.Defective, label: "Defective product" },
  { value: ReturnReason.WrongProduct, label: "Wrong product received" },
  { value: ReturnReason.DamagedInShipment, label: "Damaged in shipment" },
];

const ACTION_CONFIG: Record<
  OrderActionType,
  {
    title: string;
    icon: React.ElementType;
    iconColor: string;
    submitLabel: string;
    submitClass: string;
  }
> = {
  cancel: {
    title: "Cancel Order",
    icon: XCircle,
    iconColor: "text-destructive",
    submitLabel: "Confirm Cancellation",
    submitClass:
      "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
  },
  return: {
    title: "Return Product",
    icon: RotateCcw,
    iconColor: "text-amber-600",
    submitLabel: "Submit Return Request",
    submitClass: "bg-amber-600 hover:bg-amber-700 text-white",
  },
  replace: {
    title: "Replace Product",
    icon: Package,
    iconColor: "text-wellness-green",
    submitLabel: "Submit Replace Request",
    submitClass: "bg-wellness-green hover:bg-wellness-green-dark text-white",
  },
};

export function OrderActionModal({
  isOpen,
  onClose,
  actionType,
  order,
  onSubmit,
  isSubmitting = false,
}: OrderActionModalProps) {
  const [selectedReason, setSelectedReason] = useState<ReturnReason | "">("");
  const [cancelReason, setCancelReason] = useState("");

  const config = ACTION_CONFIG[actionType];
  const Icon = config.icon;
  const isCancelAction = actionType === "cancel";

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const handleSubmit = async () => {
    if (!isCancelAction && !selectedReason) return;
    const reason = isCancelAction ? cancelReason : (selectedReason as string);
    await onSubmit(reason);
    setSelectedReason("");
    setCancelReason("");
  };

  const handleClose = () => {
    setSelectedReason("");
    setCancelReason("");
    onClose();
  };

  const isValid = isCancelAction ? true : !!selectedReason;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop — plain div, NOT dialog/Sheet */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: overlay close on click is standard UX */}
      <div
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Panel — right-side slide-in, plain div, NOT HTML dialog */}
      <div
        aria-modal="true"
        aria-labelledby="order-action-title"
        data-ocid="order_action.dialog"
        className="fixed top-0 right-0 h-full z-[70] w-full sm:max-w-md bg-card border-l border-border shadow-2xl flex flex-col overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border sticky top-0 bg-card z-10">
          <div className="flex items-center gap-2.5">
            <Icon className={`h-5 w-5 ${config.iconColor}`} />
            <h2
              id="order-action-title"
              className="font-semibold font-display text-foreground"
            >
              {config.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            data-ocid="order_action.close_button"
            className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 px-5 py-5 space-y-4">
          {/* Order summary */}
          <div className="rounded-xl bg-muted/40 p-4 text-sm border border-border/40">
            <p className="font-semibold text-foreground font-display">
              Order #{order.orderId}
            </p>
            <p className="text-muted-foreground mt-1">
              {order.items.length} item{order.items.length !== 1 ? "s" : ""} · ₹
              {Number(order.totalAmount).toLocaleString("en-IN")}
            </p>
          </div>

          {/* Warning for cancel */}
          {isCancelAction && (
            <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <p>
                This action cannot be undone. The order will be cancelled
                immediately.
              </p>
            </div>
          )}

          {/* Reason fields */}
          {isCancelAction ? (
            <div className="space-y-2">
              <Label htmlFor="cancel-reason" className="font-medium">
                Reason for cancellation{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <Textarea
                id="cancel-reason"
                placeholder="Tell us why you're cancelling..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="resize-none"
                rows={3}
                data-ocid="order_action.cancel_reason.textarea"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="return-reason" className="font-medium">
                Reason <span className="text-destructive">*</span>
              </Label>
              <Select
                value={selectedReason}
                onValueChange={(v) => setSelectedReason(v as ReturnReason)}
              >
                <SelectTrigger
                  id="return-reason"
                  data-ocid="order_action.reason.select"
                >
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  side="bottom"
                  align="start"
                  sideOffset={4}
                >
                  {RETURN_REASONS.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="px-5 py-5 border-t border-border bg-card flex gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="flex-1 h-11 rounded-xl"
            data-ocid="order_action.cancel_button"
          >
            Go Back
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className={`flex-1 h-11 rounded-xl font-semibold ${config.submitClass}`}
            data-ocid="order_action.confirm_button"
          >
            {isSubmitting ? "Processing..." : config.submitLabel}
          </Button>
        </div>
      </div>
    </>
  );
}
