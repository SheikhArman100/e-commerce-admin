'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Campaign } from '@/types';
import { useCampaigns, useDeleteCampaign, useUpdateCampaignStatus } from '@/hooks/useCampaigns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ScreenLoader } from '@/components/screen-loader';
import { Plus, Trash2, FileText } from 'lucide-react';

const CampaignListView: React.FC<{
    campaigns: Campaign[];
    onSelectCampaign: (id: string) => void;
    onCreateCampaign: () => void;
    onDeleteCampaign: (id: string) => void;
    onUpdateCampaignStatus: (id: string, status: 'active' | 'inactive') => void;
    isDeleting: boolean;
    isUpdating: boolean;
}> = ({ campaigns, onSelectCampaign, onCreateCampaign, onDeleteCampaign, onUpdateCampaignStatus, isDeleting, isUpdating }) => {
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

    const filteredCampaigns = campaigns.filter(c => statusFilter === 'all' || c.status === statusFilter);

    const StatusToggle: React.FC<{ campaign: Campaign }> = ({ campaign }) => {
        const handleToggle = (checked: boolean) => {
            onUpdateCampaignStatus(campaign.id, checked ? 'active' : 'inactive');
        };

        return (
            <Switch
                checked={campaign.status === 'active'}
                onCheckedChange={handleToggle}
                disabled={isUpdating}
            />
        );
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
                <div className="space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Campaigns</h1>
                    <p className="text-sm sm:text-base text-muted-foreground">Manage your marketing campaigns</p>
                </div>
                <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                    <div className="flex items-center space-x-1 bg-muted p-1 rounded-lg self-start sm:self-auto">
                        <Button
                            variant={statusFilter === 'all' ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => setStatusFilter('all')}
                            className="text-xs sm:text-sm"
                        >
                            All
                        </Button>
                        <Button
                            variant={statusFilter === 'active' ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => setStatusFilter('active')}
                            className="text-xs sm:text-sm"
                        >
                            Active
                        </Button>
                        <Button
                            variant={statusFilter === 'inactive' ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => setStatusFilter('inactive')}
                            className="text-xs sm:text-sm"
                        >
                            Inactive
                        </Button>
                    </div>
                    <Button onClick={onCreateCampaign} className="w-full sm:w-auto">
                        <Plus className="w-4 h-4 mr-2" />
                        <span className="hidden sm:inline">Create New Campaign</span>
                        <span className="sm:hidden">Create</span>
                    </Button>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="w-full overflow-x-scroll">
                        <Table className='w-full'>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="">Campaign Name</TableHead>
                                    <TableHead className="">Steps</TableHead>
                                    <TableHead className="">Status</TableHead>
                                    <TableHead className=" hidden sm:table-cell">Last Modified</TableHead>
                                    <TableHead className="">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className=''>
                                {filteredCampaigns.map(campaign => (
                                    <TableRow key={campaign.id} className="cursor-pointer hover:bg-muted/50">
                                        <TableCell className="font-medium">
                                            <Link
                                                href={`/campaign/${campaign.id}`}
                                                className="hover:underline block truncate max-w-[200px] sm:max-w-none"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {campaign.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <FileText className="w-4 h-4 flex-shrink-0" />
                                                <span className="text-sm">{campaign.steps.length}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                                                <StatusToggle campaign={campaign} />
                                                <Badge
                                                    variant={campaign.status === 'active' ? 'primary' : 'secondary'}
                                                    className="text-xs w-fit"
                                                >
                                                    {campaign.status === 'active' ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm hidden sm:table-cell">
                                            <div className="text-xs sm:text-sm">
                                                {new Date(campaign.lastModified).toLocaleDateString()}
                                                <br className="hidden sm:block" />
                                                <span className="sm:hidden"> </span>
                                                {new Date(campaign.lastModified).toLocaleTimeString([], {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                        <Trash2 className="w-4 h-4" />
                                                        <span className="sr-only">Delete campaign</span>
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent className="sm:max-w-[425px]">
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Are you sure you want to delete "{campaign.name}"? This action cannot be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                                                        <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => onDeleteCampaign(campaign.id)}
                                                            disabled={isDeleting}
                                                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full sm:w-auto"
                                                        >
                                                            Delete
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default function CampaignList() {
    const router = useRouter();
    const { data: campaigns = [], isLoading, error } = useCampaigns();
    const deleteCampaignMutation = useDeleteCampaign();
    const updateStatusMutation = useUpdateCampaignStatus();

    const handleSelectCampaign = useCallback((id: string) => {
        router.push(`/campaign/${id}`);
    }, [router]);

    const handleCreateCampaign = useCallback(() => {
        router.push('/campaign/create-campaign');
    }, [router]);

    const handleDeleteCampaign = useCallback((id: string) => {
        deleteCampaignMutation.mutate(id);
    }, [deleteCampaignMutation]);

    const handleUpdateCampaignStatus = useCallback((id: string, status: 'active' | 'inactive') => {
        updateStatusMutation.mutate({ id, status });
    }, [updateStatusMutation]);

    if (isLoading) {
        return <ScreenLoader title="Loading campaigns" />;
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px] px-4">
                <div className="text-center">
                    <div className="text-lg sm:text-xl text-destructive font-medium mb-2">
                        Error loading campaigns
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Please try refreshing the page or contact support if the problem persists.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <CampaignListView
            campaigns={campaigns}
            onSelectCampaign={handleSelectCampaign}
            onCreateCampaign={handleCreateCampaign}
            onDeleteCampaign={handleDeleteCampaign}
            onUpdateCampaignStatus={handleUpdateCampaignStatus}
            isDeleting={deleteCampaignMutation.isPending}
            isUpdating={updateStatusMutation.isPending}
        />
        
    );
}
