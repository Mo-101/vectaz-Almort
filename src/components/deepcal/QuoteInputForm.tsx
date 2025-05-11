
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { QuoteData, WeightFactors } from './types';
import DeepCALSpinner from '@/components/DeepCALSpinner';
import forwarders from '@/core/base_reference/forwarders.json';

interface QuoteInputFormProps {
  onAnalyze: (quotes: QuoteData[], source: string, destination: string, weightKg: number, mode: string, weightFactors: WeightFactors) => void;
  loading: boolean;
}

const QuoteInputForm: React.FC<QuoteInputFormProps> = ({ onAnalyze, loading }) => {
  // Prefill with sample data for quick testing
  const [quotes, setQuotes] = useState<QuoteData[]>([
    { forwarder: 'Kenya Airways', price: '2500', currency: 'USD', transitDays: '5', reliability: '85' },
    { forwarder: 'DHL', price: '2700', currency: 'USD', transitDays: '3', reliability: '90' },
    { forwarder: 'Kuehne Nagel', price: '2600', currency: 'USD', transitDays: '4', reliability: '87' }
  ]);
  const [weightKg, setWeightKg] = useState<number>(20000);
  const [source, setSource] = useState<string>('Kenya');
  const [destination, setDestination] = useState<string>('Zimbabwe');
  const [mode, setMode] = useState<string>('Air');
  
  const [weightFactors, setWeightFactors] = useState<WeightFactors>({
    cost: 0.4,
    time: 0.3,
    reliability: 0.3
  });

  const handleQuoteChange = (index: number, field: keyof QuoteData, value: string) => {
    const newQuotes = [...quotes];
    newQuotes[index] = { ...newQuotes[index], [field]: value };
    setQuotes(newQuotes);
  };

  const handleAddForwarder = () => {
    if (quotes.length < forwarders.length) {
      const availableForwarders = forwarders.filter(
        f => !quotes.some(q => q.forwarder === f)
      );
      if (availableForwarders.length > 0) {
        setQuotes([...quotes, { 
          forwarder: availableForwarders[0], 
          price: '0', 
          currency: 'USD', 
          transitDays: '1',
          reliability: '75'
        }]);
      }
    }
  };

  const handleRemoveForwarder = (index: number) => {
    if (quotes.length > 1) {
      const newQuotes = [...quotes];
      newQuotes.splice(index, 1);
      setQuotes(newQuotes);
    }
  };

  const handleWeightChange = (field: 'cost' | 'time' | 'reliability', value: number) => {
    setWeightFactors({
      ...weightFactors,
      [field]: value
    });
  };

  const handleSubmit = () => {
    onAnalyze(quotes, source, destination, weightKg, mode, weightFactors);
  };

  return (
    <Card className="max-w-4xl mx-auto border border-[#00FFD1]/20 bg-[#0A1A2F]/80 backdrop-blur-md text-white shadow-[0_0_15px_rgba(0,255,209,0.1)]">
      <CardHeader>
        <CardTitle className="text-2xl text-center text-[#00FFD1]">DeepCAL™ Quote Optimizer</CardTitle>
        <CardDescription className="text-center text-gray-300">
          Enter your freight quotes to receive AI-powered logistics recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <Label htmlFor="source" className="text-gray-300">Source Country</Label>
            <Input 
              id="source" 
              value={source} 
              onChange={(e) => setSource(e.target.value)} 
              className="mt-1 bg-[#0A1A2F]/50 border-[#00FFD1]/30 text-white"
            />
          </div>
          <div>
            <Label htmlFor="destination" className="text-gray-300">Destination Country</Label>
            <Input 
              id="destination" 
              value={destination} 
              onChange={(e) => setDestination(e.target.value)} 
              className="mt-1 bg-[#0A1A2F]/50 border-[#00FFD1]/30 text-white"
            />
          </div>
          <div>
            <Label htmlFor="weight" className="text-gray-300">Shipment Weight (kg)</Label>
            <Input 
              id="weight" 
              type="number"
              value={weightKg} 
              onChange={(e) => setWeightKg(Number(e.target.value) || 0)} 
              className="mt-1 bg-[#0A1A2F]/50 border-[#00FFD1]/30 text-white"
            />
          </div>
          <div>
            <Label htmlFor="mode" className="text-gray-300">Mode of Shipment</Label>
            <select 
              id="mode" 
              value={mode} 
              onChange={(e) => setMode(e.target.value)}
              className="flex h-10 w-full rounded-md border border-[#00FFD1]/30 bg-[#0A1A2F]/50 px-3 py-2 text-sm text-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FFD1]/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
            >
              <option>Air</option>
              <option>Sea</option>
              <option>Road</option>
            </select>
          </div>
        </div>

        <Separator className="my-8 bg-[#00FFD1]/20" />
        
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-[#00FFD1]">Forwarder Quotes</h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAddForwarder}
              disabled={quotes.length >= forwarders.length}
              className="border-[#00FFD1]/30 text-[#00FFD1] hover:bg-[#00FFD1]/10"
            >
              Add Forwarder
            </Button>
          </div>
          
          {quotes.map((quote, index) => (
            <div key={index} className="flex items-center gap-4 flex-wrap md:flex-nowrap">
              <div className="w-full md:w-1/3">
                <select 
                  value={quote.forwarder}
                  onChange={(e) => handleQuoteChange(index, 'forwarder', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-[#00FFD1]/30 bg-[#0A1A2F]/50 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00FFD1]/50 focus-visible:ring-offset-2"
                >
                  {forwarders.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
              <div className="flex-grow">
                <div className="flex items-center">
                  <span className="mr-2 text-white">$</span>
                  <Input 
                    type="number"
                    value={quote.price}
                    onChange={(e) => handleQuoteChange(index, 'price', e.target.value)}
                    placeholder="Quote amount"
                    className="bg-[#0A1A2F]/50 border-[#00FFD1]/30 text-white"
                  />
                </div>
              </div>
              <div className="w-full md:w-1/4">
                <Input
                  type="number"
                  value={quote.transitDays}
                  onChange={(e) => handleQuoteChange(index, 'transitDays', e.target.value)}
                  placeholder="Transit Days"
                  className="bg-[#0A1A2F]/50 border-[#00FFD1]/30 text-white"
                />
              </div>
              <div className="w-full md:w-1/4">
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={quote.reliability}
                  onChange={(e) => handleQuoteChange(index, 'reliability', e.target.value)}
                  placeholder="Reliability %"
                  className="bg-[#0A1A2F]/50 border-[#00FFD1]/30 text-white"
                />
              </div>
              <div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleRemoveForwarder(index)}
                  disabled={quotes.length <= 1}
                  className="text-gray-300 hover:text-white hover:bg-[#00FFD1]/10"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <Separator className="my-8 bg-[#00FFD1]/20" />

        <div>
          <h3 className="text-lg font-medium mb-4 text-[#00FFD1]">Weight Factor Adjustment</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="cost-factor" className="text-gray-300">Cost ({Math.round(weightFactors.cost * 100)}%)</Label>
              <Input 
                id="cost-factor"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={weightFactors.cost}
                onChange={(e) => handleWeightChange('cost', parseFloat(e.target.value))}
                className="mt-1 accent-[#00FFD1]"
              />
            </div>
            <div>
              <Label htmlFor="time-factor" className="text-gray-300">Time ({Math.round(weightFactors.time * 100)}%)</Label>
              <Input 
                id="time-factor"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={weightFactors.time}
                onChange={(e) => handleWeightChange('time', parseFloat(e.target.value))}
                className="mt-1 accent-[#00FFD1]"
              />
            </div>
            <div>
              <Label htmlFor="reliability-factor" className="text-gray-300">Reliability ({Math.round(weightFactors.reliability * 100)}%)</Label>
              <Input 
                id="reliability-factor"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={weightFactors.reliability}
                onChange={(e) => handleWeightChange('reliability', parseFloat(e.target.value))}
                className="mt-1 accent-[#00FFD1]"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-center mt-10">
          <Button 
            size="lg" 
            className="px-10 py-6 text-lg bg-gradient-to-r from-[#00FFD1]/80 to-[#00FFD1] hover:from-[#00FFD1] hover:to-[#00FFD1]/80 text-[#0A1A2F] font-bold transition-all"
            onClick={handleSubmit}
            disabled={loading || quotes.some(q => parseFloat(q.price) <= 0)}
          >
            {loading ? (
              <span className="flex items-center">
                <DeepCALSpinner />
                <span className="ml-2">Analyzing...</span>
              </span>
            ) : (
              "Enter the Deep"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuoteInputForm;
