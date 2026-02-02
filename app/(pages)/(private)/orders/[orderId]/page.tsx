'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Edit, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { formatDateTime } from '@/lib/helpers';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useOrder, useUpdateOrderStatus } from '@/hooks/useOrders';
import { ScreenLoader } from '@/components/screen-loader';
import ProfileImage from '@/components/ProfileImage';
import { OrderStatus } from '@/types/order.types';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const getStatusIcon = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return <Clock className="w-4 h-4" />;
    case OrderStatus.SHIPPED:
      return <Truck className="w-4 h-4" />;
    case OrderStatus.DELIVERED:
      return <CheckCircle className="w-4 h-4" />;
    case OrderStatus.CANCELLED:
      return <Package className="w-4 h-4" />; // Could use a different icon like XCircle if available
    default:
      return <Package className="w-4 h-4" />;
  }
};

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case OrderStatus.SHIPPED:
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case OrderStatus.DELIVERED:
      return 'bg-green-100 text-green-800 border-green-200';
    case OrderStatus.CANCELLED:
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const { data: order, isLoading, error } = useOrder(orderId);
  const updateOrderStatusMutation = useUpdateOrderStatus();

  const [selectedStatus, setSelectedStatus] = React.useState<OrderStatus | ''>('');

  // Initialize selected status when order loads
  React.useEffect(() => {
    if (order?.status) {
      setSelectedStatus(order.status);
    }
  }, [order]);

  if (isLoading) {
    return <ScreenLoader title="Loading order details" />;
  }

  if (error || !order) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-2">
            Order Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The order you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button onClick={() => router.push('/orders')} variant="outline">
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  const handleStatusUpdate = () => {
    if (!selectedStatus || selectedStatus === order.status) return;

    updateOrderStatusMutation.mutate(
      {
        orderId,
        data: { status: selectedStatus as OrderStatus }
      },
      {
        onSuccess: () => {
          toast.success('Order status updated successfully!');
        },
        onError: (error: any) => {
          console.error('Update order status error:', error);
          toast.error(
            error?.response?.data?.message || 'Failed to update order status. Please try again.'
          );
        }
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/orders">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Link>
          </Button>
          <div>
            <h1 className="text-xl sm:text-3xl font-bold tracking-tight">
              Order Details
            </h1>
            <p className="text-muted-foreground">
              Order #{order.id}
            </p>
          </div>
        </div>

        {/* Status Update */}
        <div className="flex items-center gap-3">
          <Badge className={`${getStatusColor(order.status)} border flex items-center gap-1`}>
            {getStatusIcon(order.status)}
            {order.status}
          </Badge>

          <div className="flex items-center gap-2">
            <Select
              value={selectedStatus}
              onValueChange={(value) => setSelectedStatus(value as OrderStatus)}
              disabled={updateOrderStatusMutation.isPending}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Change status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={OrderStatus.PENDING}>Pending</SelectItem>
                <SelectItem value={OrderStatus.SHIPPED}>Shipped</SelectItem>
                <SelectItem value={OrderStatus.DELIVERED}>Delivered</SelectItem>
                <SelectItem value={OrderStatus.CANCELLED}>Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={handleStatusUpdate}
              disabled={
                updateOrderStatusMutation.isPending ||
                !selectedStatus ||
                selectedStatus === order.status
              }
              size="sm"
            >
              {updateOrderStatusMutation.isPending ? (
                <Loader2 className="w-3 h-3 animate-spin mr-1" />
              ) : (
                <Edit className="w-3 h-3 mr-1" />
              )}
              Update
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Items ({order.items.length})
              </CardTitle>
              <CardDescription>
                Items included in this order
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.length > 0 ? (
                order.items.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-4">
                      {/* Product Image */}
                      {item.productFlavorSize.productFlavor?.images &&
                       item.productFlavorSize.productFlavor.images.length > 0 ? (
                        <div className="flex-shrink-0 ">
                          <Image
                            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${item.productFlavorSize.productFlavor.images[0].path}`}
                            alt={item.product.title}
                            width={64}
                            height={64}
                            className="w-16 h-16 object-cover rounded-lg border shadow-sm"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg border flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-400" />
                        </div>
                      )}

                      <div className="flex-1">
                        <h4 className="font-medium">{item.productTitle || item.product.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.productFlavorSize.productFlavor?.flavor?.color && (
                            <span className="inline-flex items-center gap-1 mr-1">
                              <span
                                className="w-3 h-3 rounded-full border inline-block"
                                style={{ backgroundColor: item.productFlavorSize.productFlavor.flavor.color }}
                              />
                              {item.flavorName || item.productFlavorSize.productFlavor.flavor.name}
                            </span>
                          )}
                          • {item.sizeName || item.productFlavorSize.size?.name}Pound
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span>Price: ${item.price.toFixed(2)}</span>
                          <span>Quantity: {item.quantity}</span>
                          {/* <span>Stock: {item.productFlavorSize.stock}</span> */}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No items in this order</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 rounded-full">
                    <ProfileImage
                      image={order.user.detail?.image || order.user.detail?.profileImage}
                    />
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{order.user.name}</h3>
                    <p className="text-sm text-muted-foreground">{order.user.email}</p>
                    {order.user.phoneNumber && (
                      <p className="text-xs text-muted-foreground">{order.user.phoneNumber}</p>
                    )}
                  </div>
                </div>

                {order.user.role && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Role</label>
                    <p className="text-sm capitalize">{order.user.role}</p>
                  </div>
                )}
                {order.user.detail?.address && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Address</label>
                    <p className="text-sm">
                      {order.user.detail.address}
                      {order.user.detail.road && `, ${order.user.detail.road}`}
                      {order.user.detail.city && `, ${order.user.detail.city}`}
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                  <p className="text-sm">{formatDateTime(order.user.createdAt || '')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Order ID:</span>
                  <span className="font-mono text-sm">{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge className={`${getStatusColor(order.status)} border`}>
                    {order.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Total Items:</span>
                  <span className="font-medium">{order.items.length}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Amount:</span>
                  <span>${order.totalAmount.toFixed(2)}</span>
                </div>
                <Separator />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Order Date</label>
                  <p className="text-sm">{formatDateTime(order.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                  <p className="text-sm">{formatDateTime(order.updatedAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
