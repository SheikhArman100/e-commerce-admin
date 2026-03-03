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
            <Select value={status} onValueChange={(val) => setStatus(val as PaymentStatus)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">PENDING</SelectItem>
                <SelectItem value="PAID">PAID</SelectItem>
                <SelectItem value="FAILED">FAILED</SelectItem>
                <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                <SelectItem value="REFUNDED">REFUNDED</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
