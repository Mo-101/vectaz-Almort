
import React from 'react';

// This is a stub component to fix import errors until the real component is implemented
interface RateInputProps {
  value?: number;
  onChange?: (value: number) => void;
  label?: string;
}

export interface ForwarderRateProps {
  forwarderName: string;
  rate: number;
  onChange: (rate: number) => void;
}

const RateInput: React.FC<RateInputProps> = ({ value = 0, onChange, label = 'Rate' }) => {
  return (
    <div className="flex flex-col space-y-1">
      <label className="text-sm text-muted-foreground">{label}</label>
      <input 
        type="number" 
        value={value} 
        onChange={(e) => onChange?.(Number(e.target.value))}
        className="border rounded px-3 py-1"
        min={0}
        max={5}
        step={0.1}
      />
    </div>
  );
};

export default RateInput;
