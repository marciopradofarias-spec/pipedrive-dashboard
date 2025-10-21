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
import { TrendingUp, AttachMoney, Assessment } from '@mui/icons-material';
import { FunnelChart, Funnel, LabelList, Tooltip, ResponsiveContainer } from 'recharts';
import Layout from '@/components/Layout';
import MetricCard from '@/components/MetricCard';

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

  const totalDealsInPipeline = metrics.closing_pipeline_summary.reduce(
    (sum, stage) => sum + stage.deal_count,
    0
  );
  const totalValueInPipeline = metrics.closing_pipeline_summary.reduce(
    (sum, stage) => sum + stage.total_value,
    0
  );

  // Prepare funnel data
  const funnelData = metrics.closing_pipeline_summary.map((stage) => ({
    name: stage.stage_name,
    value: stage.deal_count,
    fill: stage.stage_name === 'Oportunidade' ? '#28a745' : stage.stage_name === 'Negociação' ? '#ffc107' : '#007bff',
  }));

  return (
    <Layout>
      <Box mb={4}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Pipeline de Vendas
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Análise do funil de vendas e oportunidades ativas
        </Typography>
      </Box>

      {/* Métricas Resumidas */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            title="Negócios no Pipeline"
            value={totalDealsInPipeline}
            subtitle="Oportunidades ativas"
            icon={<Assessment />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            title="Valor Total no Pipeline"
            value={formatCurrency(totalValueInPipeline)}
            subtitle="Potencial de receita"
            icon={<AttachMoney />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            title="Vendas Fechadas (Mês)"
            value={metrics.general.monthly_won_count}
            subtitle={formatCurrency(metrics.general.monthly_won_value)}
            icon={<TrendingUp />}
            color="info"
          />
        </Grid>
      </Grid>

      {/* Funil de Vendas */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Funil de Vendas
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <FunnelChart>
                  <Tooltip formatter={(value: number) => `${value} negócios`} />
                  <Funnel dataKey="value" data={funnelData} isAnimationActive>
                    <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
                  </Funnel>
                </FunnelChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Detalhes por Etapa
              </Typography>
              <Box mt={3}>
                {metrics.closing_pipeline_summary.length > 0 ? (
                  metrics.closing_pipeline_summary.map((stage, index) => (
                    <Box
                      key={stage.stage_name}
                      mb={3}
                      p={2}
                      sx={{
                        backgroundColor: index === 0 ? '#e8f5e8' : index === 1 ? '#fff3cd' : '#d1ecf1',
                        borderRadius: 2,
                        borderLeft: `4px solid ${index === 0 ? '#28a745' : index === 1 ? '#ffc107' : '#007bff'}`,
                      }}
                    >
                      <Typography variant="h6" fontWeight={700} gutterBottom>
                        {stage.stage_name}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Negócios:</strong> {stage.deal_count}
                      </Typography>
                      <Typography variant="body1">
                        <strong>Valor Total:</strong> {formatCurrency(stage.total_value)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mt={1}>
                        <strong>Ticket Médio:</strong>{' '}
                        {formatCurrency(stage.total_value / stage.deal_count)}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Alert severity="info">Nenhum negócio no pipeline de fechamento</Alert>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Layout>
  );
}

