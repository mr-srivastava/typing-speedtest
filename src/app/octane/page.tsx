import React from 'react';
import TestScreen from '@/screens/TestScreen';

const defaultTimer = 60;

export default function Octane() {
  return <TestScreen defaultTimer={defaultTimer} />;
}
