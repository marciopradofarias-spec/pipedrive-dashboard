'use client';

import React, { useEffect, useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  TrendingUp,
  CheckCircle,
  Cancel,
  CalendarMonth,
} from '@mui/icons-material';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Layout from '@/components/Layout';
import MetricCard from '@/components/MetricCard';

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

const COLORS = ['#28a745', '#007bff', '#ffc107', '#dc3545', '#17a2b8'];

export default function DashboardPage() {
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

  if (loading && !metrics) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress size={60} />
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      </Layout>
    );
  }

  if (!metrics) {
    return (
      <Layout>
        <Alert severity="warning">Nenhuma métrica disponível</Alert>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box mb={4}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Dashboard Principal
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Visão geral das métricas de vendas e performance
        </Typography>
      </Box>

      {/* Performance Mensal */}
      <Card sx={{ mb: 4, backgroundColor: '#e8f5e8', borderLeft: '4px solid #28a745' }}>
        <CardContent>
          <Typography variant="h5" fontWeight={700} color="#155724" gutterBottom>
            📊 Performance Mensal ({metrics.general.current_month})
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="body1">
                <strong>Vendas fechadas no mês:</strong>{' '}
                <span style={{ color: '#28a745', fontWeight: 700 }}>
                  {metrics.general.monthly_won_count} negócios
                </span>{' '}
                ({formatCurrency(metrics.general.monthly_won_value)})
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body1">
                <strong>Vendas de ontem:</strong> {metrics.general.yesterday_won_count} negócios (
                {formatCurrency(metrics.general.yesterday_won_value)})
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body1">
                <strong>Dias no mês:</strong> {metrics.general.days_in_month} dias passados |{' '}
                {metrics.general.days_remaining} dias restantes
              </Typography>
            </Grid>
          </Grid>

          {metrics.monthly_stats_by_owner.length > 0 && (
            <Box mt={3} p={2} sx={{ backgroundColor: '#f8f9fa', borderRadius: 2 }}>
              <Typography variant="h6" fontWeight={700} color="#28a745" gutterBottom>
                💰 TOTAL: {formatCurrency(metrics.general.monthly_won_value)}
              </Typography>
              
              <Typography variant="subtitle1" fontWeight={700} mt={2} mb={1}>
                📊 Estatísticas por Vendedor:
              </Typography>
              {metrics.monthly_stats_by_owner.map((owner) => (
                <Typography key={owner.owner_name} variant="body2" sx={{ pl: 2, mb: 0.5 }}>
                  {owner.owner_name}: {owner.deal_count} negócios - {formatCurrency(owner.total_value)}
                </Typography>
              ))}

              <Typography variant="subtitle1" fontWeight={700} mt={2} mb={1}>
                🔄 Estatísticas por Pipeline:
              </Typography>
              {metrics.monthly_stats_by_pipeline.map((pipeline) => (
                <Typography key={pipeline.pipeline_name} variant="body2" sx={{ pl: 2, mb: 0.5 }}>
                  {pipeline.pipeline_name}: {pipeline.deal_count} negócios - {formatCurrency(pipeline.total_value)}
                </Typography>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Métricas do Dia */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Novos Negócios Hoje"
            value={metrics.general.new_count}
            subtitle={formatCurrency(metrics.general.new_value)}
            icon={<TrendingUp />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Negócios Ganhos Hoje"
            value={metrics.general.won_count}
            subtitle={formatCurrency(metrics.general.won_value)}
            icon={<CheckCircle />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Negócios Perdidos Hoje"
            value={metrics.general.lost_count}
            subtitle={formatCurrency(metrics.general.lost_value)}
            icon={<Cancel />}
            color="error"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Reuniões Agendadas"
            value={metrics.general.meetings_scheduled_stage}
            subtitle={`${metrics.general.meetings_created_this_month} criadas este mês`}
            icon={<CalendarMonth />}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3}>
        {/* Vendas por Vendedor */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Vendas por Vendedor (Este Mês)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={metrics.monthly_stats_by_owner}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="owner_name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="total_value" fill="#28a745" name="Valor Total" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Vendas por Pipeline */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Vendas por Pipeline (Este Mês)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={metrics.monthly_stats_by_pipeline}
                    dataKey="total_value"
                    nameKey="pipeline_name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => `${entry.pipeline_name}: ${formatCurrency(entry.total_value)}`}
                  >
                    {metrics.monthly_stats_by_pipeline.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Pipeline de Fechamento */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Pipeline de Fechamento (Oportunidades Ativas)
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Etapa</strong></TableCell>
                      <TableCell align="right"><strong>Nº de Negócios</strong></TableCell>
                      <TableCell align="right"><strong>Valor Total</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {metrics.closing_pipeline_summary.length > 0 ? (
                      metrics.closing_pipeline_summary.map((row) => (
                        <TableRow key={row.stage_name}>
                          <TableCell>{row.stage_name}</TableCell>
                          <TableCell align="right">{row.deal_count}</TableCell>
                          <TableCell align="right">{formatCurrency(row.total_value)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          Nenhum negócio nas etapas de fechamento
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

