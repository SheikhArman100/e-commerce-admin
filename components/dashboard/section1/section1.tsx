
"use client";
import React, { useState, useEffect } from 'react';
import Section1Filter from './section1Filter';
import ContactTargetAchievement from './ContactTargetAchievement';
import TrialTargetAchievement from './TrialTargetAchievement';
import BrandWiseUserContact from './BrandWiseUserContact';
import BrandWiseUserTrial from './BrandWiseUserTrial';
import { chartData } from '../../../data/chartData';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterData {
  campaign: FilterOption | null;
  region: FilterOption | null;
  area: FilterOption | null;
  distributionHouse: FilterOption | null;
  territory: FilterOption | null;
  point: FilterOption | null;
}

const Section1 = () => {
  const [filters, setFilters] = useState<FilterData>({
    campaign: null,
    region: null,
    area: null,
    distributionHouse: null,
    territory: null,
    point: null,
  });
  const [filteredData, setFilteredData] = useState(chartData);


  const handleFilterChange = (newFilters: FilterData) => {
    setFilters(newFilters);
  };

  useEffect(() => {
    let filtered = chartData;

    if (filters.campaign?.value) {
      filtered = filtered.filter(
        (item) => item.campaign === filters.campaign!.value
      );
    }

    if (filters.point?.value) {
      filtered = filtered.filter(
        (item) => item.point === filters.point!.value
      );
    } else if (filters.territory?.value) {
      filtered = filtered.filter(
        (item) => item.territory === filters.territory!.value
      );
    } else if (filters.distributionHouse?.value) {
      filtered = filtered.filter(
        (item) => item.distributionHouse === filters.distributionHouse!.value
      );
    } else if (filters.area?.value) {
      filtered = filtered.filter((item) => item.area === filters.area!.value);
    } else if (filters.region?.value) {
      filtered = filtered.filter(
        (item) => item.region === filters.region!.value
      );
    }

    setFilteredData(filtered);
  }, [filters]);

  return (
    <div className="w-full">
      <Section1Filter onFilterChange={handleFilterChange} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="w-full">
          <ContactTargetAchievement data={filteredData} filters={filters} />
        </div>
        <div className="w-full">
          <TrialTargetAchievement data={filteredData} filters={filters} />
        </div>
        <div className="w-full">
          <BrandWiseUserContact data={filteredData} filters={filters} />
        </div>
        <div className="w-full">
          <BrandWiseUserTrial data={filteredData} filters={filters} />
        </div>
      </div>
    </div>
  );
};

export default Section1;
