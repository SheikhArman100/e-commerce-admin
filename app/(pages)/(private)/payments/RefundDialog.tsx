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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RotateCcw, Loader2 } from 'lucide-react';
import { useInitiateRefund } from '@/hooks/usePayments';
import { IPayment } from '@/types/payment.types';

export default function RefundDialog({ payment }: { payment: IPayment }) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(payment.amount.toString());
  const [remark, setRemark] = useState('Customer requested refund');

  const refundMutation = useInitiateRefund();

  // Mirrors backend refundPayment() rules: only PAID payments can be refunded,
  // and the SSLCommerz S2S refund API requires the stored val_id (from the
  // gateway validation response). Payments marked PAID via manual override have
  // no val_id — the backend would reject them, so hide the button entirely.
  const valId = (payment.validationResponse as any)?.val_id;
  const refundable = payment.paymentStatus === 'PAID' && !!valId;
  const parsedAmount = parseFloat(amount);
  const amountInvalid =
    !amount || isNaN(parsedAmount) || parsedAmount <= 0 || parsedAmount > payment.amount;
  const amountExceeds = !isNaN(parsedAmount) && parsedAmount > payment.amount;

  if (!refundable) return null;

  const handleRefund = async () => {
    try {
      await refundMutation.mutateAsync({
        orderId: payment.orderId,
        refundAmount: parsedAmount,
        refundRemark: remark,
      });
      setOpen(false);
    } catch (error) {
      // Error handled by hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700">
          <RotateCcw className="w-4 h-4 mr-2" /> Refund
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Initiate S2S Refund</DialogTitle>
          <DialogDescription>
            This will trigger a refund request via SSLCommerz for Transaction <strong>{payment.transactionId}</strong>.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-xs text-blue-800 leading-relaxed">
            The refund is sent server-to-server using the stored gateway validation ID
            (<span className="font-mono">val_id</span>) and bank transaction ID. On success the
            payment and its order are marked <strong>REFUNDED</strong>. Partial refunds are allowed
            up to <strong>{payment.amount.toLocaleString()} ৳</strong>.
          </div>
          <div className="grid gap-2">
            <Label htmlFor="amount">Refund Amount (৳)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              max={payment.amount}
              min={0.01}
              step="0.01"
            />
            {amountExceeds && (
              <p className="text-xs text-red-600">
                Refund amount cannot exceed the paid amount ({payment.amount.toLocaleString()} ৳)
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="remark">Refund Remark</Label>
            <Input
              id="remark"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Reason for refund"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleRefund}
            disabled={refundMutation.isPending || amountInvalid}
          >
            {refundMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Confirm Refund
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
