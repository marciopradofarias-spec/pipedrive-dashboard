'use client';

import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactElement;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
}

export default function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  color = 'primary',
}: MetricCardProps) {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp fontSize="small" sx={{ color: 'success.main' }} />;
    if (trend === 'down') return <TrendingDown fontSize="small" sx={{ color: 'error.main' }} />;
    return null;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'success.main';
    if (trend === 'down') return 'error.main';
    return 'text.secondary';
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'visible',
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Typography color="text.secondary" variant="body2" fontWeight={600}>
            {title}
          </Typography>
          {icon && (
            <Box
              sx={{
                color: `${color}.main`,
                backgroundColor: `${color}.light`,
                borderRadius: '50%',
                p: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {React.cloneElement(icon, { fontSize: 'small' })}
            </Box>
          )}
        </Box>
        <Typography variant="h4" component="div" fontWeight={700} color={`${color}.main`}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary" mt={1}>
            {subtitle}
          </Typography>
        )}
        {trendValue && (
          <Box display="flex" alignItems="center" mt={1} gap={0.5}>
            {getTrendIcon()}
            <Typography variant="body2" color={getTrendColor()} fontWeight={600}>
              {trendValue}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

