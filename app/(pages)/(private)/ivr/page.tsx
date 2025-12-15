'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone } from 'lucide-react';

export default function IVRPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">IVR Management</h1>
                <p className="text-muted-foreground">Manage Interactive Voice Response systems</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <Phone className="w-5 h-5" />
                        <span>IVR System</span>
                    </CardTitle>
                    <CardDescription>
                        Configure and manage your IVR workflows and voice interactions
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-96 flex items-center justify-center text-muted-foreground">
                        IVR management features coming soon...
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
