import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, MapPin, Briefcase, CheckCircle, Users } from 'lucide-react';

const useAnimatedValue = (endValue, duration = 1000, isPercentage = false) => {
  const [currentValue, setCurrentValue] = useState(0);
  const frameRef = useRef();

  useEffect(() => {
    const startValue = 0;
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      let value = startValue + (endValue - startValue) * progress;

      if (!isPercentage) {
        value = Math.floor(value);
      }

      setCurrentValue(value);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameRef.current);
  }, [endValue, duration, isPercentage]);

  return currentValue;
};

const AnimatedNumber = ({ value }) => {
  const animatedValue = useAnimatedValue(value);
  return <>{animatedValue.toLocaleString()}</>;
};

const AnimatedPercentage = ({ value }) => {
  const animatedValue = useAnimatedValue(value, 1000, true);
  return <>{animatedValue.toFixed(2)}%</>;
};

const MetricCard = ({ icon: Icon, value, label, color }) => {
  const numericValue = parseFloat(String(value).replace(/,/g, ''));
  return (
    <div className={`${color} rounded-lg p-6 flex flex-col items-start`}>
      <Icon className="h-8 w-8 mb-4 text-gray-600" />
      <div className="text-2xl font-bold">
        {isNaN(numericValue) ? value : <AnimatedNumber value={numericValue} />}
      </div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
};

const DataCard = ({ title, stats, color }) => (
  <div className={`${color} rounded-lg p-6`}>
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    <div className="grid grid-cols-2 gap-4">
      {stats.map((stat, index) => {
        const isPercentage = typeof stat.value === 'string' && stat.value.includes('%');
        const numericValue = parseFloat(String(stat.value).replace(/,/g, '').replace('%', ''));
        return (
          <div key={index}>
            <div className="text-2xl font-bold">
              {isPercentage ? (
                <AnimatedPercentage value={numericValue} />
              ) : (
                <AnimatedNumber value={numericValue} />
              )}
            </div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        );
      })}
    </div>
  </div>
);

export default function Section2Metrics({ data }) {
  const successfulCommunications = data.reduce((acc, item) => acc + item.contactAchievement, 0);
  const territoriesReached = [...new Set(data.map(item => item.territory))].length;
  const partnerOutletsInvolved = data.reduce((acc, item) => acc + item.contactTarget, 0);
  const partnersCompletedTargets = data.reduce((acc, item) => acc + item.trialAchievement, 0);

  const totalContactNumber = successfulCommunications;
  const totalContactTarget = data.reduce((acc, item) => acc + item.contactTarget, 0);
  const contactAchievement = totalContactTarget > 0 ? ((totalContactNumber / totalContactTarget) * 100).toFixed(2) + '%' : '0%';

  const totalTrialNumber = data.reduce((acc, item) => acc + item.trialAchievement, 0);
  const totalTrialTarget = data.reduce((acc, item) => acc + item.trialTarget, 0);
  const trialAchievement = totalTrialTarget > 0 ? ((totalTrialNumber / totalTrialTarget) * 100).toFixed(2) + '%' : '0%';
  
  const completedPartners = partnersCompletedTargets;
  const completedPartnerPercentage = totalContactTarget > 0 ? ((completedPartners / totalContactTarget) * 100).toFixed(2) + '%' : '0%';

  const metrics = [
    {
      icon: Users ,
      value: successfulCommunications.toLocaleString(),
      label: 'Successful Communications',
      color: 'bg-blue-100',
    },
    {
      icon: MapPin,
      value: territoriesReached,
      label: 'Territories Reached',
      color: 'bg-purple-100',
    },
    {
      icon: Briefcase,
      value: partnerOutletsInvolved.toLocaleString(),
      label: 'Partner Outlets Involved',
      color: 'bg-indigo-100',
    },
    {
      icon: CheckCircle,
      value: partnersCompletedTargets.toLocaleString(),
      label: 'Partners Completed Targets',
      color: 'bg-blue-200',
    },
  ];

  const dataCards = [
    {
      title: 'National Contact Data',
      color: 'bg-indigo-100',
      stats: [
        { label: 'Total Contact Number', value: totalContactNumber.toLocaleString() },
        { label: 'Contact Achievement', value: contactAchievement },
      ],
    },
    {
      title: 'National Trial Data',
      color: 'bg-purple-200',
      stats: [
        { label: 'Total Trial Number', value: totalTrialNumber.toLocaleString() },
        { label: 'Trial Achievement', value: trialAchievement },
      ],
    },
    {
      title: 'National Completed Partners Data',
      color: 'bg-indigo-100',
      stats: [
        { label: 'Completed Partners', value: completedPartners.toLocaleString() },
        { label: 'Completed Partner Percentage', value: completedPartnerPercentage },
      ],
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {dataCards.map((card, index) => (
          <DataCard key={index} {...card} />
        ))}
      </div>
    </div>
  );
}