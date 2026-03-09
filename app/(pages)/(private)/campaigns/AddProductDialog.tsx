'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Search, Loader2 } from 'lucide-react';
import { useAddProductToCampaign } from '@/hooks/useCampaigns';
import { useProducts } from '@/hooks/useProducts';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';

export default function AddProductDialog({ campaignId }: { campaignId: string }) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [customDiscount, setCustomDiscount] = useState<string>('');

  const { data: productsData, isLoading: isLoadingProducts } = useProducts({ searchTerm, limit: 10 });
  const addProductMutation = useAddProductToCampaign();

  const handleAdd = async () => {
    if (!selectedProductId) return;

    try {
      await addProductMutation.mutateAsync({
        campaignId,
        data: {
          productId: selectedProductId,
          customDiscountPercentage: customDiscount ? parseFloat(customDiscount) : undefined,
        },
      });
      setOpen(false);
      setSelectedProductId(null);
      setCustomDiscount('');
      setSearchTerm('');
    } catch (error) {
      // Error handled by hook
    }
  };

  const products = (productsData?.data as any) || [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Product to Campaign</DialogTitle>
          <DialogDescription>
            Select a product to include in this campaign and optionally set a custom discount.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Product Search */}
          <div className="space-y-2">
            <Label>Search Product</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <ScrollArea className="h-[200px] border rounded-md mt-2 p-2">
              {isLoadingProducts ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : products.length > 0 ? (
                <div className="space-y-1">
                  {products.map((product: any) => {
                    const thumbnail = product.flavors?.[0]?.images?.[0]?.path;
                    const price = product.flavors?.[0]?.price || product.flavors?.[0]?.sizes?.[0]?.price || 0;

                    return (
                      <div
                        key={product.id}
                        onClick={() => setSelectedProductId(product.id)}
                        className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${
                          selectedProductId === product.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-transparent'
                        }`}
                      >
                        <div className="relative w-10 h-10 rounded overflow-hidden border">
                          {thumbnail ? (
                            <Image src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${thumbnail}`} alt={product.title} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gray-100" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{product.title}</p>
                          <p className="text-xs text-muted-foreground">৳{price.toLocaleString()}</p>
                        </div>
                        {selectedProductId === product.id && (
                          <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px]">✓</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  No products found
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Custom Discount */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customDiscount">Custom Discount (%) <span className="text-xs text-muted-foreground font-normal">(Optional)</span></Label>
              <Input
                id="customDiscount"
                type="number"
                placeholder="Leave blank for campaign default"
                value={customDiscount}
                onChange={(e) => setCustomDiscount(e.target.value)}
                min="0"
                max="100"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700" 
            onClick={handleAdd}
            disabled={addProductMutation.isPending || !selectedProductId}
          >
            {addProductMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Add to Campaign
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
