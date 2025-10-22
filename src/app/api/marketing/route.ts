import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route para buscar dados de marketing do Meta Ads
 * 
 * Query params:
 * - period: hoje|semana|mes|trimestre|ano (default: mes)
 */

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || 'mes';

    // Calcular intervalo de datas baseado no período
    const { startDate, endDate } = calculateDateRange(period);

    // TODO: Integrar com Meta Marketing API
    // Por enquanto, retornar dados mockados para desenvolvimento
    const marketingData = {
      success: true,
      data: {
        period,
        dateRange: { startDate, endDate },
        
        // Métricas gerais
        metrics: {
          total_spend: 5420.50,
          total_leads: 87,
          total_meetings: 23,
          cost_per_lead: 62.30,
          cost_per_meeting: 235.67,
          meetings_from_traffic: 15,
          meetings_from_organic: 8,
        },
        
        // Top criativos por reuniões
        top_creatives_by_meetings: [
          {
            creative_id: '120210000000000001',
            creative_name: 'Video - Academia de Talentos',
            thumbnail_url: 'https://via.placeholder.com/300x200?text=Video+1',
            meetings: 8,
            leads: 25,
            spend: 1250.00,
            impressions: 15420,
            clicks: 342,
          },
          {
            creative_id: '120210000000000002',
            creative_name: 'Carrossel - Benefícios',
            thumbnail_url: 'https://via.placeholder.com/300x200?text=Carrossel',
            meetings: 5,
            leads: 18,
            spend: 890.00,
            impressions: 12100,
            clicks: 256,
          },
          {
            creative_id: '120210000000000003',
            creative_name: 'Estático - Depoimento',
            thumbnail_url: 'https://via.placeholder.com/300x200?text=Estatico',
            meetings: 2,
            leads: 12,
            spend: 620.00,
            impressions: 8500,
            clicks: 178,
          },
        ],
        
        // Top criativos por leads
        top_creatives_by_leads: [
          {
            creative_id: '120210000000000001',
            creative_name: 'Video - Academia de Talentos',
            thumbnail_url: 'https://via.placeholder.com/300x200?text=Video+1',
            leads: 25,
            meetings: 8,
            spend: 1250.00,
            cost_per_lead: 50.00,
          },
          {
            creative_id: '120210000000000004',
            creative_name: 'Video - Transformação',
            thumbnail_url: 'https://via.placeholder.com/300x200?text=Video+2',
            leads: 22,
            meetings: 4,
            spend: 1100.00,
            cost_per_lead: 50.00,
          },
          {
            creative_id: '120210000000000002',
            creative_name: 'Carrossel - Benefícios',
            thumbnail_url: 'https://via.placeholder.com/300x200?text=Carrossel',
            leads: 18,
            meetings: 5,
            spend: 890.00,
            cost_per_lead: 49.44,
          },
        ],
      },
      timestamp: new Date().toISOString(),
      cached: false,
    };

    return NextResponse.json(marketingData);
  } catch (error) {
    console.error('Error fetching marketing data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch marketing data' },
      { status: 500 }
    );
  }
}

function calculateDateRange(period: string): { startDate: string; endDate: string } {
  const now = new Date();
  let startDate: Date;
  const endDate = new Date(now);

  switch (period) {
    case 'hoje':
      startDate = new Date(now);
      startDate.setHours(0, 0, 0, 0);
      break;

    case 'semana':
      startDate = new Date(now);
      const dayOfWeek = startDate.getDay();
      const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Segunda-feira
      startDate.setDate(startDate.getDate() - diff);
      startDate.setHours(0, 0, 0, 0);
      break;

    case 'mes':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;

    case 'trimestre':
      const quarter = Math.floor(now.getMonth() / 3);
      startDate = new Date(now.getFullYear(), quarter * 3, 1);
      break;

    case 'ano':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;

    default:
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
}

