import React from 'react';
import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';

interface Props {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

export function BalanceSlider({ label, value, min, max, step, onChange }: Props) {
  return (
    <View>
      <Text>
        {label}: {value}
      </Text>
      <Slider
        minimumValue={min}
        maximumValue={max}
        step={step}
        value={value}
        onValueChange={onChange}
      />
    </View>
  );
}
