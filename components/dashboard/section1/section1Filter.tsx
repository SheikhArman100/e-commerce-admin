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
  region: FilterOption | null;
  area: FilterOption | null;
  distributionHouse: FilterOption | null;
  territory: FilterOption | null;
  point: FilterOption | null;
}

// Utility functions to generate options from chartData
const getUniqueValues = (data: any[], key: string): FilterOption[] => {
  const unique = Array.from(new Set(data.map(item => item[key])));
  return unique.map(value => ({ value: String(value), label: String(value) }));
};

const getFilteredOptions = (data: any[], filterKey: string, filterValue: string, optionKey: string): FilterOption[] => {
  const filtered = data.filter(item => item[filterKey] === filterValue);
  return getUniqueValues(filtered, optionKey);
};

interface Section1FilterProps {
  onFilterChange: (filters: FilterChangeData) => void;
}

const Section1Filter: React.FC<Section1FilterProps> = ({ onFilterChange }) => {
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedDistributionHouse, setSelectedDistributionHouse] = useState('');
  const [selectedTerritory, setSelectedTerritory] = useState('');
  const [selectedPoint, setSelectedPoint] = useState('');

  // Generate options from chartData
  const campaignOptions = getUniqueValues(chartData, 'campaign');
  const regionOptions = selectedCampaign
    ? getFilteredOptions(chartData, 'campaign', selectedCampaign, 'region')
    : getUniqueValues(chartData, 'region');
  const areaOptions = selectedRegion
    ? getFilteredOptions(chartData, 'region', selectedRegion, 'area')
    : [];
  const distributionHouseOptions = selectedArea
    ? getFilteredOptions(chartData, 'area', selectedArea, 'distributionHouse')
    : [];
  const territoryOptions = selectedDistributionHouse
    ? getFilteredOptions(chartData, 'distributionHouse', selectedDistributionHouse, 'territory')
    : [];
  const pointOptions = selectedTerritory
    ? getFilteredOptions(chartData, 'territory', selectedTerritory, 'point')
    : [];

  const handleCampaignChange = (value: string) => {
    setSelectedCampaign(value);
    // Reset dependent filters when campaign changes
    if (value !== selectedCampaign) {
      setSelectedRegion('');
      setSelectedArea('');
      setSelectedDistributionHouse('');
      setSelectedTerritory('');
      setSelectedPoint('');
    }
  };

  const handleRegionChange = (value: string) => {
    setSelectedRegion(value);
    // Reset dependent filters when region changes
    if (value !== selectedRegion) {
      setSelectedArea('');
      setSelectedDistributionHouse('');
      setSelectedTerritory('');
      setSelectedPoint('');
    }
  };

  const handleAreaChange = (value: string) => {
    setSelectedArea(value);
    // Reset dependent filters when area changes
    if (value !== selectedArea) {
      setSelectedDistributionHouse('');
      setSelectedTerritory('');
      setSelectedPoint('');
    }
  };

  const handleDistributionHouseChange = (value: string) => {
    setSelectedDistributionHouse(value);
    // Reset dependent filters when distribution house changes
    if (value !== selectedDistributionHouse) {
      setSelectedTerritory('');
      setSelectedPoint('');
    }
  };

  const handleTerritoryChange = (value: string) => {
    setSelectedTerritory(value);
    // Reset dependent filters when territory changes
    if (value !== selectedTerritory) {
      setSelectedPoint('');
    }
  };

  const handlePointChange = (value: string) => {
    setSelectedPoint(value);
  };

  const handleFind = () => {
    onFilterChange({
      campaign: selectedCampaign ? { value: selectedCampaign, label: selectedCampaign } : null,
      region: selectedRegion ? { value: selectedRegion, label: selectedRegion } : null,
      area: selectedArea ? { value: selectedArea, label: selectedArea } : null,
      distributionHouse: selectedDistributionHouse ? { value: selectedDistributionHouse, label: selectedDistributionHouse } : null,
      territory: selectedTerritory ? { value: selectedTerritory, label: selectedTerritory } : null,
      point: selectedPoint ? { value: selectedPoint, label: selectedPoint } : null,
    });
  };

  const handleReset = () => {
    setSelectedCampaign('');
    setSelectedRegion('');
    setSelectedArea('');
    setSelectedDistributionHouse('');
    setSelectedTerritory('');
    setSelectedPoint('');
    onFilterChange({
      campaign: null,
      region: null,
      area: null,
      distributionHouse: null,
      territory: null,
      point: null,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Select value={selectedCampaign} onValueChange={handleCampaignChange}>
          <SelectTrigger>
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

        <Select value={selectedRegion} onValueChange={handleRegionChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select Region" />
          </SelectTrigger>
          <SelectContent>
            {regionOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedArea}
          onValueChange={handleAreaChange}
          disabled={!selectedRegion}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Area" />
          </SelectTrigger>
          <SelectContent>
            {areaOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedDistributionHouse}
          onValueChange={handleDistributionHouseChange}
          disabled={!selectedArea}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Distribution House" />
          </SelectTrigger>
          <SelectContent>
            {distributionHouseOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedTerritory}
          onValueChange={handleTerritoryChange}
          disabled={!selectedDistributionHouse}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Territory" />
          </SelectTrigger>
          <SelectContent>
            {territoryOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedPoint}
          onValueChange={handlePointChange}
          disabled={!selectedTerritory}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Point" />
          </SelectTrigger>
          <SelectContent>
            {pointOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Mobile: 2-column grid for buttons, Desktop: flex row */}
      <div className="grid grid-cols-2 gap-2 sm:flex sm:justify-end sm:gap-2 mb-2">
        <Button onClick={handleFind} variant="primary" size="md" className="w-full sm:w-auto md:py-2 md:px-6 xl:px-12">
          <Search className="w-5 h-5 mr-2" />
          Find
        </Button>
        <Button onClick={handleReset} variant="outline" size="md" className="w-full sm:w-auto md:py-2 md:px-6 xl:px-12">
          <RotateCcw className="w-5 h-5 mr-2" />
          Reset
        </Button>
      </div>
    </div>
  );
};

export default Section1Filter;
