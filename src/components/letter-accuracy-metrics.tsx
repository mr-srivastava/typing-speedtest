'use client';

import { useState, useMemo } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { LetterMetrics } from '@/types/metrics';

// uses shared LetterMetrics

interface ILetterAccuracyMetrics {
  letterAccuracyData: Record<string, LetterMetrics>;
}

const keyboardLayout = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
];

export function LetterAccuracyMetrics({
  letterAccuracyData,
}: ILetterAccuracyMetrics) {
  const [hoveredLetter, setHoveredLetter] = useState<string | null>(null);

  const { sortedLetters, overallWeightedAccuracy } = useMemo(() => {
    const sorted = Object.entries(letterAccuracyData).sort((a, b) =>
      a[0].localeCompare(b[0])
    );
    const weightedSum = sorted.reduce(
      (sum, [_, metrics]) =>
        sum + (metrics.correct / metrics.total) * metrics.total,
      0
    );
    const totalAttempts = sorted.reduce(
      (sum, [_, metrics]) => sum + metrics.total,
      0
    );
    const overall = (weightedSum / totalAttempts) * 100;
    return { sortedLetters: sorted, overallWeightedAccuracy: overall };
  }, [letterAccuracyData]);

  const getAccuracyColor = (correct: number, total: number) => {
    const weightedAccuracy = (correct / total) * total;
    if (total === 0) return 'bg-gray-700';
    if (weightedAccuracy >= total * (overallWeightedAccuracy / 100))
      return 'bg-[hsl(var(--good))]';
    if (weightedAccuracy >= total * (overallWeightedAccuracy / 100) * 0.8)
      return 'bg-[hsl(var(--poor))]';
    return 'bg-[hsl(var(--needs-improvement))]';
  };

  const renderKey = (letter: string) => {
    const metrics = letterAccuracyData[letter] || { correct: 0, total: 0 };
    const weightedAccuracy =
      metrics.total > 0 ? (metrics.correct / metrics.total) * metrics.total : 0;
    const chartData = [
      { name: 'Correct', value: metrics.correct },
      { name: 'Incorrect', value: metrics.total - metrics.correct },
    ];
    const COLORS = ['hsl(var(--good))', 'hsl(var(--needs-improvement))'];

    return (
      <TooltipProvider key={letter}>
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              className={`w-8 h-8 rounded-md flex items-center justify-center text-white font-bold cursor-pointer ${getAccuracyColor(
                metrics.correct,
                metrics.total
              )}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => setHoveredLetter(letter)}
              onMouseLeave={() => setHoveredLetter(null)}
            >
              {letter.toUpperCase()}
            </motion.div>
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
                <ResponsiveContainer width={150} height={150}>
                  <PieChart>
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
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className='text-gray-400 mb-4'>No data available</div>
              )}
              <div className='flex justify-center mt-2 text-xs'>
                <div className='flex items-center mr-4'>
                  <div className='w-3 h-3 rounded-full bg-[hsl(var(--good))] mr-1'></div>
                  Correct
                </div>
                <div className='flex items-center'>
                  <div className='w-3 h-3 rounded-full bg-[hsl(var(--needs-improvement))] mr-1'></div>
                  Incorrect
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

  return (
    <div className='mt-5'>
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
        <div className='flex items-center'>
          <div className='w-4 h-4 rounded-full bg-[hsl(var(--good))] mr-2'></div>
          <span>Above Average</span>
        </div>
        <div className='flex items-center'>
          <div className='w-4 h-4 rounded-full bg-[hsl(var(--poor))] mr-2'></div>
          <span>Near Average</span>
        </div>
        <div className='flex items-center'>
          <div className='w-4 h-4 rounded-full bg-[hsl(var(--needs-improvement))] mr-2'></div>
          <span>Below Average</span>
        </div>
      </motion.div>
    </div>
  );
}
