'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">WhatsApp Business</h1>
                <p className="text-muted-foreground">Manage WhatsApp Business messaging and campaigns</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        <MessageCircle className="w-5 h-5" />
                        <span>WhatsApp Integration</span>
                    </CardTitle>
                    <CardDescription>
                        Configure WhatsApp Business API and manage automated messaging
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-96 flex items-center justify-center text-muted-foreground">
                        WhatsApp Business features coming soon...
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
