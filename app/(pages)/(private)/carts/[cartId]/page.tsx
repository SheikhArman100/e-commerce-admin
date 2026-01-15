'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit, Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { useCart, useUpdateCartItem, useDeleteCartItem } from '@/hooks/useCarts';
import { ScreenLoader } from '@/components/screen-loader';
import ProfileImage from '@/components/ProfileImage';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';


export default function CartDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const cartId = params.cartId as string;

  const { data: cart, isLoading, error } = useCart(cartId);
  const updateCartItemMutation = useUpdateCartItem();
  const deleteCartItemMutation = useDeleteCartItem();

  const [quantities, setQuantities] = React.useState<Record<string, number>>({});

  // Initialize quantities when cart data loads
  React.useEffect(() => {
    if (cart?.items) {
      const initialQuantities: Record<string, number> = {};
      cart.items.forEach(item => {
        initialQuantities[item.id.toString()] = item.quantity;
      });
      setQuantities(initialQuantities);
    }
  }, [cart]);

  if (isLoading) {
    return <ScreenLoader title="Loading cart details" />;
  }

  if (error || !cart) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-2">
            Cart Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The cart you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => router.push('/carts')} variant="outline">
            Back to Carts
          </Button>
        </div>
      </div>
    );
  }

  const handleQuantityChange = (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setQuantities(prev => ({ ...prev, [cartItemId]: newQuantity }));
  };

  const handleUpdateQuantity = (cartItemId: string) => {
    const newQuantity = quantities[cartItemId];
    if (!newQuantity || newQuantity < 1) return;

    updateCartItemMutation.mutate(
      {
        cartItemId,
        data: { quantity: newQuantity }
      },
      {
        onSuccess: () => {
          // Also invalidate the current cart query to ensure fresh data
          queryClient.invalidateQueries({ queryKey: ['cart', cartId], refetchType: 'all' });
          toast.success('Quantity updated successfully!');
        },
        onError: (error: any) => {
          console.error('Update quantity error:', error);
          toast.error(
            error?.response?.data?.message || 'Failed to update quantity. Please try again.'
          );
        }
      }
    );
  };

  const handleDeleteCartItem = (cartItemId: string) => {
    deleteCartItemMutation.mutate(cartItemId, {
      onSuccess: () => {
        // Also invalidate the current cart query to ensure fresh data
        queryClient.invalidateQueries({ queryKey: ['cart', cartId], refetchType: 'all' });
        toast.success('Item removed from cart successfully!');
      },
      onError: (error: any) => {
        console.error('Delete cart item error:', error);
        toast.error(
          error?.response?.data?.message || 'Failed to remove item. Please try again.'
        );
      }
    });
  };

  const calculateItemTotal = (item: any) => {
    return item.productFlavorSize.price * item.quantity;
  };

  const calculateCartTotal = () => {
    return cart.items.reduce((total, item) => total + calculateItemTotal(item), 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/carts">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Carts
            </Link>
          </Button>
          <div>
            <h1 className="text-xl sm:text-3xl font-bold tracking-tight">
              Cart Details
            </h1>
            <p className="text-muted-foreground">
              {cart.user.name}'s Cart
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cart Items List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Cart Items ({cart.items.length})
              </CardTitle>
              <CardDescription>
                Items in this shopping cart
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.items.length > 0 ? (
                cart.items.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.productFlavorSize.productFlavor?.flavor?.color && (
                            <span className="inline-flex items-center gap-1 mr-1">
                              <span
                                className="w-3 h-3 rounded-full border inline-block"
                                style={{ backgroundColor: item.productFlavorSize.productFlavor.flavor.color }}
                              />
                              {item.productFlavorSize.productFlavor.flavor.name}
                            </span>
                          )}
                          • {item.productFlavorSize.size?.name}kg
                        </p>
                        
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span>Price: ${item.productFlavorSize.price.toFixed(2)}</span>
                          <span>Stock: {item.productFlavorSize.stock}</span>
                        </div>
                        {/* {item.productFlavorSize.productFlavor?.flavor?.color && (
                          <div className="flex items-center gap-2 mt-1">
                            <div
                              className="w-3 h-3 rounded-full border"
                              style={{ backgroundColor: item.productFlavorSize.productFlavor.flavor.color }}
                            />
                            <span className="text-xs text-muted-foreground">
                              {item.productFlavorSize.productFlavor.flavor.name}
                            </span>
                          </div>
                        )} */}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <Label htmlFor={`quantity-${item.id}`} className="text-sm">
                            Qty:
                          </Label>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id.toString(), quantities[item.id.toString()] - 1)}
                              disabled={quantities[item.id.toString()] <= 1}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <Input
                              id={`quantity-${item.id}`}
                              type="number"
                              value={quantities[item.id.toString()] || item.quantity}
                              onChange={(e) => handleQuantityChange(item.id.toString(), parseInt(e.target.value) || 1)}
                              className="w-16 text-center"
                              min="1"
                              max={item.productFlavorSize.stock}
                            />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuantityChange(item.id.toString(), quantities[item.id.toString()] + 1)}
                              disabled={quantities[item.id.toString()] >= item.productFlavorSize.stock}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.id.toString())}
                          disabled={updateCartItemMutation.isPending || quantities[item.id.toString()] === item.quantity}
                        >
                          {updateCartItemMutation.isPending ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Edit className="w-3 h-3" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteCartItem(item.id.toString())}
                          disabled={deleteCartItemMutation.isPending}
                          className="text-red-600 hover:text-red-700"
                        >
                          {deleteCartItemMutation.isPending ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Trash2 className="w-3 h-3" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <Separator className="my-3" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                       Modified:  {formatDateTime(item.updatedAt)}
                      </span>
                      <span className="font-medium">
                        Total: ${calculateItemTotal(item).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p>No items in this cart</p>
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
                      image={cart.user.detail?.image || cart.user.detail?.profileImage}
                    />
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{cart.user.name}</h3>
                    <p className="text-sm text-muted-foreground">{cart.user.email}</p>
                    {cart.user.phoneNumber && (
                      <p className="text-xs text-muted-foreground">{cart.user.phoneNumber}</p>
                    )}
                  </div>
                </div>

                {cart.user.role && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Role</label>
                    <p className="text-sm capitalize">{cart.user.role}</p>
                  </div>
                )}
                {cart.user.detail?.address && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Address</label>
                    <p className="text-sm">
                      {cart.user.detail.address}
                      {cart.user.detail.road && `, ${cart.user.detail.road}`}
                      {cart.user.detail.city && `, ${cart.user.detail.city}`}
                    </p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Member Since</label>
                  <p className="text-sm">{formatDateTime(cart.user.createdAt || '')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cart Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Cart Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Items:</span>
                  <span className="font-medium">{cart.items.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Amount:</span>
                  <span className="font-medium text-lg">${calculateCartTotal().toFixed(2)}</span>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created</label>
                  <p className="text-sm">{formatDateTime(cart.createdAt)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                  <p className="text-sm">{formatDateTime(cart.updatedAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
