'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useCampaign, useRemoveProductFromCampaign } from '@/hooks/useCampaigns';
import { ScreenLoader } from '@/components/screen-loader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Edit, Trash2, Calendar, Megaphone, Percent, Package, ExternalLink, DollarSign, Clock, Hourglass } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import AddProductDialog from '../AddProductDialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// ---------------------------------------------------------------------------
// Price-range helpers
//
// A product can expose prices two ways: quantity-based flavors carry a direct
// `price`, while packaged flavors expose `sizes[].price`. The "original price
// range" spans the min..max across every variant, and the "final price range"
// applies the campaign discount to each variant's price.
//   - FIXED:      base − discountDefault (flat ৳ off; the custom % override
//                 does NOT apply to FIXED campaigns)
//   - PERCENTAGE: base × (1 − (customDiscountPercentage ?? discountDefault) / 100)
// ---------------------------------------------------------------------------
const computePriceRange = (
  flavors: any,
  discountType: 'PERCENTAGE' | 'FIXED',
  discountDefault: number,
  customDiscountPercentage?: number,
) => {
  const prices: number[] = [];

  (flavors || []).forEach((flavor: any) => {
    if (flavor.price != null) {
      const p = Number(flavor.price);
      if (!isNaN(p)) prices.push(p);
    }
    (flavor.sizes || []).forEach((size: any) => {
      const p = Number(size.price);
      if (!isNaN(p)) prices.push(p);
    });
  });

  if (prices.length === 0) return null;

  const toFinal = (base: number) =>
    discountType === 'FIXED'
      ? Math.max(base - discountDefault, 0)
      : base * (1 - (customDiscountPercentage ?? discountDefault) / 100);

  const finals = prices.map(toFinal);

  return {
    originalMin: Math.min(...prices),
    originalMax: Math.max(...prices),
    finalMin: Math.min(...finals),
    finalMax: Math.max(...finals),
  };
};

const formatPrice = (n: number) => `৳${n.toLocaleString()}`;

const formatPriceRange = (min: number, max: number) =>
  min === max ? formatPrice(min) : `${formatPrice(min)} – ${formatPrice(max)}`;

export default function CampaignDetailsPage() {
  const params = useParams();
  const campaignId = params.campaignId as string;

  const { data: campaign, isLoading, error } = useCampaign(campaignId);
  const removeProductMutation = useRemoveProductFromCampaign();

  /**
   * Lifecycle status — liveness is purely the isActive flag (dates are
   * display-only schedule info). Only ONE campaign can be active at a time.
   */
  const getLifecycle = () => {
    return campaign?.isActive
      ? { label: 'Active', dot: 'bg-green-400', badge: 'bg-green-100 text-green-700 border-green-200' }
      : { label: 'Inactive', dot: 'bg-gray-400', badge: 'bg-gray-100 text-gray-700 border-gray-200' };
  };

  const handleRemoveProduct = async (productId: number, productName: string) => {
    if (window.confirm(`Remove "${productName}" from this campaign?`)) {
      try {
        await removeProductMutation.mutateAsync({ campaignId, productId });
      } catch (err) {
        // Error handled by hook
      }
    }
  };

  if (isLoading) return <ScreenLoader title="Loading campaign details..." />;

  if (error || !campaign) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">Campaign Not Found</h2>
        <Button asChild variant="outline">
          <Link href="/campaigns"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Campaigns</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col items-start gap-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/campaigns"><ArrowLeft className="w-4 h-4 mr-2" /> Back to List</Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Megaphone className="w-8 h-8 text-blue-600" />
              Campaign: <span className="text-blue-700">{campaign.title}</span>
            </h1>
            <p className="text-muted-foreground">Overview of campaign performance and product associations</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href={`/campaigns/${campaignId}/update-campaign`}>
              <Edit className="w-4 h-4 mr-2" /> Edit Campaign
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Banner & Description */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Banner & Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {campaign.bannerImage ? (
              <div className="relative w-full aspect-[21/9] rounded-lg overflow-hidden border shadow-sm">
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${campaign.bannerImage}`}
                  alt={campaign.title}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-full aspect-[21/9] bg-gray-50 flex flex-col items-center justify-center rounded-lg border border-dashed text-muted-foreground gap-2">
                <Package className="w-10 h-10 opacity-20" />
                <span>No banner uploaded</span>
              </div>
            )}

            <div className="space-y-2">
              <h3 className="font-bold text-lg">Campaign Description</h3>
              <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {campaign.description || 'No description provided for this campaign.'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Status & Timing */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  {campaign.discountType === 'FIXED' ? (
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  ) : (
                    <Percent className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Default Discount {campaign.discountType === 'FIXED' ? '(Fixed Amount)' : '(Percentage)'}
                  </p>
                  <p className="text-2xl font-bold text-blue-700">
                    {campaign.discountType === 'FIXED'
                      ? `৳${campaign.discountDefault}`
                      : `${campaign.discountDefault}%`}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Duration</p>
                  <p className="font-semibold">{new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-muted-foreground mb-2">Lifecycle Status</p>
                {(() => {
                  const lifecycle = getLifecycle();
                  return (
                    <div className="space-y-2">
                      <Badge className={`px-4 py-1 font-bold gap-1.5 ${lifecycle.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${lifecycle.dot}`} />
                        {lifecycle.label.toUpperCase()}
                      </Badge>
                      {campaign.isActive ? (
                        (() => {
                          const daysLeft = Math.ceil(
                            (new Date(campaign.endDate).getTime() - Date.now()) / (24 * 60 * 60 * 1000)
                          );
                          // Schedule info only — dates don't drive campaign liveness
                          return daysLeft >= 0 ? (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Hourglass className="w-3 h-3" /> Scheduled to end in {daysLeft} day{daysLeft === 1 ? '' : 's'}
                            </p>
                          ) : (
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Schedule window has passed
                            </p>
                          );
                        })()
                      ) : (
                        <p className="text-xs text-muted-foreground">
                          Activate via Edit — only one campaign can be active at a time
                        </p>
                      )}
                    </div>
                  );
                })()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Associated Products */}
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5 text-gray-500" />
                Campaign Products
              </CardTitle>
              <CardDescription>Products currently included in this sale event</CardDescription>
            </div>
            <AddProductDialog campaignId={campaignId} />
          </CardHeader>
          <CardContent className="pt-6">
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[80px]">Product</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Original Price Range</TableHead>
                    <TableHead>Campaign Discount</TableHead>
                    <TableHead>Final Price Range</TableHead>
                    <TableHead className="text-right w-[100px]">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {campaign.products && campaign.products.length > 0 ? (
                    campaign.products.map((assoc) => {
                      const product = assoc.product;
                      const thumbnail = product?.flavors?.[0]?.images?.[0]?.path;
                      const priceRange = computePriceRange(
                        product?.flavors,
                        campaign.discountType,
                        campaign.discountDefault,
                        assoc.customDiscountPercentage,
                      );

                      return (
                        <TableRow key={assoc.id}>
                          <TableCell>
                            <div className="relative w-12 h-12 rounded border overflow-hidden">
                              {thumbnail ? (
                                <Image src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${thumbnail}`} alt={product?.title || 'Product'} fill className="object-cover" />
                              ) : (
                                <div className="w-full h-full bg-gray-100" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {product?.title}
                              <Link href={`/products/${assoc.productId}`} className="text-muted-foreground hover:text-blue-600">
                                <ExternalLink className="w-3 h-3" />
                              </Link>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-muted-foreground line-through">
                              {priceRange ? formatPriceRange(priceRange.originalMin, priceRange.originalMax) : 'N/A'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={assoc.customDiscountPercentage ? 'bg-amber-100 text-amber-700 hover:bg-amber-100' : 'bg-blue-100 text-blue-700 hover:bg-blue-100'}>
                              {campaign.discountType === 'FIXED'
                                ? `৳${campaign.discountDefault} off`
                                : `${assoc.customDiscountPercentage ?? campaign.discountDefault}% ${assoc.customDiscountPercentage ? '(Custom)' : '(Default)'}`}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-bold text-blue-600">
                            {priceRange ? formatPriceRange(priceRange.finalMin, priceRange.finalMax) : 'N/A'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleRemoveProduct(assoc.productId, product?.title || 'Product')}
                              disabled={removeProductMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                        No products associated with this campaign yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
