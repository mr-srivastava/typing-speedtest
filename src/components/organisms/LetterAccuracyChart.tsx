'use client';

import { useMemo } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell } from 'recharts';
import { LetterMetrics } from '@/types/metrics';
import { calculateOverallWeightedAccuracy, pieChartColors } from '@/lib/utils';
import { layoutClasses } from '@/lib/layout-utils';
import {
  accuracyLegendData,
  getLegendItemClasses,
  getLetterAccuracyColorClass,
} from '@/lib/theme-display-utils';

interface LetterAccuracyChartProps {
  letterAccuracyData: Record<string, LetterMetrics>;
  className?: string;
}

const keyboardLayout = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];

const LetterAccuracyChart: React.FC<LetterAccuracyChartProps> = ({
  letterAccuracyData,
  className = '',
}) => {
  const { sortedLetters: _sortedLetters, overallWeightedAccuracy } =
    useMemo(() => {
      const sorted = Object.entries(letterAccuracyData).sort((a, b) =>
        a[0].localeCompare(b[0]),
      );
      const overall = calculateOverallWeightedAccuracy(letterAccuracyData);
      return { sortedLetters: sorted, overallWeightedAccuracy: overall };
    }, [letterAccuracyData]);

  const getAccuracyColor = (correct: number, total: number) => {
    return getLetterAccuracyColorClass(correct, total, overallWeightedAccuracy);
  };

  const renderKey = (letter: string) => {
    const metrics = letterAccuracyData[letter] || { correct: 0, total: 0 };
    const weightedAccuracy =
      metrics.total > 0 ? (metrics.correct / metrics.total) * metrics.total : 0;
    const chartData = [
      { name: 'Correct', value: metrics.correct },
      { name: 'Incorrect', value: metrics.total - metrics.correct },
    ];
    const COLORS = pieChartColors;

    return (
      <TooltipProvider key={letter}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={`w-8 h-8 rounded-md ${
                layoutClasses.flexCenter
              } text-white font-bold cursor-pointer transition-transform hover:scale-110 active:scale-95 ${getAccuracyColor(
                metrics.correct,
                metrics.total,
              )}`}
            >
              {letter.toUpperCase()}
            </div>
          </TooltipTrigger>
          <TooltipContent className='bg-gray-800 border-gray-700 text-white p-4 rounded-lg shadow-lg'>
            <div className='text-center'>
              <div className='font-bold text-xl mb-2'>
                {letter.toUpperCase()}
              </div>
              <div className='mb-2'>
                {metrics.correct} / {metrics.total}
              </div>
              <div className='mb-2'>
                Accuracy:{' '}
                {metrics.total > 0
                  ? ((metrics.correct / metrics.total) * 100).toFixed(1)
                  : 0}
                %
              </div>
              <div className='mb-4'>
                Weighted Accuracy: {weightedAccuracy.toFixed(1)}
              </div>
              {metrics.total > 0 ? (
                <PieChart width={150} height={150}>
                  <Pie
                    data={chartData}
                    cx='50%'
                    cy='50%'
                    innerRadius={40}
                    outerRadius={60}
                    fill='#8884d8'
                    paddingAngle={5}
                    dataKey='value'
                  >
                    {chartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              ) : (
                <div className='text-gray-400 mb-4'>No data available</div>
              )}
              <div className={`${layoutClasses.flexCenter} mt-2 text-xs`}>
                <div className='mr-4'>
                  <div className={getLegendItemClasses('small').container}>
                    <div
                      className={`${
                        getLegendItemClasses('small').icon
                      } rounded-full ${accuracyLegendData.correct.colorClass} ${
                        getLegendItemClasses('small').spacing
                      }`}
                    ></div>
                    <span>{accuracyLegendData.correct.label}</span>
                  </div>
                </div>
                <div>
                  <div className={getLegendItemClasses('small').container}>
                    <div
                      className={`${
                        getLegendItemClasses('small').icon
                      } rounded-full ${
                        accuracyLegendData.incorrect.colorClass
                      } ${getLegendItemClasses('small').spacing}`}
                    />
                    <span>{accuracyLegendData.incorrect.label}</span>
                  </div>
                </div>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  const renderKeyboardRow = (row: string[], rowIndex: number) => (
    <motion.div
      key={rowIndex}
      className='flex justify-center space-x-1 mb-1'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * rowIndex }}
    >
      {row.map(renderKey)}
    </motion.div>
  );

  // Check if there's any actual data (not just empty entries)
  const hasActualData = useMemo(() => {
    if (!letterAccuracyData || Object.keys(letterAccuracyData).length === 0) {
      return false;
    }
    // Check if any letter has been typed (total > 0)
    return Object.values(letterAccuracyData).some(
      (metrics) => metrics.total > 0,
    );
  }, [letterAccuracyData]);

  // Show message if no data available
  if (!hasActualData) {
    return (
      <div className={`mt-5 text-center ${className}`}>
        <motion.div
          className='text-muted-foreground'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          No letter-level accuracy data available for this view.
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`mt-5 ${className}`}>
      <motion.div
        className='text-center mb-2 text-xl'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        Overall Weighted Accuracy: {overallWeightedAccuracy.toFixed(1)}%
      </motion.div>
      <motion.div
        className='mb-6'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {keyboardLayout.map(renderKeyboardRow)}
      </motion.div>
      <motion.div
        className='flex justify-center space-x-6 text-sm'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className={getLegendItemClasses('medium').container}>
          <div
            className={`${getLegendItemClasses('medium').icon} rounded-full ${
              accuracyLegendData.aboveAverage.colorClass
            } ${getLegendItemClasses('medium').spacing}`}
          ></div>
          <span>{accuracyLegendData.aboveAverage.label}</span>
        </div>
        <div className={getLegendItemClasses('medium').container}>
          <div
            className={`${getLegendItemClasses('medium').icon} rounded-full ${
              accuracyLegendData.nearAverage.colorClass
            } ${getLegendItemClasses('medium').spacing}`}
          ></div>
          <span>{accuracyLegendData.nearAverage.label}</span>
        </div>
        <div className={getLegendItemClasses('medium').container}>
          <div
            className={`${getLegendItemClasses('medium').icon} rounded-full ${
              accuracyLegendData.belowAverage.colorClass
            } ${getLegendItemClasses('medium').spacing}`}
          ></div>
          <span>{accuracyLegendData.belowAverage.label}</span>
        </div>
      </motion.div>
    </div>
  );
};

export default LetterAccuracyChart;
