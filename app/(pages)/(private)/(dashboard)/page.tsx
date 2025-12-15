'use client';

import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Section1 from '@/components/dashboard/section1/section1';
import Section2 from '@/components/dashboard/section2/section2';

// Dynamically import ApexCharts to avoid SSR issues
const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});



export default function Dashboard() {


  const contactPieSeries = [450000, 350000, 250000, 200000];
  const trialPieSeries = [380000, 220000, 150000, 100000];

  const renderOverview = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="col-span-1 lg:col-span-3">
        {/* <MetricsOverview /> */}
        
          <div className="space-y-6">
            <Section1 />
            <Section2 />
            
          </div>
        
      </div>

      {/* <div className="col-span-1 space-y-4">
        <InsightsDiscovery />
      </div> */}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Monitor your campaign performance and analytics
        </p>
      </div>

      {renderOverview()}
    </div>
  );
}
