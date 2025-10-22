'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  Grid,
  Avatar,
  Fade,
  Grow,
  Chip,
} from '@mui/material';
import { EmojiEvents, TrendingUp, AttachMoney } from '@mui/icons-material';
import Layout from '@/components/Layout';
import DashboardSkeleton from '@/components/DashboardSkeleton';
import CustomBarChart from '@/components/CustomBarChart';
import CustomTable from '@/components/CustomTable';
import EnhancedMetricCard from '@/components/EnhancedMetricCard';

interface Metrics {
  general: {
    monthly_won_value: number;
  };
  monthly_stats_by_owner: Array<{
    owner_name: string;
    deal_count: number;
    total_value: number;
  }>;
  by_owner: Array<{
    owner_name: string;
    new_count: number;
    won_count: number;
    lost_count: number;
    activity_count: number;
  }>;
}

export default function VendedoresPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/metrics');
      const data = await response.json();
      
      if (data.success) {
        setMetrics(data.data);
        setError(null);
      } else {
        setError(data.error || 'Erro ao carregar métricas');
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getMedalColor = (index: number) => {
    switch (index) {
      case 0:
        return '#FFD700'; // Gold
      case 1:
        return '#C0C0C0'; // Silver
      case 2:
        return '#CD7F32'; // Bronze
      default:
        return '#e0e0e0';
    }
  };

  const getMedalEmoji = (index: number) => {
    switch (index) {
      case 0:
        return '🥇';
      case 1:
        return '🥈';
      case 2:
        return '🥉';
      default:
        return '🏅';
    }
  };

  if (error) {
    return (
      <Layout>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Layout>
    );
  }

  if (loading || !metrics) {
    return (
      <Layout>
        <DashboardSkeleton />
      </Layout>
    );
  }

  const chartData = metrics.monthly_stats_by_owner.map((owner) => ({
    name: owner.owner_name,
    value: owner.total_value,
  }));

  const tableColumns = [
    {
      id: 'position',
      label: 'Posição',
      align: 'center' as const,
      renderCell: (_value: any, row: any, index: number) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: '1.5rem' }}>{getMedalEmoji(index)}</Typography>
          <Chip
            label={`#${index + 1}`}
            size="small"
            sx={{
              backgroundColor: getMedalColor(index),
              color: '#000',
              fontWeight: 700,
            }}
          />
        </Box>
      ),
    },
    {
      id: 'owner_name',
      label: 'Vendedor',
      align: 'left' as const,
      renderCell: (value: string) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              backgroundColor: 'primary.main',
              fontWeight: 600,
              width: 40,
              height: 40,
            }}
          >
            {getInitials(value)}
          </Avatar>
          <Typography sx={{ fontWeight: 600 }}>{value}</Typography>
        </Box>
      ),
    },
    {
      id: 'deal_count',
      label: 'Negócios',
      align: 'center' as const,
      renderCell: (value: number) => (
        <Chip
          label={value}
          color="primary"
          size="small"
          sx={{ fontWeight: 600 }}
        />
      ),
    },
    {
      id: 'total_value',
      label: 'Valor Total',
      align: 'right' as const,
      format: formatCurrency,
    },
    {
      id: 'avg_value',
      label: 'Ticket Médio',
      align: 'right' as const,
      renderCell: (_value: any, row: any) => (
        <Typography sx={{ fontWeight: 600, color: '#2e7d32' }}>
          {formatCurrency(row.total_value / row.deal_count)}
        </Typography>
      ),
    },
  ];

  const topSeller = metrics.monthly_stats_by_owner[0];
  const totalValue = metrics.general.monthly_won_value;
  const avgTicket = totalValue / metrics.monthly_stats_by_owner.reduce((sum, o) => sum + o.deal_count, 0);

  return (
    <Layout>
      <Fade in timeout={500}>
        <Box>
          <Box mb={4}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}
            >
              👥 Vendedores
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Rankings e performance individual dos vendedores
            </Typography>
          </Box>

          {/* Cards de Métricas Gerais */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grow in timeout={600}>
              <Grid item xs={12} sm={6} md={4}>
                <EnhancedMetricCard
                  title="Top Vendedor"
                  value={topSeller.owner_name}
                  subtitle={formatCurrency(topSeller.total_value)}
                  icon={<EmojiEvents />}
                  color="#FFD700"
                />
              </Grid>
            </Grow>

            <Grow in timeout={700}>
              <Grid item xs={12} sm={6} md={4}>
                <EnhancedMetricCard
                  title="Faturamento Total"
                  value={formatCurrency(totalValue)}
                  subtitle="Este mês"
                  icon={<AttachMoney />}
                  color="#4caf50"
                />
              </Grid>
            </Grow>

            <Grow in timeout={800}>
              <Grid item xs={12} sm={6} md={4}>
                <EnhancedMetricCard
                  title="Ticket Médio"
                  value={formatCurrency(avgTicket)}
                  subtitle="Média geral"
                  icon={<TrendingUp />}
                  color="#2196f3"
                />
              </Grid>
            </Grow>
          </Grid>

          {/* Pódio dos Vendedores */}
          <Fade in timeout={900}>
            <Card
              sx={{
                mb: 4,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 32px rgba(102, 126, 234, 0.3)',
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box display="flex" alignItems="center" mb={3}>
                  <EmojiEvents sx={{ fontSize: 48, mr: 2 }} />
                  <Typography variant="h5" fontWeight={700}>
                    🏆 Ranking do Mês
                  </Typography>
                </Box>
                <Grid container spacing={3} justifyContent="center">
                  {metrics.monthly_stats_by_owner.slice(0, 3).map((owner, index) => (
                    <Grid item xs={12} sm={4} key={owner.owner_name}>
                      <Grow in timeout={1000 + index * 100}>
                        <Box
                          textAlign="center"
                          p={3}
                          sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.15)',
                            borderRadius: 3,
                            backdropFilter: 'blur(10px)',
                            border: '2px solid rgba(255, 255, 255, 0.2)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              backgroundColor: 'rgba(255, 255, 255, 0.25)',
                              transform: 'scale(1.05)',
                            },
                          }}
                        >
                          <Typography sx={{ fontSize: '3rem', mb: 1 }}>
                            {getMedalEmoji(index)}
                          </Typography>
                          <Avatar
                            sx={{
                              width: 80,
                              height: 80,
                              margin: '0 auto',
                              mb: 2,
                              backgroundColor: getMedalColor(index),
                              color: '#000',
                              fontSize: '2rem',
                              fontWeight: 700,
                              border: '4px solid rgba(255, 255, 255, 0.3)',
                            }}
                          >
                            {index + 1}
                          </Avatar>
                          <Typography variant="h6" fontWeight={700}>
                            {owner.owner_name}
                          </Typography>
                          <Typography variant="h5" fontWeight={700} mt={1}>
                            {formatCurrency(owner.total_value)}
                          </Typography>
                          <Typography variant="body2" mt={1} sx={{ opacity: 0.9 }}>
                            {owner.deal_count} negócios fechados
                          </Typography>
                        </Box>
                      </Grow>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Fade>

          {/* Gráfico de Performance */}
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12}>
              <Fade in timeout={1100}>
                <Box>
                  <CustomBarChart
                    title="Performance por Vendedor (Este Mês)"
                    data={chartData}
                    formatValue={formatCurrency}
                    icon="📈"
                  />
                </Box>
              </Fade>
            </Grid>
          </Grid>

          {/* Tabela Detalhada */}
          <Fade in timeout={1200}>
            <Box>
              <CustomTable
                title="Estatísticas Detalhadas"
                icon="📊"
                columns={tableColumns}
                data={metrics.monthly_stats_by_owner}
              />
            </Box>
          </Fade>
        </Box>
      </Fade>
    </Layout>
  );
}

