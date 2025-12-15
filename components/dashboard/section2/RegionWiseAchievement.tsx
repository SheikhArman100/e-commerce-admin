import React from 'react';
import dynamic from 'next/dynamic';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const RegionWiseAchievement = ({ data, filters }) => {
  const getChartData = () => {
    const regionalData = data.reduce((acc, item) => {
      if (!acc[item.region]) {
        acc[item.region] = {
          achievement: 0,
        };
      }
      acc[item.region].achievement += item.trialAchievement; // Assuming trial achievement for now
      return acc;
    }, {});

    return {
      categories: Object.keys(regionalData),
      series: [
        {
          name: 'Achievement',
          data: Object.values(regionalData).map(
            (item) => item.achievement
          ),
          color: '#8b5cf6',
        },
      ],
    };
  };

  const chartData = getChartData();

  const options = {
    chart: {
      type: 'bar',
      height: 350,
    },
    plotOptions: {
      bar: {
          borderRadius: 6,
          columnWidth: '70%',
          distributed: false,
          borderRadiusApplication: 'end',
          dataLabels: {
            position: 'top'
          }
        }
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val;
      },
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ["#304758"]
      }
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
        formatter: function (val) {
          return val;
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">Region Wise Achievement Status - Till Date</h3>
      <ApexChart
        options={options}
        series={chartData.series}
        type="bar"
        height={350}
      />
    </div>
  );
};

export default RegionWiseAchievement;