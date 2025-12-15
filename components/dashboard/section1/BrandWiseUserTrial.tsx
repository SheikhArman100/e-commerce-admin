import React from 'react';
import dynamic from 'next/dynamic';

const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const BrandWiseUserTrial = ({ data, filters }) => {
  const getChartData = () => {
    const brandData = data.reduce((acc, item) => {
      if (!acc[item.brand]) {
        acc[item.brand] = 0;
      }
      acc[item.brand] += item.trialAchievement;
      return acc;
    }, {});

    return {
      series: Object.values(brandData) as number[],
      labels: Object.keys(brandData),
    };
  };

  const chartData = getChartData();

  const options = {
    chart: {
      type: 'pie' as const,
      height: 350,
    },
    labels: chartData.labels,
    colors: [ '#8b5cf6', '#c4b5fd'],
    tooltip: {
      enabled: true,
      custom: function({ series, seriesIndex, dataPointIndex, w }: any) {
        const label = chartData.labels?.[dataPointIndex] || `Brand ${dataPointIndex + 1}`;
        const value = series[seriesIndex] || 0;
        const total = series.reduce((a: number, b: number) => a + b, 0);
        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
        const color = w.config.colors?.[dataPointIndex] || '#8b5cf6';

        return `
          <div style="
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 12px 16px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            font-family: Inter, sans-serif;
            min-width: 140px;
          ">
            <div style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 4px;
            "></div>
            <div style="
              display: flex;
              justify-content: space-between;
              align-items: center;
            ">
              <span style="
                font-size: 13px;
                color: #6b7280;
              ">Trials:</span>
              <span style="
                font-weight: 600;
                font-size: 14px;
                color: #111827;
              ">${value.toLocaleString()}</span>
            </div>
            <div style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-top: 2px;
            ">
              <span style="
                font-size: 13px;
                color: #6b7280;
              ">Percentage:</span>
              <span style="
                font-weight: 600;
                font-size: 14px;
                color: #111827;
              ">${percentage}%</span>
            </div>
          </div>
        `;
      },
      style: {
        fontSize: '14px',
        fontFamily: 'Inter, sans-serif'
      },
      theme: 'light'
    },
    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: {
            width: '100%',
            height: 280,
          },
          legend: {
            position: 'bottom',
            horizontalAlign: 'center',
          },
        },
      },
      {
        breakpoint: 480,
        options: {
          chart: {
            width: '100%',
            height: 250,
          },
          legend: {
            position: 'bottom',
            horizontalAlign: 'center',
            fontSize: '12px',
          },
          dataLabels: {
            enabled: true,
            formatter: function (val: any) {
              return val.toFixed(1) + '%';
            },
            style: {
              fontSize: '10px',
              colors: ['#fff'],
            },
          },
        },
      },
    ],
  };

  return (
    <div className="bg-white rounded-lg p-3 lg:p-6 border border-gray-200 w-full overflow-hidden">
      <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-2 sm:mb-4">Brand Wise User Trial - Till Date</h3>
      <div className="w-full overflow-hidden">
        <ApexChart
          options={options}
          series={chartData.series}
          type="pie"
          height={350}
        />
      </div>
    </div>
  );
};

export default BrandWiseUserTrial;
