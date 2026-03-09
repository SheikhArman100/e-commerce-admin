'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { useCampaign, useUpdateCampaign } from '@/hooks/useCampaigns';
import { updateCampaignSchema, UpdateCampaignFormData } from '@/validation/campaign.validation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import TextInput from '@/components/input/TextInput';
import TextAreaInput from '@/components/input/TextAreaInput';
import DateInput from '@/components/input/DateInput';
import Link from 'next/link';
import FileUpload from '@/components/input/FileUpload';
import { ScreenLoader } from '@/components/screen-loader';
import Image from 'next/image';

export default function UpdateCampaignPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.campaignId as string;
  
  const { data: campaign, isLoading: isLoadingCampaign } = useCampaign(campaignId);
  const updateCampaignMutation = useUpdateCampaign();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<UpdateCampaignFormData>({
    resolver: zodResolver(updateCampaignSchema as any),
  });

  React.useEffect(() => {
    if (campaign) {
      reset({
        title: campaign.title,
        slug: campaign.slug,
        description: campaign.description,
        discountDefault: campaign.discountDefault,
        startDate: campaign.startDate ? new Date(campaign.startDate).toISOString().split('T')[0] : '',
        endDate: campaign.endDate ? new Date(campaign.endDate).toISOString().split('T')[0] : '',
        isActive: campaign.isActive,
      });
    }
  }, [campaign, reset]);

  const handleUpdateCampaign = async (values: UpdateCampaignFormData) => {
    const formData = new FormData();
    if (values.title) formData.append('title', values.title);
    if (values.slug) formData.append('slug', values.slug);
    if (values.description !== undefined) formData.append('description', values.description);
    if (values.discountDefault !== undefined) formData.append('discountDefault', values.discountDefault.toString());
    if (values.startDate) formData.append('startDate', values.startDate);
    if (values.endDate) formData.append('endDate', values.endDate);
    if (values.isActive !== undefined) formData.append('isActive', values.isActive.toString());
    
    if (selectedFile) {
      formData.append('file', selectedFile);
    }

    try {
      await updateCampaignMutation.mutateAsync({ id: campaignId, data: formData });
      router.push(`/campaigns/${campaignId}`);
    } catch (error) {
      // Error handled by hook
    }
  };

  if (isLoadingCampaign) return <ScreenLoader title="Loading campaign..." />;

  if (!campaign) {
    return (
      <div className="flex items-center justify-center h-64 text-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-600 mb-2">Campaign Not Found</h2>
          <Button asChild variant="outline">
            <Link href="/campaigns"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Campaigns</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start gap-4">
          <Button asChild variant="outline" size="sm">
            <Link href={`/campaigns/${campaignId}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Details
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Update Campaign</h1>
            <p className="text-muted-foreground">Edit promotional settings for <strong>{campaign.title}</strong></p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl">
        <form onSubmit={handleSubmit(handleUpdateCampaign)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>General Information</CardTitle>
                <CardDescription>Basic details about the campaign</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TextInput
                    label="Campaign Title"
                    placeholder="e.g. Eid-ul-Fitr Mega Sale"
                    name="title"
                    register={register}
                    errors={errors.title?.message}
                  />

                  <TextInput
                    label="Slug"
                    placeholder="eid-sale-2024"
                    name="slug"
                    register={register}
                    errors={errors.slug?.message}
                  />
                  
                  <TextAreaInput
                    label="Description (Optional)"
                    placeholder="Enter details about this sale event..."
                    name="description"
                    register={register}
                    errors={errors.description?.message}
                    className="md:col-span-2"
                  />

                  <TextInput
                    label="Default Discount (%)"
                    type="number"
                    placeholder="0"
                    name="discountDefault"
                    register={register}
                    errors={errors.discountDefault?.message}
                  />

                  <div className="space-y-2">
                    <Label>Status</Label>
                    <div className="flex items-center space-x-2 pt-2">
                      <Controller
                        name="isActive"
                        control={control}
                        render={({ field }) => (
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        )}
                      />
                      <Label className="text-sm font-normal">Active</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Update Banner</CardTitle>
                  <CardDescription>Replacing the image will delete the previous one automatically</CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUpload
                    value={selectedFile}
                    onChange={(files: File | File[] | null) => {
                      if (Array.isArray(files)) {
                        setSelectedFile(files[0] || null);
                      } else {
                        setSelectedFile(files);
                      }
                    }}
                    accept="image/*"
                    maxSize={5}
                    placeholder="Upload New Banner"
                  />
                  {campaign.bannerImage && !selectedFile && (
                    <div className="mt-4">
                      <p className="text-xs text-muted-foreground mb-2 italic text-center">Current banner preview:</p>
                      <div className="relative w-full aspect-video rounded border overflow-hidden">
                        <Image src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${campaign.bannerImage}`} alt="Current banner" fill className="object-cover" />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Schedule</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <DateInput
                    label="Start Date"
                    name="startDate"
                    control={control}
                    errors={errors.startDate?.message}
                    placeholder="Select start date"
                  />

                  <DateInput
                    label="End Date"
                    name="endDate"
                    control={control}
                    errors={errors.endDate?.message}
                    placeholder="Select end date"
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t">
            <Button type="submit" disabled={updateCampaignMutation.isPending || (!isDirty && !selectedFile)} className="px-8">
              {updateCampaignMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push(`/campaigns/${campaignId}`)}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
