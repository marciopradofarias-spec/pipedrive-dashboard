'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  Grid,
  Fade,
  Grow,
  LinearProgress,
} from '@mui/material';
import { TrendingUp, AttachMoney, Assessment, Timeline } from '@mui/icons-material';
import Layout from '@/components/Layout';
import EnhancedMetricCard from '@/components/EnhancedMetricCard';
import CustomTable from '@/components/CustomTable';
import DashboardSkeleton from '@/components/DashboardSkeleton';

interface Metrics {
  general: {
    monthly_won_count: number;
    monthly_won_value: number;
  };
  closing_pipeline_summary: Array<{
    stage_name: string;
    deal_count: number;
    total_value: number;
  }>;
}

export default function PipelinePage() {
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

  const totalDealsInPipeline = metrics.closing_pipeline_summary.reduce(
    (sum, stage) => sum + stage.deal_count,
    0
  );
  const totalValueInPipeline = metrics.closing_pipeline_summary.reduce(
    (sum, stage) => sum + stage.total_value,
    0
  );

  const tableColumns = [
    {
      id: 'stage_name',
      label: 'Estágio',
      align: 'left' as const,
      renderCell: (value: string) => (
        <Typography sx={{ fontWeight: 600 }}>
          {value}
        </Typography>
      ),
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
    {
      id: 'percentage',
      label: '% do Total',
      align: 'center' as const,
      renderCell: (_value: any, row: any) => {
        const percentage = (row.total_value / totalValueInPipeline) * 100;
        return (
          <Box sx={{ width: '100%', px: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LinearProgress
                variant="determinate"
                value={percentage}
                sx={{
                  flex: 1,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#4caf50',
                    borderRadius: 4,
                  },
                }}
              />
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, minWidth: 45 }}>
                {percentage.toFixed(1)}%
              </Typography>
            </Box>
          </Box>
        );
      },
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
                background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}
            >
              🎯 Pipeline de Vendas
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Análise do funil de vendas e estágios do pipeline
            </Typography>
          </Box>

          {/* Cards de Métricas */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grow in timeout={600}>
              <Grid item xs={12} sm={6} md={3}>
                <EnhancedMetricCard
                  title="Negócios no Pipeline"
                  value={totalDealsInPipeline}
                  subtitle="Total de negócios ativos"
                  icon={<Timeline />}
                  color="#2196f3"
                />
              </Grid>
            </Grow>

            <Grow in timeout={700}>
              <Grid item xs={12} sm={6} md={3}>
                <EnhancedMetricCard
                  title="Valor no Pipeline"
                  value={formatCurrency(totalValueInPipeline)}
                  subtitle="Valor total em negociação"
                  icon={<AttachMoney />}
                  color="#4caf50"
                />
              </Grid>
            </Grow>

            <Grow in timeout={800}>
              <Grid item xs={12} sm={6} md={3}>
                <EnhancedMetricCard
                  title="Fechados no Mês"
                  value={metrics.general.monthly_won_count}
                  subtitle={formatCurrency(metrics.general.monthly_won_value)}
                  icon={<TrendingUp />}
                  color="#ff9800"
                />
              </Grid>
            </Grow>

            <Grow in timeout={900}>
              <Grid item xs={12} sm={6} md={3}>
                <EnhancedMetricCard
                  title="Estágios Ativos"
                  value={metrics.closing_pipeline_summary.length}
                  subtitle="Total de estágios"
                  icon={<Assessment />}
                  color="#9c27b0"
                />
              </Grid>
            </Grow>
          </Grid>

          {/* Funil Visual */}
          <Fade in timeout={1000}>
            <Card
              sx={{
                mb: 4,
                background: 'linear-gradient(135deg, #fff3e0 0%, #ffffff 100%)',
                border: '1px solid #ff980030',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 8px 24px rgba(255, 152, 0, 0.15)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: '#f57c00',
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  📊 Visão Geral do Funil
                </Typography>

                <Grid container spacing={2}>
                  {metrics.closing_pipeline_summary.map((stage, index) => {
                    const percentage = (stage.total_value / totalValueInPipeline) * 100;
                    return (
                      <Grid item xs={12} key={stage.stage_name}>
                        <Box
                          sx={{
                            p: 2,
                            backgroundColor: '#ffffff',
                            borderRadius: 2,
                            border: '1px solid #e0e0e0',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              borderColor: '#ff9800',
                              boxShadow: '0 2px 8px rgba(255, 152, 0, 0.1)',
                              transform: 'translateX(4px)',
                            },
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography sx={{ fontWeight: 600, fontSize: '1rem' }}>
                              {index + 1}. {stage.stage_name}
                            </Typography>
                            <Typography sx={{ fontWeight: 700, color: '#4caf50', fontSize: '1.1rem' }}>
                              {formatCurrency(stage.total_value)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <LinearProgress
                              variant="determinate"
                              value={percentage}
                              sx={{
                                flex: 1,
                                height: 10,
                                borderRadius: 5,
                                backgroundColor: '#e0e0e0',
                                '& .MuiLinearProgress-bar': {
                                  background: 'linear-gradient(90deg, #ff9800 0%, #f57c00 100%)',
                                  borderRadius: 5,
                                },
                              }}
                            />
                            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, minWidth: 80 }}>
                              {stage.deal_count} negócios
                            </Typography>
                            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, minWidth: 50, color: '#ff9800' }}>
                              {percentage.toFixed(1)}%
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    );
                  })}
                </Grid>
              </CardContent>
            </Card>
          </Fade>

          {/* Tabela Detalhada */}
          <Fade in timeout={1100}>
            <Box>
              <CustomTable
                title="Detalhamento por Estágio"
                icon="📋"
                columns={tableColumns}
                data={metrics.closing_pipeline_summary}
              />
            </Box>
          </Fade>
        </Box>
      </Fade>
    </Layout>
  );
}

