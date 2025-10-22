'use client';

import { Card, CardContent, Typography, Box } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface CustomBarChartProps {
  title: string;
  data: Array<{ name: string; value: number }>;
  formatValue?: (value: number) => string;
  color?: string;
  icon?: string;
}

const COLORS = ['#2e7d32', '#66bb6a', '#a5d6a7', '#81c784', '#4caf50'];

export default function CustomBarChart({
  title,
  data,
  formatValue = (value) => value.toString(),
  color = '#2e7d32',
  icon = '📊',
}: CustomBarChartProps) {
  return (
    <Card
      sx={{
        height: '100%',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px rgba(46, 125, 50, 0.15)',
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Typography
            component="span"
            sx={{
              fontSize: '1.5rem',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
            }}
          >
            {icon}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              letterSpacing: '-0.5px',
            }}
          >
            {title}
          </Typography>
        </Box>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
          >
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={1} />
                <stop offset="100%" stopColor={color} stopOpacity={0.7} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e0e0e0"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              stroke="#666"
              style={{ fontSize: '0.875rem', fontWeight: 500 }}
              tick={{ fill: '#666' }}
            />
            <YAxis
              stroke="#666"
              style={{ fontSize: '0.875rem' }}
              tick={{ fill: '#666' }}
            />
            <Tooltip
              formatter={(value: number) => [formatValue(value), 'Valor']}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                padding: '12px',
              }}
              cursor={{ fill: 'rgba(46, 125, 50, 0.05)' }}
            />
            <Legend
              wrapperStyle={{
                paddingTop: '20px',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            />
            <Bar
              dataKey="value"
              fill="url(#barGradient)"
              name="Valor Total"
              radius={[8, 8, 0, 0]}
              animationDuration={1000}
              animationBegin={0}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

