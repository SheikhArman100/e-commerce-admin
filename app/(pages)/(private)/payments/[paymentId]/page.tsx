'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { usePayment } from '@/hooks/usePayments';
import { ScreenLoader } from '@/components/screen-loader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, CreditCard, Hash, DollarSign, Calendar, Clock, RotateCcw, ShieldAlert, FileJson } from 'lucide-react';
import Link from 'next/link';
import { formatDateTime } from '@/lib/helpers';
import { Badge } from '@/components/ui/badge';
import RefundDialog from '../RefundDialog';
import ManualOverrideDialog from '../ManualOverrideDialog';

export default function PaymentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const paymentId = params.paymentId as string;

  const { data: payment, isLoading, error } = usePayment(paymentId);

  if (isLoading) return <ScreenLoader title="Loading payment details..." />;

  if (error || !payment) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">Payment Record Not Found</h2>
        <Button asChild variant="outline">
          <Link href="/payments"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Payments</Link>
        </Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'text-green-700 bg-green-100 border-green-200';
      case 'PENDING': return 'text-yellow-700 bg-yellow-100 border-yellow-200';
      case 'FAILED': return 'text-red-700 bg-red-100 border-red-200';
      case 'CANCELLED': return 'text-gray-700 bg-gray-100 border-gray-200';
      case 'REFUNDED': return 'text-blue-700 bg-blue-100 border-blue-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col items-start gap-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/payments"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Payments</Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <CreditCard className="w-8 h-8 text-blue-600" />
              Payment: <span className="font-mono text-blue-700 text-2xl">{payment.transactionId}</span>
            </h1>
            <p className="text-muted-foreground">Detailed audit trail and gateway transaction logs</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ManualOverrideDialog payment={payment} />
          <RefundDialog payment={payment} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-gray-400" />
              Transaction Summary
            </CardTitle>
            <CardDescription>Core details from the payment gateway</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Bank Transaction ID</p>
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-gray-400" />
                  <span className="font-semibold text-lg">{payment.bankTranId || 'N/A'}</span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Order Reference</p>
                <Link href={`/orders/${payment.orderId}`} className="text-blue-600 hover:underline font-semibold text-lg">
                  Order #{payment.orderId}
                </Link>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-blue-600">৳{payment.amount.toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Payment Method</p>
                <Badge variant="outline" className="uppercase font-bold tracking-wider">
                  {payment.paymentMethod || 'UNKNOWN'}
                </Badge>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge className={`px-3 py-1 font-bold ${getStatusColor(payment.paymentStatus)}`}>
                  {payment.paymentStatus}
                </Badge>
              </div>
            </div>

            {/* Gateway Response Viewer */}
            <div className="pt-6 border-t">
              <div className="flex items-center gap-2 mb-4">
                <FileJson className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold text-lg">Gateway Audit Log (Raw)</h3>
              </div>
              <div className="bg-slate-950 rounded-lg p-4 overflow-x-auto">
                <pre className="text-xs text-green-400 font-mono">
                  {JSON.stringify(payment.gatewayResponse, null, 2) || '// No gateway logs available'}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-blue-500 mt-1" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Transaction Initiated</p>
                  <p className="font-semibold">{formatDateTime(payment.createdAt)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-slate-500 mt-1" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last State Change</p>
                  <p className="text-sm font-semibold">{formatDateTime(payment.updatedAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-100 bg-blue-50/30">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-blue-600" />
                Admin Note
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-blue-700 leading-relaxed uppercase font-medium">
              Manual status overrides should be used sparingly. Initiating a refund will trigger the S2S Refund API via SSLCommerz.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
