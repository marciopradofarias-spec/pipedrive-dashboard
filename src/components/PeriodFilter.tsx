'use client';

import { Box, ToggleButtonGroup, ToggleButton, Paper } from '@mui/material';
import { CalendarToday } from '@mui/icons-material';

export type Period = 'today' | 'week' | 'month' | 'quarter' | 'year';

interface PeriodFilterProps {
  value: Period;
  onChange: (period: Period) => void;
}

export default function PeriodFilter({ value, onChange }: PeriodFilterProps) {
  const handleChange = (_event: React.MouseEvent<HTMLElement>, newPeriod: Period | null) => {
    if (newPeriod !== null) {
      onChange(newPeriod);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 1,
        backgroundColor: 'background.default',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CalendarToday sx={{ color: 'text.secondary', fontSize: '1.25rem' }} />
        <ToggleButtonGroup
          value={value}
          exclusive
          onChange={handleChange}
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              px: 2,
              py: 0.75,
              border: '1px solid',
              borderColor: 'divider',
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.875rem',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'primary.contrastText',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: 'primary.dark',
                },
              },
            },
          }}
        >
          <ToggleButton value="today">Hoje</ToggleButton>
          <ToggleButton value="week">Semana</ToggleButton>
          <ToggleButton value="month">Mês</ToggleButton>
          <ToggleButton value="quarter">Trimestre</ToggleButton>
          <ToggleButton value="year">Ano</ToggleButton>
        </ToggleButtonGroup>
      </Box>
    </Paper>
  );
}

