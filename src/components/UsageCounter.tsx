import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, FileText, Activity } from 'lucide-react';

interface UsageCounterProps {
  scenarios: number;
  reports: number;
}

export const UsageCounter: React.FC<UsageCounterProps> = ({ scenarios, reports }) => {
  return (
    <Card className="shadow-card-hover">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Scenarios</p>
              <p className="font-bold text-foreground">{scenarios}</p>
            </div>
          </div>
          
          <div className="h-8 w-px bg-border"></div>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
              <FileText className="w-4 h-4 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Reports</p>
              <p className="font-bold text-foreground">{reports}</p>
            </div>
          </div>
          
          <div className="h-8 w-px bg-border"></div>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-warning/10 rounded-full flex items-center justify-center">
              <Activity className="w-4 h-4 text-warning" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Billing</p>
              <Badge variant="outline" className="text-xs">
                ${(scenarios * 0.10 + reports * 0.25).toFixed(2)}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};