'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ICampaign, CampaignFilters } from '@/types/campaign.types';
import PaginationTable from '@/components/PaginationTable';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronUp, ChevronDown, Eye, Edit, Megaphone as CampaignIcon } from 'lucide-react';
import { formatDateTime, formatDate } from '@/lib/helpers';
import { useCampaigns, useDeleteCampaign } from '@/hooks/useCampaigns';
import Image from 'next/image';
import DeleteCampaignModal from './DeleteCampaignModal';

export default function CampaignsTable() {
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentLimit, setCurrentLimit] = useState<number>(10);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Parse query parameters
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const searchTerm = searchParams.get('searchTerm') || '';
  const isActive = searchParams.get('isActive') || '';
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';

  // Update currentLimit when limit changes
  React.useEffect(() => {
    setCurrentLimit(limit);
  }, [limit]);

  // Build filters object
  const filters: CampaignFilters = React.useMemo(() => ({
    page,
    limit,
    ...(searchTerm && { searchTerm }),
    ...(isActive !== '' && { isActive }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
    sortBy,
    sortOrder,
  }), [page, limit, searchTerm, isActive, startDate, endDate, sortBy, sortOrder]);

  const { data: campaignsData, isLoading, error } = useCampaigns(filters);
  const deleteMutation = useDeleteCampaign();

  const renderSkeletonRow = (index: number) => (
    <TableRow key={`skeleton-${index}`}>
      <TableCell className="font-medium">
        <div className="flex items-center space-x-2">
          <div className="h-10 w-16 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </TableCell>
      <TableCell>
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
      </TableCell>
      <TableCell>
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
      </TableCell>
      <TableCell className="text-right">
        <div className="h-8 w-24 bg-gray-200 ml-auto rounded animate-pulse"></div>
      </TableCell>
    </TableRow>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-400 ';
      case 'INACTIVE':
      default:
        return 'bg-gray-400 ';
    }
  };

  const handleLimitChange = (newLimit: number) => {
    const params = new URLSearchParams(searchParams);
    if (newLimit !== 10) {
      params.set('limit', newLimit.toString());
    } else {
      params.delete('limit');
    }
    params.delete('page');
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-600 mb-2">Error Loading Campaigns</h2>
          <Button onClick={() => window.location.reload()} variant="outline">Retry</Button>
        </div>
      </div>
    );
  }

  const campaigns: ICampaign[] = campaignsData?.data || [];
  const totalCount = campaignsData?.meta?.count || 0;

  return (
    <div>
      <div className="rounded-md border overflow-hidden">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer select-none hover:bg-muted/50 transition-colors w-[300px]"
                onClick={() => handleSort('title')}
              >
                <div className="flex items-center justify-between">
                  <span>Campaign</span>
                  <div className="flex flex-col">
                    <ChevronUp className={`w-3 h-3 ${sortBy === 'title' && sortOrder === 'asc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`} />
                    <ChevronDown className={`w-3 h-3 -mt-1 ${sortBy === 'title' && sortOrder === 'desc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`} />
                  </div>
                </div>
              </TableHead>
              <TableHead className="w-[150px]">Default Disc.</TableHead>
              <TableHead
                className="cursor-pointer select-none hover:bg-muted/50 transition-colors w-[150px]"
                onClick={() => handleSort('isActive')}
              >
                <div className="flex items-center justify-between">
                  <span>Status</span>
                  <div className="flex flex-col">
                    <ChevronUp className={`w-3 h-3 ${sortBy === 'isActive' && sortOrder === 'asc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`} />
                    <ChevronDown className={`w-3 h-3 -mt-1 ${sortBy === 'isActive' && sortOrder === 'desc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`} />
                  </div>
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none hover:bg-muted/50 transition-colors w-[220px]"
                onClick={() => handleSort('startDate')}
              >
                <div className="flex items-center justify-between">
                  <span>Duration</span>
                  <div className="flex flex-col">
                    <ChevronUp className={`w-3 h-3 ${sortBy === 'startDate' && sortOrder === 'asc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`} />
                    <ChevronDown className={`w-3 h-3 -mt-1 ${sortBy === 'startDate' && sortOrder === 'desc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`} />
                  </div>
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none hover:bg-muted/50 transition-colors w-[180px]"
                onClick={() => handleSort('updatedAt')}
              >
                <div className="flex items-center justify-between">
                  <span>Modified At</span>
                  <div className="flex flex-col">
                    <ChevronUp className={`w-3 h-3 ${sortBy === 'updatedAt' && sortOrder === 'asc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`} />
                    <ChevronDown className={`w-3 h-3 -mt-1 ${sortBy === 'updatedAt' && sortOrder === 'desc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`} />
                  </div>
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none hover:bg-muted/50 transition-colors w-[150px]"
                onClick={() => handleSort('updatedBy')}
              >
                <div className="flex items-center justify-between">
                  <span>Modified By</span>
                  <div className="flex flex-col">
                    <ChevronUp className={`w-3 h-3 ${sortBy === 'updatedBy' && sortOrder === 'asc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`} />
                    <ChevronDown className={`w-3 h-3 -mt-1 ${sortBy === 'updatedBy' && sortOrder === 'desc' ? 'text-foreground' : 'text-muted-foreground opacity-50'}`} />
                  </div>
                </div>
              </TableHead>
              <TableHead className="w-[120px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: limit }, (_, index) => renderSkeletonRow(index))
              : campaigns.length > 0
              ? campaigns.map((campaign) => (
                  <TableRow key={campaign.id.toString()}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="relative w-16 h-10 rounded-md overflow-hidden border bg-muted shrink-0">
                          {campaign.bannerImage ? (
                            <Image
                              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${campaign.bannerImage}`}
                              alt={campaign.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <CampaignIcon className="w-4 h-4 text-muted-foreground opacity-20" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/campaigns/${campaign.id}`}
                            className="font-medium hover:text-blue-800 hover:underline block truncate"
                          >
                            {campaign.title}
                          </Link>
                          <p className="text-xs text-muted-foreground font-mono truncate">
                            {campaign.slug}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-blue-700">
                      {campaign.discountDefault}%
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${getStatusColor(campaign.isActive ? 'ACTIVE' : 'INACTIVE')}`}
                        ></span>
                        <span className="text-sm text-muted-foreground">
                          {campaign.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="flex flex-col">
                        <span>{formatDate(campaign.startDate)}</span>
                        <span className="text-muted-foreground text-xs">to {formatDate(campaign.endDate)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDateTime(campaign.updatedAt)}
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="flex flex-col">
                        <span className="font-medium truncate max-w-[130px]">
                          {campaign.updater ? campaign.updater.name : campaign.creator.name}
                        </span>
                        <span className="text-muted-foreground text-[10px] truncate max-w-[130px]">
                          {campaign.updater ? campaign.updater.email : campaign.creator.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                          <Link href={`/campaigns/${campaign.id}`}>
                            <Eye className="w-4 h-4 text-blue-600" />
                          </Link>
                        </Button>
                        <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                          <Link href={`/campaigns/${campaign.id}/update-campaign`}>
                            <Edit className="w-4 h-4 text-amber-600" />
                          </Link>
                        </Button>
                        <DeleteCampaignModal campaign={campaign} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground h-80"
                  >
                    No campaigns found
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
      </div>

      {campaigns.length > 0 && (
        <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-3">
          <div className="text-sm font-medium text-gray-600 flex items-center gap-2">
            Showing
            <input
              type="number"
              value={totalCount && (currentLimit > totalCount) ? totalCount : currentLimit}
              onChange={(e) => setCurrentLimit(parseInt(e.target.value) || 10)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const value = parseInt((e.target as HTMLInputElement).value) || 10;
                  handleLimitChange(value);
                }
              }}
              className="w-16 px-2 py-1 border rounded text-center"
              min="1"
              max="100"
            />
            of {totalCount} Records
          </div>
          <PaginationTable count={totalCount} limit={limit} />
        </div>
      )}
    </div>
  );
}
