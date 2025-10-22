'use client';

import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Stack,
} from '@mui/material';
import { Event, People, AttachMoney, Visibility, TouchApp } from '@mui/icons-material';

interface Creative {
  creative_id: string;
  creative_name: string;
  thumbnail_url: string;
  meetings?: number;
  leads?: number;
  spend: number;
  impressions?: number;
  clicks?: number;
  cost_per_lead?: number;
}

interface CreativeGalleryProps {
  title: string;
  icon: string;
  creatives: Creative[];
  sortBy: 'meetings' | 'leads';
}

export default function CreativeGallery({ title, icon, creatives, sortBy }: CreativeGalleryProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          mb: 3,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        {icon} {title}
      </Typography>

      <Grid container spacing={3}>
        {creatives.map((creative, index) => (
          <Grid item xs={12} md={4} key={creative.creative_id}>
            <Card
              sx={{
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6,
                },
                position: 'relative',
                overflow: 'visible',
              }}
            >
              {/* Badge de posição */}
              <Box
                sx={{
                  position: 'absolute',
                  top: -12,
                  left: 16,
                  zIndex: 1,
                }}
              >
                <Chip
                  label={`#${index + 1}`}
                  sx={{
                    backgroundColor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '1rem',
                    height: 32,
                  }}
                />
              </Box>

              {/* Thumbnail do criativo */}
              <CardMedia
                component="img"
                height="200"
                image={creative.thumbnail_url}
                alt={creative.creative_name}
                sx={{
                  objectFit: 'cover',
                  backgroundColor: '#f5f5f5',
                }}
              />

              <CardContent>
                {/* Nome do criativo */}
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    minHeight: 48,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {creative.creative_name}
                </Typography>

                {/* Métricas principais */}
                <Stack spacing={1.5}>
                  {sortBy === 'meetings' && creative.meetings !== undefined && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Event sx={{ color: 'primary.main', fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        Reuniões:
                      </Typography>
                      <Typography variant="body2" fontWeight={700}>
                        {creative.meetings}
                      </Typography>
                    </Box>
                  )}

                  {creative.leads !== undefined && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <People sx={{ color: 'success.main', fontSize: 20 }} />
                      <Typography variant="body2" color="text.secondary">
                        Leads:
                      </Typography>
                      <Typography variant="body2" fontWeight={700}>
                        {creative.leads}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AttachMoney sx={{ color: 'warning.main', fontSize: 20 }} />
                    <Typography variant="body2" color="text.secondary">
                      Investimento:
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {formatCurrency(creative.spend)}
                    </Typography>
                  </Box>

                  {creative.cost_per_lead !== undefined && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        CPL:
                      </Typography>
                      <Chip
                        label={formatCurrency(creative.cost_per_lead)}
                        size="small"
                        color="primary"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                  )}

                  {/* Métricas secundárias */}
                  {creative.impressions !== undefined && creative.clicks !== undefined && (
                    <Box
                      sx={{
                        mt: 1,
                        pt: 1.5,
                        borderTop: '1px solid',
                        borderColor: 'divider',
                        display: 'flex',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Visibility sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {formatNumber(creative.impressions)}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <TouchApp sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary">
                          {formatNumber(creative.clicks)}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {creatives.length === 0 && (
        <Box
          sx={{
            textAlign: 'center',
            py: 6,
            color: 'text.secondary',
          }}
        >
          <Typography variant="body1">
            Nenhum criativo encontrado para este período
          </Typography>
        </Box>
      )}
    </Box>
  );
}

