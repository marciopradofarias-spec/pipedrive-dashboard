'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  Chip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Fade,
  Grow,
  Paper,
} from '@mui/material';
import { CheckCircle, Cancel, Schedule, TrendingUp } from '@mui/icons-material';
import Layout from '@/components/Layout';
import EnhancedMetricCard from '@/components/EnhancedMetricCard';
import CustomTable from '@/components/CustomTable';
import DashboardSkeleton from '@/components/DashboardSkeleton';

interface Deal {
  id: number;
  title: string;
  value: number;
  status: string;
  owner_name: string;
  pipeline_name: string;
  won_time?: string;
  lost_time?: string;
  add_time: string;
}

export default function VendasPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('won');
  const [periodFilter, setPeriodFilter] = useState('month');

  useEffect(() => {
    fetchDeals();
  }, [statusFilter, periodFilter]);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/deals?status=${statusFilter}&period=${periodFilter}`);
      const data = await response.json();
      
      if (data.success) {
        setDeals(data.data);
        setError(null);
      } else {
        setError(data.error || 'Erro ao carregar negócios');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao conectar com a API');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'won':
        return 'success';
      case 'lost':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'won':
        return 'Ganho';
      case 'lost':
        return 'Perdido';
      case 'open':
        return 'Aberto';
      default:
        return status;
    }
  };

  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const avgValue = deals.length > 0 ? totalValue / deals.length : 0;

  if (error) {
    return (
      <Layout>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Layout>
    );
  }

  if (loading && deals.length === 0) {
    return (
      <Layout>
        <DashboardSkeleton />
      </Layout>
    );
  }

  const tableColumns = [
    {
      id: 'title',
      label: 'Negócio',
      align: 'left' as const,
      renderCell: (value: string) => (
        <Typography sx={{ fontWeight: 600, maxWidth: 300 }}>
          {value}
        </Typography>
      ),
    },
    {
      id: 'value',
      label: 'Valor',
      align: 'right' as const,
      format: formatCurrency,
    },
    {
      id: 'status',
      label: 'Status',
      align: 'center' as const,
      renderCell: (value: string) => (
        <Chip
          label={getStatusLabel(value)}
          color={getStatusColor(value) as any}
          size="small"
          sx={{ fontWeight: 600 }}
        />
      ),
    },
    {
      id: 'owner_name',
      label: 'Vendedor',
      align: 'left' as const,
    },
    {
      id: 'pipeline_name',
      label: 'Pipeline',
      align: 'left' as const,
      renderCell: (value: string) => (
        <Chip
          label={value}
          size="small"
          variant="outlined"
          sx={{ fontWeight: 500 }}
        />
      ),
    },
    {
      id: 'add_time',
      label: 'Data',
      align: 'center' as const,
      format: formatDate,
    },
  ];

  return (
    <Layout>
      <Fade in timeout={500}>
        <Box>
          <Box mb={4}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #4caf50 0%, #2e7d32 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}
            >
              💰 Vendas
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Análise detalhada de negócios e vendas
            </Typography>
          </Box>

          {/* Filtros */}
          <Fade in timeout={600}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                mb: 4,
                backgroundColor: 'background.default',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                🔍 Filtros
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={statusFilter}
                      label="Status"
                      onChange={(e) => setStatusFilter(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'divider',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'primary.main',
                        },
                      }}
                    >
                      <MenuItem value="won">Ganhos</MenuItem>
                      <MenuItem value="lost">Perdidos</MenuItem>
                      <MenuItem value="open">Abertos</MenuItem>
                      <MenuItem value="all">Todos</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth>
                    <InputLabel>Período</InputLabel>
                    <Select
                      value={periodFilter}
                      label="Período"
                      onChange={(e) => setPeriodFilter(e.target.value)}
                      sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'divider',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'primary.main',
                        },
                      }}
                    >
                      <MenuItem value="today">Hoje</MenuItem>
                      <MenuItem value="week">Esta Semana</MenuItem>
                      <MenuItem value="month">Este Mês</MenuItem>
                      <MenuItem value="quarter">Este Trimestre</MenuItem>
                      <MenuItem value="year">Este Ano</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
          </Fade>

          {/* Cards de Métricas */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grow in timeout={700}>
              <Grid item xs={12} sm={6} md={4}>
                <EnhancedMetricCard
                  title="Total de Negócios"
                  value={deals.length}
                  subtitle={`Status: ${getStatusLabel(statusFilter)}`}
                  icon={<Schedule />}
                  color="#2196f3"
                />
              </Grid>
            </Grow>

            <Grow in timeout={800}>
              <Grid item xs={12} sm={6} md={4}>
                <EnhancedMetricCard
                  title="Valor Total"
                  value={formatCurrency(totalValue)}
                  subtitle={`${deals.length} negócios`}
                  icon={statusFilter === 'won' ? <CheckCircle /> : statusFilter === 'lost' ? <Cancel /> : <Schedule />}
                  color={statusFilter === 'won' ? '#4caf50' : statusFilter === 'lost' ? '#f44336' : '#ff9800'}
                />
              </Grid>
            </Grow>

            <Grow in timeout={900}>
              <Grid item xs={12} sm={6} md={4}>
                <EnhancedMetricCard
                  title="Ticket Médio"
                  value={formatCurrency(avgValue)}
                  subtitle="Média por negócio"
                  icon={<TrendingUp />}
                  color="#9c27b0"
                />
              </Grid>
            </Grow>
          </Grid>

          {/* Tabela de Negócios */}
          <Fade in timeout={1000}>
            <Box>
              <CustomTable
                title={`Negócios ${getStatusLabel(statusFilter)} - ${periodFilter === 'today' ? 'Hoje' : periodFilter === 'week' ? 'Esta Semana' : periodFilter === 'month' ? 'Este Mês' : periodFilter === 'quarter' ? 'Este Trimestre' : 'Este Ano'}`}
                icon="📋"
                columns={tableColumns}
                data={deals}
              />
            </Box>
          </Fade>
        </Box>
      </Fade>
    </Layout>
  );
}

