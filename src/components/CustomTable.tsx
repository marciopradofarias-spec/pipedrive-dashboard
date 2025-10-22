'use client';

import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';

interface Column {
  id: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  format?: (value: any) => string;
  renderCell?: (value: any, row: any) => React.ReactNode;
}

interface CustomTableProps {
  title: string;
  icon?: string;
  columns: Column[];
  data: any[];
}

export default function CustomTable({
  title,
  icon = '📋',
  columns,
  data,
}: CustomTableProps) {
  return (
    <Card
      sx={{
        height: '100%',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
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

        <TableContainer
          sx={{
            maxHeight: 440,
            '&::-webkit-scrollbar': {
              width: '8px',
              height: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#4caf50',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: '#2e7d32',
              },
            },
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align || 'left'}
                    sx={{
                      fontWeight: 700,
                      backgroundColor: '#f5f5f5',
                      color: '#2e7d32',
                      textTransform: 'uppercase',
                      fontSize: '0.75rem',
                      letterSpacing: '0.5px',
                      borderBottom: '2px solid #4caf50',
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(76, 175, 80, 0.05)',
                      transform: 'scale(1.01)',
                    },
                    '&:last-child td': {
                      borderBottom: 0,
                    },
                  }}
                >
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell
                        key={column.id}
                        align={column.align || 'left'}
                        sx={{
                          fontSize: '0.875rem',
                          py: 2,
                        }}
                      >
                        {column.renderCell
                          ? column.renderCell(value, row)
                          : column.format
                          ? column.format(value)
                          : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {data.length === 0 && (
          <Box
            sx={{
              py: 6,
              textAlign: 'center',
              color: 'text.secondary',
            }}
          >
            <Typography variant="body1">Nenhum dado disponível</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

