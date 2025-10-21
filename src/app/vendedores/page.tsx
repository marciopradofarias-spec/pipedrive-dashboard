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
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { EmojiEvents, TrendingUp, AttachMoney } from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Layout from '@/components/Layout';

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
          Vendedores
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Rankings e performance individual dos vendedores
        </Typography>
      </Box>

      {/* Pódio dos Vendedores */}
      <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <EmojiEvents sx={{ fontSize: 40, mr: 2 }} />
            <Typography variant="h5" fontWeight={700}>
              🏆 Ranking do Mês
            </Typography>
          </Box>
          <Grid container spacing={2} justifyContent="center">
            {metrics.monthly_stats_by_owner.slice(0, 3).map((owner, index) => (
              <Grid item xs={12} sm={4} key={owner.owner_name}>
                <Box
                  textAlign="center"
                  p={3}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 2,
                    backdropFilter: 'blur(10px)',
                  }}
                >
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
                  <Typography variant="body2" mt={1}>
                    {owner.deal_count} negócios fechados
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Gráfico de Performance */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Performance por Vendedor (Este Mês)
              </Typography>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={metrics.monthly_stats_by_owner}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="owner_name" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend />
                  <Bar dataKey="total_value" fill="#28a745" name="Valor Total" />
                  <Bar dataKey="deal_count" fill="#007bff" name="Nº de Negócios" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabela Detalhada */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Estatísticas Detalhadas
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Posição</strong></TableCell>
                  <TableCell><strong>Vendedor</strong></TableCell>
                  <TableCell align="right"><strong>Negócios Fechados</strong></TableCell>
                  <TableCell align="right"><strong>Valor Total</strong></TableCell>
                  <TableCell align="right"><strong>Ticket Médio</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {metrics.monthly_stats_by_owner.map((owner, index) => (
                  <TableRow key={owner.owner_name} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            backgroundColor: getMedalColor(index),
                            color: '#000',
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            mr: 1,
                          }}
                        >
                          {index + 1}
                        </Avatar>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ mr: 2, backgroundColor: 'primary.main' }}>
                          {getInitials(owner.owner_name)}
                        </Avatar>
                        <Typography fontWeight={600}>{owner.owner_name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="right">{owner.deal_count}</TableCell>
                    <TableCell align="right">{formatCurrency(owner.total_value)}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(owner.total_value / owner.deal_count)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Layout>
  );
}

