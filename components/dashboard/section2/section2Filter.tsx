import React, { useState } from 'react';
import { chartData } from '../../../data/chartData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, RotateCcw } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterChangeData {
  campaign: FilterOption | null;
}

// Utility functions to generate options from chartData
const getUniqueValues = (data: any[], key: string): FilterOption[] => {
  const unique = Array.from(new Set(data.map(item => item[key])));
  return unique.map(value => ({ value: String(value), label: String(value) }));
};

interface Section2FilterProps {
  onFilterChange: (filters: FilterChangeData) => void;
}

const Section2Filter: React.FC<Section2FilterProps> = ({ onFilterChange }) => {
  const [selectedCampaign, setSelectedCampaign] = useState('');

  // Generate options from chartData
  const campaignOptions = getUniqueValues(chartData, 'campaign');

  const handleCampaignChange = (value: string) => {
    setSelectedCampaign(value);
  };

  const handleFind = () => {
    onFilterChange({
      campaign: selectedCampaign ? { value: selectedCampaign, label: selectedCampaign } : null,
    });
  };

  const handleReset = () => {
    setSelectedCampaign('');
    onFilterChange({
      campaign: null,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={selectedCampaign} onValueChange={handleCampaignChange} >
          <SelectTrigger className="w-full max-w-xs">
            <SelectValue placeholder="Select Campaign" />
          </SelectTrigger>
          <SelectContent>
            {campaignOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
       <div className='flex items-center justify-between gap-2'>
         <Button onClick={handleFind} variant="primary" size="md" className="w-full md:py-2 md:px-6 xl:px-12">
          <Search className="w-5 h-5 mr-2" />
          Find
        </Button>
        <Button onClick={handleReset} variant="outline" size="md" className="w-full md:py-2 md:px-6 xl:px-12">
          <RotateCcw className="w-5 h-5 mr-2" />
          Reset
        </Button>
       </div>
      </div>

      {/* Mobile: Flex with gap, Desktop: flex row */}
     
    </div>
  );
};

export default Section2Filter;
