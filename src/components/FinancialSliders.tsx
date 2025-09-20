import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Users, TrendingUp } from 'lucide-react';

interface FinancialSlidersProps {
  scenario: {
    spending: number;
    hiring: number;
    pricing: number;
    revenue: number;
    expenses: number;
  };
  onChange: (scenario: any) => void;
}

export const FinancialSliders: React.FC<FinancialSlidersProps> = ({ scenario, onChange }) => {
  const handleSliderChange = (key: string, value: number[]) => {
    const newValue = value[0];
    let updatedScenario = { ...scenario, [key]: newValue };
    
    // Recalculate revenue and expenses based on sliders
    if (key === 'pricing') {
      updatedScenario.revenue = (newValue / 100) * 100000;
    }
    if (key === 'spending') {
      updatedScenario.expenses = 50000 + (newValue / 100) * 50000;
    }
    if (key === 'hiring') {
      updatedScenario.expenses = updatedScenario.expenses + (newValue * 8000);
    }
    
    onChange(updatedScenario);
  };

  const sliders = [
    {
      key: 'spending',
      label: 'Marketing Spending',
      icon: <DollarSign className="w-4 h-4" />,
      value: scenario.spending,
      min: 0,
      max: 100,
      step: 5,
      unit: '%',
      color: 'primary',
      description: 'Increase marketing budget percentage'
    },
    {
      key: 'hiring',
      label: 'Team Size',
      icon: <Users className="w-4 h-4" />,
      value: scenario.hiring,
      min: 0,
      max: 20,
      step: 1,
      unit: ' people',
      color: 'success',
      description: 'Number of additional team members'
    },
    {
      key: 'pricing',
      label: 'Product Pricing',
      icon: <TrendingUp className="w-4 h-4" />,
      value: scenario.pricing,
      min: 50,
      max: 200,
      step: 5,
      unit: '%',
      color: 'warning',
      description: 'Pricing adjustment from baseline'
    }
  ];

  return (
    <Card className="shadow-card-hover">
      <CardContent className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Financial Parameters</h3>
            <p className="text-sm text-muted-foreground">Adjust variables to see budget impact</p>
          </div>
        </div>

        <div className="space-y-8">
          {sliders.map((slider) => (
            <div key={slider.key} className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center bg-${slider.color}/10`}>
                    <span className={`text-${slider.color}`}>{slider.icon}</span>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">{slider.label}</label>
                    <p className="text-xs text-muted-foreground">{slider.description}</p>
                  </div>
                </div>
                <Badge variant="outline" className="flex items-center space-x-1">
                  <span className="font-bold">{slider.value}</span>
                  <span className="text-xs">{slider.unit}</span>
                </Badge>
              </div>
              
              <div className="px-3">
                <Slider
                  value={[slider.value]}
                  onValueChange={(value) => handleSliderChange(slider.key, value)}
                  min={slider.min}
                  max={slider.max}
                  step={slider.step}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>{slider.min}{slider.unit}</span>
                  <span>{slider.max}{slider.unit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-accent/50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span className="text-sm font-medium text-accent-foreground">Live Impact</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Changes are reflected immediately in charts and forecasts. Each adjustment simulates real business scenarios.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};