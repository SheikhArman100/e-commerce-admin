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

  const handleRefund = async () => {
    try {
      await refundMutation.mutateAsync({
        orderId: payment.orderId,
        refundAmount: parseFloat(amount),
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
          <div className="grid gap-2">
            <Label htmlFor="amount">Refund Amount (৳)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              max={payment.amount}
            />
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
            disabled={refundMutation.isPending || !amount || parseFloat(amount) <= 0}
          >
            {refundMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Confirm Refund
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
