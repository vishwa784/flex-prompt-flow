import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Share2, CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface ReportGeneratorProps {
  scenario: {
    spending: number;
    hiring: number;
    pricing: number;
    revenue: number;
    expenses: number;
  };
  onReportGenerated: () => void;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({ scenario, onReportGenerated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastReport, setLastReport] = useState<string | null>(null);
  const { toast } = useToast();

  const generateReport = async () => {
    setIsGenerating(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const reportData = {
      timestamp: new Date().toLocaleString(),
      scenario: scenario,
      netIncome: scenario.revenue - scenario.expenses,
      runway: scenario.revenue > scenario.expenses ? 'Infinite' : '8-12 months',
      recommendations: [
        scenario.revenue < scenario.expenses ? 'Consider reducing expenses or increasing revenue' : 'Current trajectory is positive',
        scenario.hiring > 15 ? 'High hiring rate may strain cash flow' : 'Hiring rate is sustainable',
        scenario.pricing < 80 ? 'Pricing may be too low for profitability' : 'Pricing strategy looks healthy'
      ]
    };
    
    setLastReport(JSON.stringify(reportData, null, 2));
    setIsGenerating(false);
    onReportGenerated();
    
    toast({
      title: "Report Generated",
      description: "Financial scenario report is ready for download",
    });
  };

  const downloadReport = () => {
    if (!lastReport) return;
    
    const blob = new Blob([lastReport], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Report Downloaded",
      description: "Report saved to your downloads folder",
    });
  };

  const shareReport = () => {
    if (!lastReport) return;
    
    navigator.clipboard.writeText(lastReport);
    toast({
      title: "Report Copied",
      description: "Report data copied to clipboard",
    });
  };

  return (
    <Card className="shadow-card-hover">
      <CardContent className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
            <FileText className="w-4 h-4 text-success" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Report Generator</h3>
            <p className="text-sm text-muted-foreground">Export scenario analysis</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-accent/50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span className="text-sm font-medium text-accent-foreground">Report Includes:</span>
            </div>
            <ul className="text-xs text-muted-foreground space-y-1 ml-6">
              <li>• Current financial parameters</li>
              <li>• Revenue vs expense analysis</li>
              <li>• Runway calculations</li>
              <li>• Strategic recommendations</li>
              <li>• Scenario comparison data</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={generateReport}
              disabled={isGenerating}
              variant="success"
              className="w-full"
            >
              {isGenerating ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating Report...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4" />
                  <span>Generate Report</span>
                </div>
              )}
            </Button>

            {lastReport && (
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={downloadReport}
                  className="flex-1"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={shareReport}
                  className="flex-1"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            )}
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Flexprice Integration</span>
              <Badge variant="outline" className="text-xs">
                $0.25 per report
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};