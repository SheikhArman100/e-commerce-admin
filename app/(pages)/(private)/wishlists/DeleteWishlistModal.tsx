'use client';

import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useDeleteWishlist } from '@/hooks/useWishlists';
import { IWishlist } from '@/types/wishlist.types';

interface DeleteWishlistModalProps {
  wishlist: IWishlist;
  trigger?: React.ReactNode;
}

export default function DeleteWishlistModal({
  wishlist,
  trigger,
}: DeleteWishlistModalProps) {
  const [open, setOpen] = useState(false);
  const deleteWishlistMutation = useDeleteWishlist();

  const handleDelete = async () => {
    try {
      await deleteWishlistMutation.mutateAsync(wishlist.id.toString());
      toast.success('Product removed from wishlist successfully!');
      setOpen(false);
    } catch (error: any) {
      console.error('Delete wishlist error:', error);
      toast.error(
        error?.response?.data?.message || 'Failed to remove product from wishlist. Please try again.'
      );
    }
  };

  const defaultTrigger = (
    <Button
      variant="outline"
      size="sm"
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  );

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {trigger || defaultTrigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove from Wishlist</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove{' '}
            <span className="font-semibold">"{wishlist.product.title}"</span> from{' '}
            <span className="font-semibold">{wishlist.user.name}'s</span> wishlist? This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteWishlistMutation.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {deleteWishlistMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Removing...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Remove
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
