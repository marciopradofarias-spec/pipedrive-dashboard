'use client';

import { Box, Grid, Card, CardContent, Typography, Chip } from '@mui/material';
import { TrendingUp, AttachMoney, People, Event } from '@mui/icons-material';

interface MarketingMetricsProps {
  metrics: {
    total_spend: number;
    total_leads: number;
    total_meetings: number;
    cost_per_lead: number;
    cost_per_meeting: number;
    meetings_from_traffic: number;
    meetings_from_organic: number;
  };
}

export default function MarketingMetrics({ metrics }: MarketingMetricsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const trafficPercentage = metrics.total_meetings > 0
    ? ((metrics.meetings_from_traffic / metrics.total_meetings) * 100).toFixed(1)
    : '0';

  const organicPercentage = metrics.total_meetings > 0
    ? ((metrics.meetings_from_organic / metrics.total_meetings) * 100).toFixed(1)
    : '0';

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          fontWeight: 700,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        📊 Métricas de Marketing
      </Typography>

      <Grid container spacing={3}>
        {/* Investimento Total */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AttachMoney sx={{ fontSize: 40, opacity: 0.9 }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {formatCurrency(metrics.total_spend)}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Investimento Total
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Total de Leads */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <People sx={{ fontSize: 40, opacity: 0.9 }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {metrics.total_leads}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Leads Gerados
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8, mt: 1, display: 'block' }}>
                CPL: {formatCurrency(metrics.cost_per_lead)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Total de Reuniões */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Event sx={{ fontSize: 40, opacity: 0.9 }} />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {metrics.total_meetings}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Reuniões Agendadas
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8, mt: 1, display: 'block' }}>
                CPR: {formatCurrency(metrics.cost_per_meeting)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Origem das Reuniões */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              height: '100%',
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              color: 'white',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ fontSize: 40, opacity: 0.9 }} />
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                Origem das Reuniões
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip
                    label="Tráfego Pago"
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.3)',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {metrics.meetings_from_traffic} ({trafficPercentage}%)
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip
                    label="Orgânico"
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.3)',
                      color: 'white',
                      fontWeight: 600,
                    }}
                  />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {metrics.meetings_from_organic} ({organicPercentage}%)
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

