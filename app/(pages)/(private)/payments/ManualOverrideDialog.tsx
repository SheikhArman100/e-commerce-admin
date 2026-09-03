'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit2, Loader2 } from 'lucide-react';
import { useUpdatePayment } from '@/hooks/usePayments';
import { IPayment, PaymentStatus } from '@/types/payment.types';

export default function ManualOverrideDialog({ payment }: { payment: IPayment }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<PaymentStatus>(payment.paymentStatus);
  const [bankTranId, setBankTranId] = useState(payment.bankTranId || '');

  const updateMutation = useUpdatePayment();

  // Manual override policy — must mirror ALLOWED_MANUAL_STATUS_CHANGES in the
  // backend payment.service.ts (the API enforces it regardless). PAID/REFUNDED
  // payments are frozen: refunds go through the gateway refund flow.
  const ALLOWED_STATUS_CHANGES: Record<PaymentStatus, PaymentStatus[]> = {
    PENDING: ['FAILED', 'CANCELLED', 'PAID'],
    FAILED: ['CANCELLED', 'PAID'],
    CANCELLED: ['PAID'],
    PAID: [],
    REFUNDED: [],
  };
  const allowedTargets = ALLOWED_STATUS_CHANGES[payment.paymentStatus] || [];
  const statusLocked = allowedTargets.length === 0;

  const handleUpdate = async () => {
    try {
      await updateMutation.mutateAsync({
        id: payment.id,
        data: {
          paymentStatus: status,
          bankTranId: bankTranId || undefined,
        },
      });
      setOpen(false);
    } catch (error) {
      // Error handled by hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Edit2 className="w-4 h-4 mr-2" /> Manual Override
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manual Payment Override</DialogTitle>
          <DialogDescription>
            Manually update the status or bank transaction ID for internal record keeping.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="status">Payment Status</Label>
            <p className="text-xs text-muted-foreground">
              Current status: <span className="font-semibold text-foreground">{payment.paymentStatus}</span>
            </p>
            {statusLocked ? (
              <div className="rounded-md border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600 leading-relaxed">
                This payment is <strong>{payment.paymentStatus}</strong> and its status can no longer
                be overridden{payment.paymentStatus === 'PAID' ? ' — to return money, use the Refund flow' : ''}.
                The Bank Transaction ID can still be corrected below.
              </div>
            ) : (
              <Select
                value={allowedTargets.includes(status) ? status : undefined}
                onValueChange={(val) => setStatus(val as PaymentStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={`Change from ${payment.paymentStatus}…`} />
                </SelectTrigger>
                <SelectContent>
                  {/* Current status shown disabled so it's visible but not re-selectable */}
                  <SelectItem value={payment.paymentStatus} disabled>
                    {payment.paymentStatus} (current)
                  </SelectItem>
                  {allowedTargets.map((target) => (
                    <SelectItem key={target} value={target}>{target}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          {status === 'PAID' && payment.paymentStatus !== 'PAID' && (
            <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800 leading-relaxed">
              <strong>Heads up:</strong> marking this payment PAID will also complete the related
              order — order items are created from the saved cart snapshot, stock is decremented,
              the customer's cart is cleared, and the order is marked Paid in its status timeline.
              Only use this if you are certain the money was actually received (e.g. the gateway
              callback was missed).
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="bankId">Bank Transaction ID</Label>
            <Input
              id="bankId"
              value={bankTranId}
              onChange={(e) => setBankTranId(e.target.value)}
              placeholder="e.g. BANK123456"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={handleUpdate}
            disabled={updateMutation.isPending || (!statusLocked && !allowedTargets.includes(status))}
          >
            {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
