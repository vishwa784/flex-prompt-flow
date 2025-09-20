import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';

interface BudgetChartProps {
  scenario: {
    spending: number;
    hiring: number;
    pricing: number;
    revenue: number;
    expenses: number;
  };
}

export const BudgetChart: React.FC<BudgetChartProps> = ({ scenario }) => {
  // Generate forecast data based on current scenario
  const generateForecastData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const baseRevenue = scenario.revenue;
    const baseExpenses = scenario.expenses;
    
    return months.map((month, index) => {
      const growthFactor = 1 + (index * 0.05); // 5% monthly growth
      const seasonalFactor = 1 + Math.sin(index * 0.5) * 0.1; // Seasonal variation
      
      const revenue = Math.round(baseRevenue * growthFactor * seasonalFactor);
      const expenses = Math.round(baseExpenses * (1 + index * 0.02)); // 2% monthly expense growth
      const netIncome = revenue - expenses;
      const runway = netIncome > 0 ? 999 : Math.max(0, 12 - index);
      
      return {
        month,
        revenue,
        expenses,
        netIncome,
        runway,
        breakeven: baseRevenue
      };
    });
  };

  const data = generateForecastData();
  const currentNet = scenario.revenue - scenario.expenses;
  const isPositive = currentNet > 0;
  
  const formatCurrency = (value: number) => {
    return `$${(value / 1000).toFixed(0)}K`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium text-foreground">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.dataKey}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-card-hover">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Income</p>
                <p className={`text-2xl font-bold ${isPositive ? 'text-success' : 'text-destructive'}`}>
                  {formatCurrency(Math.abs(currentNet))}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isPositive ? 'bg-success/10' : 'bg-destructive/10'}`}>
                {isPositive ? (
                  <TrendingUp className={`w-6 h-6 text-success`} />
                ) : (
                  <TrendingDown className={`w-6 h-6 text-destructive`} />
                )}
              </div>
            </div>
            <Badge variant={isPositive ? "default" : "destructive"} className="mt-2">
              {isPositive ? 'Profitable' : 'Loss'}
            </Badge>
          </CardContent>
        </Card>

        <Card className="shadow-card-hover">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Burn Rate</p>
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(scenario.expenses - scenario.revenue)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-warning" />
              </div>
            </div>
            <Badge variant="outline" className="mt-2">
              Monthly
            </Badge>
          </CardContent>
        </Card>

        <Card className="shadow-card-hover">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Runway</p>
                <p className="text-2xl font-bold text-primary">
                  {isPositive ? '∞' : '8-12'}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
            </div>
            <Badge variant="outline" className="mt-2">
              Months
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Revenue vs Expenses Chart */}
      <Card className="shadow-card-hover">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-foreground">Revenue vs Expenses Forecast</h3>
              <p className="text-sm text-muted-foreground">12-month projection based on current parameters</p>
            </div>
            <Badge variant="outline" className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-xs">Live Data</span>
            </Badge>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  tickFormatter={formatCurrency}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--success))"
                  fillOpacity={1}
                  fill="url(#revenueGradient)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="hsl(var(--destructive))"
                  fillOpacity={1}
                  fill="url(#expenseGradient)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex items-center justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span className="text-sm text-muted-foreground">Revenue</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-destructive rounded-full"></div>
              <span className="text-sm text-muted-foreground">Expenses</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};