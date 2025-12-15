
"use client";
import React, { useState, useEffect } from 'react';

import RegionWiseAchievement from './RegionWiseAchievement';
import { chartData } from '../../../data/chartData';
import Section2Filter from './section2Filter';
import Section2Metrics from './Section2Metrics';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterData {
  campaign: FilterOption | null;
}

const Section2 = () => {
  const [filters, setFilters] = useState<FilterData>({
    campaign: null,
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

    setFilteredData(filtered);
  }, [filters]);

  return (
    <div className="w-full">
      <Section2Filter onFilterChange={handleFilterChange} />
      <div className="my-6">
        <Section2Metrics data={filteredData} />
      </div>
      <div className="mt-6">
        <RegionWiseAchievement data={filteredData} filters={filters} />
      </div>
    </div>
  );
};

export default Section2;
