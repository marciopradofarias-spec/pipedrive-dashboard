'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import { CalendarMonth, CheckCircle, Cancel, Schedule } from '@mui/icons-material';
import Layout from '@/components/Layout';
import MetricCard from '@/components/MetricCard';

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
          Reuniões
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Análise de reuniões agendadas e realizadas
        </Typography>
      </Box>

      {/* Métricas de Reuniões */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Agendadas"
            value={metrics.general.meetings_scheduled_stage}
            subtitle="Total geral no estágio"
            icon={<CalendarMonth />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Criadas Este Mês"
            value={metrics.general.meetings_created_this_month}
            subtitle="Novas reuniões"
            icon={<Schedule />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Atualizadas Este Mês"
            value={metrics.general.meetings_updated_this_month}
            subtitle="Movimentações recentes"
            icon={<Schedule />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Atividades Futuras"
            value={metrics.general.meetings_scheduled_activities}
            subtitle="Próximas atividades"
            icon={<Schedule />}
            color="secondary"
          />
        </Grid>
      </Grid>

      {/* Métricas do Dia */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            title="Agendadas Hoje"
            value={metrics.general.scheduled}
            subtitle="Reuniões marcadas hoje"
            icon={<CalendarMonth />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            title="No-Show Hoje"
            value={metrics.general.no_show}
            subtitle="Reuniões não compareceram"
            icon={<Cancel />}
            color="error"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            title="Realizadas com Sucesso"
            value={metrics.general.realized_successfully}
            subtitle="Reuniões bem-sucedidas"
            icon={<CheckCircle />}
            color="success"
          />
        </Grid>
      </Grid>

      {/* Informações Detalhadas */}
      <Card sx={{ backgroundColor: '#fff3cd', borderLeft: '4px solid #ffc107' }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} color="#856404" gutterBottom>
            📅 Sobre as Reuniões Agendadas
          </Typography>
          <Box mt={2}>
            <Typography variant="body1" paragraph>
              <strong>Total geral no estágio "Reunião Agendada":</strong>{' '}
              {metrics.general.meetings_scheduled_stage} negócios
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Reuniões criadas este mês:</strong>{' '}
              {metrics.general.meetings_created_this_month} negócios
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Reuniões atualizadas este mês:</strong>{' '}
              {metrics.general.meetings_updated_this_month} negócios
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Atividades futuras agendadas:</strong>{' '}
              {metrics.general.meetings_scheduled_activities} atividades
            </Typography>
          </Box>
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>📝 Nota:</strong> O "Total geral" inclui negócios históricos que permanecem no
              estágio "Reunião Agendada". Os números "este mês" mostram apenas a movimentação recente.
            </Typography>
          </Alert>
        </CardContent>
      </Card>
    </Layout>
  );
}

