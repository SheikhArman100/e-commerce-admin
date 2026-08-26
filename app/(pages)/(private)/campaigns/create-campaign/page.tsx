'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { useCreateCampaign } from '@/hooks/useCampaigns';
import { createCampaignSchema, CreateCampaignFormData } from '@/validation/campaign.validation';
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

export default function CreateCampaignPage() {
  const router = useRouter();
  const createCampaignMutation = useCreateCampaign();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateCampaignFormData>({
    resolver: zodResolver(createCampaignSchema) as any,
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      discountDefault: 0,
      startDate: '',
      endDate: '',
      isActive: true,
    },
  });

  const title = watch('title');

  // Auto-generate slug from title
  React.useEffect(() => {
    if (title) {
      const slug = title
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
      setValue('slug', slug, { shouldValidate: true });
    }
  }, [title, setValue]);

  const handleCreateCampaign = async (values: CreateCampaignFormData) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('slug', values.slug);
    if (values.description) formData.append('description', values.description);
    formData.append('discountDefault', values.discountDefault.toString());
    formData.append('startDate', values.startDate);
    formData.append('endDate', values.endDate);
    formData.append('isActive', values.isActive.toString());
    
    if (selectedFile) {
      formData.append('file', selectedFile);
    }

    try {
      await createCampaignMutation.mutateAsync(formData);
      router.push('/campaigns');
    } catch (error) {
      // Error handled by hook
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start gap-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/campaigns">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to List
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Campaign</h1>
            <p className="text-muted-foreground">Define a new promotional event and banner</p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-5xl">
        <form onSubmit={handleSubmit(handleCreateCampaign)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Info */}
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
                    placeholder="Enter a brief summary of the campaign..."
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

            {/* Banner & Schedule */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Banner</CardTitle>
                  <CardDescription>Upload a promotional image</CardDescription>
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
                    placeholder="Upload Campaign Banner"
                  />
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
            <Button type="submit" disabled={createCampaignMutation.isPending} className="px-8">
              {createCampaignMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Campaign
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.push('/campaigns')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
