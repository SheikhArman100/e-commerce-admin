import React from 'react';
import dynamic from 'next/dynamic';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ChartDataItem {
  trialAchievement: number;
  trialTarget: number;
}

interface Props {
  data: any[];
  filters: any;
}

const TrialTargetAchievement: React.FC<Props> = ({ data, filters }) => {
  const getChartData = () => {
    if (filters.point?.value) {
      const brandData = data.reduce((acc, item) => {
        if (!acc[item.brand]) {
          acc[item.brand] = {
            trialAchievement: 0,
            trialTarget: 0,
          };
        }
        acc[item.brand].trialAchievement += item.trialAchievement;
        acc[item.brand].trialTarget += item.trialTarget;
        return acc;
      }, {});

      return {
        categories: Object.keys(brandData),
        series: [
          {
            name: 'Trial Achievement',
            data: (Object.values(brandData) as ChartDataItem[]).map(
              (item) => item.trialAchievement
            ),
            color: '#8b5cf6',
          },
          {
            name: 'Trial Target',
            data: (Object.values(brandData) as ChartDataItem[]).map(
              (item) => item.trialTarget
            ),
            color: '#c4b5fd',
          },
        ],
      };
    }

    if (filters.territory?.value) {
      const pointData = data.reduce((acc, item) => {
        if (!acc[item.point]) {
          acc[item.point] = {
            trialAchievement: 0,
            trialTarget: 0,
          };
        }
        acc[item.point].trialAchievement += item.trialAchievement;
        acc[item.point].trialTarget += item.trialTarget;
        return acc;
      }, {});

      return {
        categories: Object.keys(pointData),
        series: [
          {
            name: 'Trial Achievement',
            data: (Object.values(pointData) as ChartDataItem[]).map(
              (item) => item.trialAchievement
            ),
            color: '#8b5cf6',
          },
          {
            name: 'Trial Target',
            data: (Object.values(pointData) as ChartDataItem[]).map(
              (item) => item.trialTarget
            ),
            color: '#c4b5fd',
          },
        ],
      };
    }

    if (filters.distributionHouse?.value) {
      const territoryData = data.reduce((acc, item) => {
        if (!acc[item.territory]) {
          acc[item.territory] = {
            trialAchievement: 0,
            trialTarget: 0,
          };
        }
        acc[item.territory].trialAchievement += item.trialAchievement;
        acc[item.territory].trialTarget += item.trialTarget;
        return acc;
      }, {});

      return {
        categories: Object.keys(territoryData),
        series: [
          {
            name: 'Trial Achievement',
            data: (Object.values(territoryData) as ChartDataItem[]).map(
              (item) => item.trialAchievement
            ),
            color: '#8b5cf6',
          },
          {
            name: 'Trial Target',
            data: (Object.values(territoryData) as ChartDataItem[]).map(
              (item) => item.trialTarget
            ),
            color: '#c4b5fd',
          },
        ],
      };
    }

    if (filters.area?.value) {
      const distributionHouseData = data.reduce((acc, item) => {
        if (!acc[item.distributionHouse]) {
          acc[item.distributionHouse] = {
            trialAchievement: 0,
            trialTarget: 0,
          };
        }
        acc[item.distributionHouse].trialAchievement += item.trialAchievement;
        acc[item.distributionHouse].trialTarget += item.trialTarget;
        return acc;
      }, {});

      return {
        categories: Object.keys(distributionHouseData),
        series: [
          {
            name: 'Trial Achievement',
            data: (Object.values(distributionHouseData) as ChartDataItem[]).map(
              (item) => item.trialAchievement
            ),
            color: '#8b5cf6',
          },
          {
            name: 'Trial Target',
            data: (Object.values(distributionHouseData) as ChartDataItem[]).map(
              (item) => item.trialTarget
            ),
            color: '#c4b5fd',
          },
        ],
      };
    }

    if (filters.region?.value) {
      const areaData = data.reduce((acc, item) => {
        if (!acc[item.area]) {
          acc[item.area] = {
            trialAchievement: 0,
            trialTarget: 0,
          };
        }
        acc[item.area].trialAchievement += item.trialAchievement;
        acc[item.area].trialTarget += item.trialTarget;
        return acc;
      }, {});

      return {
        categories: Object.keys(areaData),
        series: [
          {
            name: 'Trial Achievement',
            data: (Object.values(areaData) as ChartDataItem[]).map(
              (item) => item.trialAchievement
            ),
            color: '#8b5cf6',
          },
          {
            name: 'Trial Target',
            data: (Object.values(areaData) as ChartDataItem[]).map(
              (item) => item.trialTarget
            ),
            color: '#c4b5fd',
          },
        ],
      };
    }

    const regionalData = data.reduce((acc, item) => {
      if (!acc[item.region]) {
        acc[item.region] = {
          trialAchievement: 0,
          trialTarget: 0,
        };
      }
      acc[item.region].trialAchievement += item.trialAchievement;
      acc[item.region].trialTarget += item.trialTarget;
      return acc;
    }, {});

    return {
      categories: Object.keys(regionalData),
      series: [
        {
          name: 'Trial Achievement',
          data: (Object.values(regionalData) as ChartDataItem[]).map(
            (item) => item.trialAchievement
          ),
          color: '#8b5cf6',
        },
        {
          name: 'Trial Target',
          data: (Object.values(regionalData) as ChartDataItem[]).map(
            (item) => item.trialTarget
          ),
          color: '#c4b5fd',
        },
      ],
    };
  };

  const chartData = getChartData();

  const options = {
    chart: {
      type: 'bar' as const,
      height: 350,
    },
    plotOptions: {
      bar: {
          borderRadius: 6,
          columnWidth: '70%',
          distributed: false,
          borderRadiusApplication: 'end' as const,
          dataLabels: {
            position: 'top'
          }
        }
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: chartData.categories,
    },
    yaxis: {
      title: {
        text: 'Count',
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val: any) {
          return val;
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg p-3 lg:p-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Trial Target vs Achievement - Till Date</h3>
      <ApexChart
        options={options}
        series={chartData.series}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default TrialTargetAchievement;
