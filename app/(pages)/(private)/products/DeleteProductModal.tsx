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
import { useDeleteProduct } from '@/hooks/useProducts';
import { IProduct } from '@/types/product.types';

interface DeleteProductModalProps {
  product: IProduct;
  trigger?: React.ReactNode;
}

export default function DeleteProductModal({
  product,
  trigger,
}: DeleteProductModalProps) {
  const [open, setOpen] = useState(false);
  const deleteProductMutation = useDeleteProduct();

  const handleDelete = async () => {
    try {
      await deleteProductMutation.mutateAsync(product.id.toString());
      toast.success('Product deleted successfully!');
      setOpen(false);
    } catch (error: any) {
      console.error('Delete product error:', error);
      toast.error(
        error?.response?.data?.message || 'Failed to delete product. Please try again.'
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
          <AlertDialogTitle>Delete Product</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{' '}
            <span className="font-semibold">"{product.title}"</span>? This action
            cannot be undone and will permanently remove the product and all its
            associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteProductMutation.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {deleteProductMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Product
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
