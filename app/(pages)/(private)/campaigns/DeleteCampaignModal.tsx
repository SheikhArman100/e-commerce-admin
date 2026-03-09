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
import { useDeleteCampaign } from '@/hooks/useCampaigns';
import { ICampaign } from '@/types/campaign.types';

interface DeleteCampaignModalProps {
  campaign: ICampaign;
  trigger?: React.ReactNode;
}

export default function DeleteCampaignModal({
  campaign,
  trigger,
}: DeleteCampaignModalProps) {
  const [open, setOpen] = useState(false);
  const deleteCampaignMutation = useDeleteCampaign();

  const handleDelete = async () => {
    try {
      await deleteCampaignMutation.mutateAsync(campaign.id.toString());
      setOpen(false);
    } catch (error: any) {
      console.error('Delete campaign error:', error);
    }
  };

  const defaultTrigger = (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
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
          <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete{' '}
            <span className="font-semibold">"{campaign.title}"</span>? This action
            cannot be undone and will permanently remove the campaign and all its
            associated product discounts.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteCampaignMutation.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {deleteCampaignMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Campaign
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
