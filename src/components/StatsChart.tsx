import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from "lucide-react";

interface RegionalData {
  region: string;
  candidates: number;
  passed: number;
  passRate: number;
}

interface StatsChartProps {
  data: RegionalData[];
  examType: string;
}

export const StatsChart = ({ data, examType }: StatsChartProps) => {
  const isBac = examType.startsWith('BAC-');
  const titleText = isBac ? 'Taux de Réussite par Centre' : 'Taux de Réussite par Région';
  const labelText = isBac ? 'Centre' : 'Région';
  
  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          <CardTitle>{titleText}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="region" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              label={{ value: 'Taux (%)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              formatter={(value: number) => [`${value}%`, 'Taux de Réussite']}
              labelFormatter={(label) => `${labelText}: ${label}`}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Bar 
              dataKey="passRate" 
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};