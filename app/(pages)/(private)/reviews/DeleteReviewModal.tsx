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
import { useDeleteReview } from '@/hooks/useReviews';
import { IReview } from '@/types/review.types';

interface DeleteReviewModalProps {
  review: IReview;
  trigger?: React.ReactNode;
}

export default function DeleteReviewModal({
  review,
  trigger,
}: DeleteReviewModalProps) {
  const [open, setOpen] = useState(false);
  const deleteReviewMutation = useDeleteReview();

  const handleDelete = async () => {
    try {
      await deleteReviewMutation.mutateAsync(review.id.toString());
      toast.success('Review deleted successfully!');
      setOpen(false);
      // Redirect to reviews list after deletion
      window.location.href = '/reviews';
    } catch (error: any) {
      console.error('Delete review error:', error);
      toast.error(
        error?.response?.data?.message || 'Failed to delete review. Please try again.'
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
          <AlertDialogTitle>Delete Review</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the review by{' '}
            <span className="font-semibold">"{review.user.name}"</span> for{' '}
            <span className="font-semibold">"{review.product.title}"</span>? This action
            cannot be undone and will permanently remove the review and all its
            associated data including images.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteReviewMutation.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {deleteReviewMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Review
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}