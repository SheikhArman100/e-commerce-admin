
import React from 'react';
import dynamic from 'next/dynamic';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ChartDataItem {
  contactAchievement: number;
  contactTarget: number;
}

interface Props {
  data: any[];
  filters: any;
}

const ContactTargetAchievement: React.FC<Props> = ({ data, filters }) => {
  const getChartData = () => {
    if (filters.point?.value) {
      const brandData = data.reduce((acc, item) => {
        if (!acc[item.brand]) {
          acc[item.brand] = {
            contactAchievement: 0,
            contactTarget: 0,
          };
        }
        acc[item.brand].contactAchievement += item.contactAchievement;
        acc[item.brand].contactTarget += item.contactTarget;
        return acc;
      }, {});

      return {
        categories: Object.keys(brandData),
        series: [
          {
            name: 'Contact Achievement',
            data: (Object.values(brandData) as ChartDataItem[]).map(
              (item) => item.contactAchievement
            ),
            color: '#6366F1',
          },
          {
            name: 'Contact Target',
            data: (Object.values(brandData) as ChartDataItem[]).map(
              (item) => item.contactTarget
            ),
            color: '#A5B4FC',
          },
        ],
      };
    }

    if (filters.territory?.value) {
      const pointData = data.reduce((acc, item) => {
        if (!acc[item.point]) {
          acc[item.point] = {
            contactAchievement: 0,
            contactTarget: 0,
          };
        }
        acc[item.point].contactAchievement += item.contactAchievement;
        acc[item.point].contactTarget += item.contactTarget;
        return acc;
      }, {});

      return {
        categories: Object.keys(pointData),
        series: [
          {
            name: 'Contact Achievement',
            data: (Object.values(pointData) as ChartDataItem[]).map(
              (item) => item.contactAchievement
            ),
            color: '#6366F1',
          },
          {
            name: 'Contact Target',
            data: (Object.values(pointData) as ChartDataItem[]).map(
              (item) => item.contactTarget
            ),
            color: '#A5B4FC',
          },
        ],
      };
    }

    if (filters.distributionHouse?.value) {
      const territoryData = data.reduce((acc, item) => {
        if (!acc[item.territory]) {
          acc[item.territory] = {
            contactAchievement: 0,
            contactTarget: 0,
          };
        }
        acc[item.territory].contactAchievement += item.contactAchievement;
        acc[item.territory].contactTarget += item.contactTarget;
        return acc;
      }, {});

      return {
        categories: Object.keys(territoryData),
        series: [
          {
            name: 'Contact Achievement',
            data: (Object.values(territoryData) as ChartDataItem[]).map(
              (item) => item.contactAchievement
            ),
            color: '#6366F1',
          },
          {
            name: 'Contact Target',
            data: (Object.values(territoryData) as ChartDataItem[]).map(
              (item) => item.contactTarget
            ),
            color: '#A5B4FC',
          },
        ],
      };
    }

    if (filters.area?.value) {
      const distributionHouseData = data.reduce((acc, item) => {
        if (!acc[item.distributionHouse]) {
          acc[item.distributionHouse] = {
            contactAchievement: 0,
            contactTarget: 0,
          };
        }
        acc[item.distributionHouse].contactAchievement += item.contactAchievement;
        acc[item.distributionHouse].contactTarget += item.contactTarget;
        return acc;
      }, {});

      return {
        categories: Object.keys(distributionHouseData),
        series: [
          {
            name: 'Contact Achievement',
            data: (Object.values(distributionHouseData) as ChartDataItem[]).map(
              (item) => item.contactAchievement
            ),
            color: '#6366F1',
          },
          {
            name: 'Contact Target',
            data: (Object.values(distributionHouseData) as ChartDataItem[]).map(
              (item) => item.contactTarget
            ),
            color: '#A5B4FC',
          },
        ],
      };
    }

    if (filters.region?.value) {
      const areaData = data.reduce((acc, item) => {
        if (!acc[item.area]) {
          acc[item.area] = {
            contactAchievement: 0,
            contactTarget: 0,
          };
        }
        acc[item.area].contactAchievement += item.contactAchievement;
        acc[item.area].contactTarget += item.contactTarget;
        return acc;
      }, {});

      return {
        categories: Object.keys(areaData),
        series: [
          {
            name: 'Contact Achievement',
            data: (Object.values(areaData) as ChartDataItem[]).map(
              (item) => item.contactAchievement
            ),
            color: '#6366F1',
          },
          {
            name: 'Contact Target',
            data: (Object.values(areaData) as ChartDataItem[]).map(
              (item) => item.contactTarget
            ),
            color: '#A5B4FC',
          },
        ],
      };
    }

    const regionalData = data.reduce((acc, item) => {
      if (!acc[item.region]) {
        acc[item.region] = {
          contactAchievement: 0,
          contactTarget: 0,
        };
      }
      acc[item.region].contactAchievement += item.contactAchievement;
      acc[item.region].contactTarget += item.contactTarget;
      return acc;
    }, {});

    return {
      categories: Object.keys(regionalData),
      series: [
        {
          name: 'Contact Achievement',
          data: (Object.values(regionalData) as ChartDataItem[]).map(
            (item) => item.contactAchievement
          ),
          color: '#6366F1',
        },
        {
          name: 'Contact Target',
          data: (Object.values(regionalData) as ChartDataItem[]).map(
            (item) => item.contactTarget
          ),
          color: '#A5B4FC',
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
      <h3 className="text-lg font-semibold mb-4">Contact Target vs Achievement - Till Date</h3>
      <ApexChart
        options={options}
        series={chartData.series}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default ContactTargetAchievement;
