import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Send, Calculator, TrendingUp, FileText, Instagram } from 'lucide-react';
import { FinancialSliders } from './FinancialSliders';
import { UsageCounter } from './UsageCounter';
import { DarkModeToggle } from './DarkModeToggle';

export const CFOHelper = () => {
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [scenarios, setScenarios] = useState(0);
  const [reports, setReports] = useState(0);
  const [currentScenario, setCurrentScenario] = useState({
    spending: 50,
    hiring: 10,
    pricing: 100,
    revenue: 100000,
    expenses: 75000
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileAttach = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAttachedFile(file);
    }
  };

  const handleSubmit = () => {
    if (prompt.trim()) {
      setScenarios(prev => prev + 1);
      navigate('/results', {
        state: {
          scenario: currentScenario,
          prompt: prompt,
          type: 'analysis'
        }
      });
    }
  };

  const handleGenerateReport = () => {
    setReports(prev => prev + 1);
    navigate('/results', {
      state: {
        scenario: currentScenario,
        prompt: prompt || 'Generate comprehensive financial report',
        type: 'report'
      }
    });
  };

  const handleScenarioChange = (newScenario: typeof currentScenario) => {
    setCurrentScenario(newScenario);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">CFO Helper</h1>
                <p className="text-sm text-muted-foreground">AI-Powered Financial Scenario Planning</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <UsageCounter scenarios={scenarios} reports={reports} />
              <DarkModeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Chat Interface */}
          <div className="lg:col-span-2 space-y-6">
            {/* Chat-like Input */}
            <Card className="shadow-card-hover hover:shadow-interactive transition-all duration-300">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-2">Financial Scenario Question</h3>
                      <Textarea 
                        placeholder="Ask me anything about your financial scenarios... e.g., 'If I hire 2 more engineers, how long until I run out of money?' or 'What happens if I increase prices by 15%?'"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="min-h-[120px] resize-none"
                      />
                      
                      {attachedFile && (
                        <div className="mt-3 p-3 bg-accent rounded-lg flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-accent-foreground" />
                            <span className="text-sm text-accent-foreground">{attachedFile.name}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setAttachedFile(null)}
                          >
                            Remove
                          </Button>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center space-x-2"
                          >
                            <Paperclip className="w-4 h-4" />
                            <span>Attach File</span>
                          </Button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            onChange={handleFileAttach}
                            accept=".csv,.xlsx,.xls,.pdf,.txt"
                            className="hidden"
                          />
                        </div>
                        
                        <Button 
                          onClick={handleSubmit}
                          variant="financial"
                          className="flex items-center space-x-2"
                          disabled={!prompt.trim()}
                        >
                          <Send className="w-4 h-4" />
                          <span>Analyze Scenario</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Sliders */}
            <FinancialSliders 
              scenario={currentScenario}
              onChange={handleScenarioChange}
            />
          </div>

          {/* Right Column - Quick Stats & Generate Report */}
          <div className="space-y-6">
            {/* Generate Report Button */}
            <Card className="shadow-card-hover">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                    <FileText className="w-4 h-4 text-success" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Generate Report</h3>
                    <p className="text-sm text-muted-foreground">Create detailed financial analysis</p>
                  </div>
                </div>
                
                <Button 
                  onClick={handleGenerateReport}
                  variant="success"
                  className="w-full flex items-center space-x-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Generate Full Report</span>
                </Button>
                
                <div className="mt-4 p-3 bg-accent/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    Includes P&L analysis, forecasts, charts, and AI recommendations
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Quick Stats */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Current Scenario</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Monthly Revenue</span>
                    <span className="font-medium text-success">${currentScenario.revenue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Monthly Expenses</span>
                    <span className="font-medium text-destructive">${currentScenario.expenses.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="text-sm font-medium">Net Income</span>
                    <span className={`font-bold ${currentScenario.revenue - currentScenario.expenses > 0 ? 'text-success' : 'text-destructive'}`}>
                      ${(currentScenario.revenue - currentScenario.expenses).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Runway (months)</span>
                    <span className="font-medium text-primary">
                      {currentScenario.revenue > currentScenario.expenses ? '∞' : '6-12'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Integration Status */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Integration Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    <span className="text-sm text-muted-foreground">Flexprice Billing</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-warning rounded-full"></div>
                    <span className="text-sm text-muted-foreground">Pathway Data (Mock)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="border-t border-border bg-card mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2 flex-wrap">
              Created by 
              <a 
                href="https://www.instagram.com/vishwasaikurimilla?utm_source=qr&igsh=cmZyNmxpcXp1NXpv"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <Instagram className="w-4 h-4" />
                Vishwa
              </a>
              &
              <a 
                href="https://www.instagram.com/vishnuteja_derangula?igsh=NzMwcnZubDF0NG4w"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <Instagram className="w-4 h-4" />
                Vishnu
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};