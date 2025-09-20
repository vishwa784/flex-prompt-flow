import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calculator, Download, Share2, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { BudgetChart } from '@/components/BudgetChart';
import { ReportGenerator } from '@/components/ReportGenerator';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';

const Results = () => {
  const location = useLocation();
  const { scenario, prompt, type } = location.state || {
    scenario: {
      spending: 50,
      hiring: 10,
      pricing: 100,
      revenue: 100000,
      expenses: 75000
    },
    prompt: "Financial analysis",
    type: "analysis"
  };

  const currentNet = scenario.revenue - scenario.expenses;
  const isPositive = currentNet > 0;

  // Generate detailed financial data
  const generateMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((month, index) => {
      const growthFactor = 1 + (index * 0.05);
      const seasonalFactor = 1 + Math.sin(index * 0.5) * 0.1;
      const revenue = Math.round(scenario.revenue * growthFactor * seasonalFactor);
      const expenses = Math.round(scenario.expenses * (1 + index * 0.02));
      const profit = revenue - expenses;
      
      return {
        month,
        revenue,
        expenses,
        profit,
        runway: profit > 0 ? 999 : Math.max(0, 12 - index)
      };
    });
  };

  const monthlyData = generateMonthlyData();

  // Profit/Loss breakdown data
  const profitLossData = [
    { name: 'Revenue', value: scenario.revenue, color: 'hsl(var(--success))' },
    { name: 'Fixed Costs', value: scenario.expenses * 0.6, color: 'hsl(var(--destructive))' },
    { name: 'Variable Costs', value: scenario.expenses * 0.4, color: 'hsl(var(--warning))' },
  ];

  const formatCurrency = (value: number) => `$${(value / 1000).toFixed(0)}K`;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium text-foreground">{label}</p>
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

  const handleReportGenerated = () => {
    console.log('Report generated for results page');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to CFO Helper</span>
                </Button>
              </Link>
              <div className="h-6 w-px bg-border"></div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Financial Analysis Results</h1>
                  <p className="text-sm text-muted-foreground">
                    {type === 'report' ? 'Generated Report' : 'Scenario Analysis'}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant={isPositive ? "default" : "destructive"}>
                {isPositive ? 'Profitable' : 'Loss Making'}
              </Badge>
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Query */}
        {prompt && (
          <Card className="mb-8 shadow-card-hover">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Your Financial Question</h3>
                  <p className="text-muted-foreground italic">"{prompt}"</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Key Metrics & Charts */}
          <div className="lg:col-span-3 space-y-6">
            {/* Key Financial Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                        <TrendingUp className="w-6 h-6 text-success" />
                      ) : (
                        <TrendingDown className="w-6 h-6 text-destructive" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card-hover">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Revenue</p>
                      <p className="text-2xl font-bold text-success">{formatCurrency(scenario.revenue)}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-success" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card-hover">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Expenses</p>
                      <p className="text-2xl font-bold text-destructive">{formatCurrency(scenario.expenses)}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                      <TrendingDown className="w-6 h-6 text-destructive" />
                    </div>
                  </div>
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
                      <AlertTriangle className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Revenue vs Expenses Chart */}
            <Card className="shadow-card-hover">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-6">12-Month Revenue vs Expenses Forecast</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyData}>
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
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis tickFormatter={formatCurrency} stroke="hsl(var(--muted-foreground))" fontSize={12} />
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
              </CardContent>
            </Card>

            {/* Profit/Loss Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-card-hover">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-6">Profit/Loss Breakdown</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={profitLossData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${formatCurrency(value)}`}
                        >
                          {profitLossData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card-hover">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-6">Monthly Profit Trend</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis tickFormatter={formatCurrency} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="profit"
                          stroke="hsl(var(--primary))"
                          strokeWidth={3}
                          dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            <Card className="shadow-card-hover">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">AI Recommendations</h3>
                <div className="space-y-4">
                  {currentNet < 0 && (
                    <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <p className="text-sm text-destructive font-medium">⚠️ Cash Flow Warning</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Current expenses exceed revenue. Consider reducing costs or increasing pricing.
                      </p>
                    </div>
                  )}
                  {scenario.hiring > 15 && (
                    <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
                      <p className="text-sm text-warning font-medium">👥 High Hiring Rate</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Rapid hiring may strain cash flow. Ensure adequate runway for new hires.
                      </p>
                    </div>
                  )}
                  {scenario.pricing < 80 && (
                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                      <p className="text-sm text-primary font-medium">💰 Pricing Optimization</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Consider testing higher pricing tiers to improve profit margins.
                      </p>
                    </div>
                  )}
                  {currentNet > 0 && (
                    <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                      <p className="text-sm text-success font-medium">✅ Healthy Financial Position</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Strong profit margins provide flexibility for growth investments.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Report Generator & Actions */}
          <div className="space-y-6">
            <ReportGenerator 
              scenario={scenario}
              onReportGenerated={handleReportGenerated}
            />

            {/* Current Scenario Summary */}
            <Card className="shadow-card-hover">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Scenario Parameters</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Marketing Spending</span>
                    <Badge variant="outline">{scenario.spending}%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Team Size</span>
                    <Badge variant="outline">{scenario.hiring} people</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Pricing Level</span>
                    <Badge variant="outline">{scenario.pricing}%</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-card-hover">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link to="/" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Calculator className="w-4 h-4 mr-2" />
                      New Analysis
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Results
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;