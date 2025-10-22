'use client';

import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  Fade,
  Grow,
} from '@mui/material';
import {
  TrendingUp,
  CheckCircle,
  Cancel,
  CalendarMonth,
} from '@mui/icons-material';
import Layout from '@/components/Layout';
import EnhancedMetricCard from '@/components/EnhancedMetricCard';
import PeriodFilter, { Period } from '@/components/PeriodFilter';
import DashboardSkeleton from '@/components/DashboardSkeleton';
import CustomBarChart from '@/components/CustomBarChart';
import CustomPieChart from '@/components/CustomPieChart';
import CustomTable from '@/components/CustomTable';

interface Metrics {
  general: {
    monthly_won_count: number;
    monthly_won_value: number;
    yesterday_won_count: number;
    yesterday_won_value: number;
    new_count: number;
    new_value: number;
    won_count: number;
    won_value: number;
    lost_count: number;
    lost_value: number;
    meetings_scheduled_stage: number;
    meetings_created_this_month: number;
    current_month: string;
    days_in_month: number;
    days_remaining: number;
  };
  monthly_stats_by_owner: Array<{
    owner_name: string;
    deal_count: number;
    total_value: number;
  }>;
  monthly_stats_by_pipeline: Array<{
    pipeline_name: string;
    deal_count: number;
    total_value: number;
  }>;
  closing_pipeline_summary: Array<{
    stage_name: string;
    deal_count: number;
    total_value: number;
  }>;
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<Period>('month');

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [period]);

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

  const salesByOwner = metrics.monthly_stats_by_owner.map((item) => ({
    name: item.owner_name,
    value: item.total_value,
  }));

  const salesByPipeline = metrics.monthly_stats_by_pipeline.map((item) => ({
    name: item.pipeline_name,
    value: item.total_value,
  }));

  const pipelineTableColumns = [
    {
      id: 'stage_name',
      label: 'Estágio',
      align: 'left' as const,
    },
    {
      id: 'deal_count',
      label: 'Negócios',
      align: 'center' as const,
    },
    {
      id: 'total_value',
      label: 'Valor Total',
      align: 'right' as const,
      format: formatCurrency,
    },
  ];

  return (
    <Layout>
      <Fade in timeout={500}>
        <Box>
          {/* Filtro de Período */}
          <Box sx={{ mb: 4 }}>
            <PeriodFilter value={period} onChange={setPeriod} />
          </Box>

          {/* Cards de Métricas */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grow in timeout={600}>
              <Grid item xs={12} sm={6} md={3}>
                <EnhancedMetricCard
                  title="Novos Negócios"
                  value={metrics.general.new_count}
                  subtitle={formatCurrency(metrics.general.new_value)}
                  icon={<TrendingUp />}
                  color="#2196f3"
                />
              </Grid>
            </Grow>

            <Grow in timeout={700}>
              <Grid item xs={12} sm={6} md={3}>
                <EnhancedMetricCard
                  title="Negócios Ganhos"
                  value={metrics.general.won_count}
                  subtitle={formatCurrency(metrics.general.won_value)}
                  icon={<CheckCircle />}
                  color="#4caf50"
                />
              </Grid>
            </Grow>

            <Grow in timeout={800}>
              <Grid item xs={12} sm={6} md={3}>
                <EnhancedMetricCard
                  title="Negócios Perdidos"
                  value={metrics.general.lost_count}
                  subtitle={formatCurrency(metrics.general.lost_value)}
                  icon={<Cancel />}
                  color="#f44336"
                />
              </Grid>
            </Grow>

            <Grow in timeout={900}>
              <Grid item xs={12} sm={6} md={3}>
                <EnhancedMetricCard
                  title="Reuniões Agendadas"
                  value={metrics.general.meetings_scheduled_stage}
                  subtitle={`${metrics.general.meetings_created_this_month} criadas este mês`}
                  icon={<CalendarMonth />}
                  color="#ff9800"
                />
              </Grid>
            </Grow>
          </Grid>

          {/* Performance Mensal */}
          <Fade in timeout={1000}>
            <Card
              sx={{
                mb: 4,
                background: 'linear-gradient(135deg, #e8f5e9 0%, #ffffff 100%)',
                border: '1px solid #4caf5030',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 8px 24px rgba(76, 175, 80, 0.15)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: '#2e7d32',
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  📊 Performance Mensal ({metrics.general.current_month})
                </Typography>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                    Vendas fechadas no mês: <span style={{ color: '#4caf50', fontSize: '1.25rem' }}>{metrics.general.monthly_won_count} negócios</span> ({formatCurrency(metrics.general.monthly_won_value)})
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                    Vendas de ontem: {metrics.general.yesterday_won_count} negócios ({formatCurrency(metrics.general.yesterday_won_value)})
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Dias no mês: {metrics.general.days_in_month - metrics.general.days_remaining} dias passados | {metrics.general.days_remaining} dias restantes
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 2,
                    backgroundColor: '#ffffff',
                    borderRadius: 2,
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    lineHeight: 1.8,
                    border: '1px solid #e0e0e0',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      borderColor: '#4caf50',
                      boxShadow: '0 2px 8px rgba(76, 175, 80, 0.1)',
                    },
                  }}
                >
                  <Typography variant="body2" component="div" sx={{ whiteSpace: 'pre-line' }}>
                    💰 TOTAL: {formatCurrency(metrics.general.monthly_won_value)}
                    {'\n\n'}
                    📊 Estatísticas por Vendedor:
                    {metrics.monthly_stats_by_owner.map((owner) => (
                      `\n   ${owner.owner_name}: ${owner.deal_count} negócios - ${formatCurrency(owner.total_value)}`
                    )).join('')}
                    {'\n\n'}
                    🔄 Estatísticas por Pipeline:
                    {metrics.monthly_stats_by_pipeline.map((pipeline) => (
                      `\n   ${pipeline.pipeline_name}: ${pipeline.deal_count} negócios - ${formatCurrency(pipeline.total_value)}`
                    )).join('')}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Fade>

          {/* Gráficos */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Fade in timeout={1100}>
                <Box>
                  <CustomBarChart
                    title="Vendas por Vendedor"
                    data={salesByOwner}
                    formatValue={formatCurrency}
                    icon="👥"
                  />
                </Box>
              </Fade>
            </Grid>

            <Grid item xs={12} md={6}>
              <Fade in timeout={1200}>
                <Box>
                  <CustomPieChart
                    title="Vendas por Pipeline"
                    data={salesByPipeline}
                    formatValue={formatCurrency}
                    icon="🔄"
                  />
                </Box>
              </Fade>
            </Grid>
          </Grid>

          {/* Pipeline de Fechamento */}
          <Fade in timeout={1300}>
            <Box>
              <CustomTable
                title="Pipeline de Fechamento"
                icon="🎯"
                columns={pipelineTableColumns}
                data={metrics.closing_pipeline_summary}
              />
            </Box>
          </Fade>
        </Box>
      </Fade>
    </Layout>
  );
}

