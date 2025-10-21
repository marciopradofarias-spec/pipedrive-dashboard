'use client';

import React, { useEffect, useState } from 'react';
import {
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
  Chip,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { CheckCircle, Cancel, Schedule } from '@mui/icons-material';
import Layout from '@/components/Layout';
import MetricCard from '@/components/MetricCard';

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

  if (loading && deals.length === 0) {
    return (
      <Layout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
          <CircularProgress size={60} />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box mb={4}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Vendas
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Análise detalhada de negócios e vendas
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Filtros */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="won">Ganhos</MenuItem>
                  <MenuItem value="lost">Perdidos</MenuItem>
                  <MenuItem value="open">Abertos</MenuItem>
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
                >
                  <MenuItem value="today">Hoje</MenuItem>
                  <MenuItem value="month">Este Mês</MenuItem>
                  <MenuItem value="all">Todos</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Métricas Resumidas */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            title="Total de Negócios"
            value={deals.length}
            icon={<Schedule />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            title="Valor Total"
            value={formatCurrency(totalValue)}
            icon={statusFilter === 'won' ? <CheckCircle /> : <Cancel />}
            color={statusFilter === 'won' ? 'success' : 'error'}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            title="Ticket Médio"
            value={formatCurrency(avgValue)}
            icon={<Schedule />}
            color="info"
          />
        </Grid>
      </Grid>

      {/* Tabela de Negócios */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Lista de Negócios
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Título</strong></TableCell>
                  <TableCell><strong>Vendedor</strong></TableCell>
                  <TableCell><strong>Pipeline</strong></TableCell>
                  <TableCell align="right"><strong>Valor</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Data</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {deals.length > 0 ? (
                  deals.map((deal) => (
                    <TableRow key={deal.id} hover>
                      <TableCell>{deal.title}</TableCell>
                      <TableCell>{deal.owner_name}</TableCell>
                      <TableCell>{deal.pipeline_name}</TableCell>
                      <TableCell align="right">{formatCurrency(deal.value)}</TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(deal.status)}
                          color={getStatusColor(deal.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {formatDate(deal.won_time || deal.lost_time || deal.add_time)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      Nenhum negócio encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Layout>
  );
}

