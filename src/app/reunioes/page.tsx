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
} from '@mui/material';
import { CalendarMonth, CheckCircle, Cancel, Schedule, EventAvailable } from '@mui/icons-material';
import Layout from '@/components/Layout';
import EnhancedMetricCard from '@/components/EnhancedMetricCard';
import CustomPieChart from '@/components/CustomPieChart';
import DashboardSkeleton from '@/components/DashboardSkeleton';

interface Metrics {
  general: {
    meetings_scheduled_stage: number;
    meetings_created_this_month: number;
    meetings_updated_this_month: number;
    meetings_scheduled_activities: number;
    total_meetings_scheduled: number;
    scheduled: number;
    no_show: number;
    realized_successfully: number;
  };
}

export default function ReunioesPage() {
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

  const meetingsData = [
    { name: 'Agendadas', value: metrics.general.scheduled },
    { name: 'Realizadas', value: metrics.general.realized_successfully },
    { name: 'Não Compareceu', value: metrics.general.no_show },
  ];

  const totalMeetings = metrics.general.scheduled + metrics.general.realized_successfully + metrics.general.no_show;
  const successRate = totalMeetings > 0 ? ((metrics.general.realized_successfully / totalMeetings) * 100).toFixed(1) : '0';

  return (
    <Layout>
      <Fade in timeout={500}>
        <Box>
          <Box mb={4}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
              }}
            >
              📅 Reuniões
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Análise de reuniões agendadas e realizadas
            </Typography>
          </Box>

          {/* Métricas de Reuniões */}
          <Grid container spacing={3} mb={4}>
            <Grow in timeout={600}>
              <Grid item xs={12} sm={6} md={3}>
                <EnhancedMetricCard
                  title="Reuniões Agendadas"
                  value={metrics.general.meetings_scheduled_stage}
                  subtitle="No estágio de reunião"
                  icon={<CalendarMonth />}
                  color="#2196f3"
                />
              </Grid>
            </Grow>

            <Grow in timeout={700}>
              <Grid item xs={12} sm={6} md={3}>
                <EnhancedMetricCard
                  title="Criadas Este Mês"
                  value={metrics.general.meetings_created_this_month}
                  subtitle="Novas reuniões"
                  icon={<EventAvailable />}
                  color="#4caf50"
                />
              </Grid>
            </Grow>

            <Grow in timeout={800}>
              <Grid item xs={12} sm={6} md={3}>
                <EnhancedMetricCard
                  title="Realizadas"
                  value={metrics.general.realized_successfully}
                  subtitle={`Taxa: ${successRate}%`}
                  icon={<CheckCircle />}
                  color="#ff9800"
                  trend={{
                    value: `${successRate}%`,
                    isPositive: parseFloat(successRate) >= 70,
                  }}
                />
              </Grid>
            </Grow>

            <Grow in timeout={900}>
              <Grid item xs={12} sm={6} md={3}>
                <EnhancedMetricCard
                  title="Não Compareceu"
                  value={metrics.general.no_show}
                  subtitle="No-show"
                  icon={<Cancel />}
                  color="#f44336"
                />
              </Grid>
            </Grow>
          </Grid>

          {/* Card de Resumo */}
          <Fade in timeout={1000}>
            <Card
              sx={{
                mb: 4,
                background: 'linear-gradient(135deg, #f3e5f5 0%, #ffffff 100%)',
                border: '1px solid #9c27b030',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 8px 24px rgba(156, 39, 176, 0.15)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: '#7b1fa2',
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  📊 Resumo de Atividades
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        p: 3,
                        backgroundColor: '#ffffff',
                        borderRadius: 2,
                        border: '1px solid #e0e0e0',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: '#9c27b0',
                          boxShadow: '0 2px 8px rgba(156, 39, 176, 0.1)',
                        },
                      }}
                    >
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, fontWeight: 600 }}>
                        Total de Reuniões Agendadas
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#2196f3', mb: 2 }}>
                        {metrics.general.total_meetings_scheduled}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Atividades do tipo reunião agendadas
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        p: 3,
                        backgroundColor: '#ffffff',
                        borderRadius: 2,
                        border: '1px solid #e0e0e0',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          borderColor: '#9c27b0',
                          boxShadow: '0 2px 8px rgba(156, 39, 176, 0.1)',
                        },
                      }}
                    >
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, fontWeight: 600 }}>
                        Atualizações Este Mês
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: '#ff9800', mb: 2 }}>
                        {metrics.general.meetings_updated_this_month}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Reuniões atualizadas no período
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Fade>

          {/* Gráfico de Distribuição */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Fade in timeout={1100}>
                <Box>
                  <CustomPieChart
                    title="Distribuição de Reuniões"
                    data={meetingsData}
                    icon="📊"
                  />
                </Box>
              </Fade>
            </Grid>

            <Grid item xs={12} md={6}>
              <Fade in timeout={1200}>
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px rgba(156, 39, 176, 0.15)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        mb: 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                      }}
                    >
                      📈 Indicadores de Performance
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, fontWeight: 600 }}>
                          Taxa de Sucesso
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 700, color: '#4caf50' }}>
                          {successRate}%
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                          {metrics.general.realized_successfully} de {totalMeetings} reuniões realizadas com sucesso
                        </Typography>
                      </Box>

                      <Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, fontWeight: 600 }}>
                          Taxa de No-Show
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 700, color: '#f44336' }}>
                          {totalMeetings > 0 ? ((metrics.general.no_show / totalMeetings) * 100).toFixed(1) : '0'}%
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                          {metrics.general.no_show} reuniões sem comparecimento
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            </Grid>
          </Grid>
        </Box>
      </Fade>
    </Layout>
  );
}

