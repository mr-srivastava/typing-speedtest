import React from 'react';
import TestScreen from '@/features/typing-test/TestScreen';

const defaultTimer = 60;

export default function Home() {
  return <TestScreen defaultTimer={defaultTimer} />;
}
