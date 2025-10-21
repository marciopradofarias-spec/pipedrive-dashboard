import { NextResponse } from 'next/server';
import { fetchDeals, fetchUsers, fetchPipelines } from '@/lib/pipedrive';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // won, lost, open
    const period = searchParams.get('period'); // today, month, all

    const [deals, users, pipelines] = await Promise.all([
      fetchDeals(),
      fetchUsers(),
      fetchPipelines(),
    ]);

    // Create maps
    const userMap = new Map(users.map((u: any) => [u.id, u.name]));
    const pipelineMap = new Map(pipelines.map((p: any) => [p.id, p.name]));

    // Filter and enrich deals
    let filteredDeals = deals.map((deal: any) => ({
      id: deal.id,
      title: deal.title,
      value: deal.value || 0,
      status: deal.status,
      stage_id: deal.stage_id,
      owner_id: deal.user_id?.id,
      owner_name: userMap.get(deal.user_id?.id) || 'Desconhecido',
      pipeline_id: deal.pipeline_id,
      pipeline_name: pipelineMap.get(deal.pipeline_id) || 'Desconhecido',
      add_time: deal.add_time,
      update_time: deal.update_time,
      won_time: deal.won_time,
      lost_time: deal.lost_time,
      lost_reason: deal.lost_reason,
    }));

    // Apply status filter
    if (status) {
      filteredDeals = filteredDeals.filter((d: any) => d.status === status);
    }

    // Apply period filter
    if (period) {
      const now = new Date();
      const today = new Date(now.toDateString());
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      filteredDeals = filteredDeals.filter((d: any) => {
        const dateField = status === 'won' ? d.won_time : status === 'lost' ? d.lost_time : d.add_time;
        if (!dateField) return false;
        
        const date = new Date(dateField);
        
        if (period === 'today') {
          return date.toDateString() === today.toDateString();
        } else if (period === 'month') {
          return date >= monthStart;
        }
        return true;
      });
    }

    return NextResponse.json({
      success: true,
      data: filteredDeals,
      count: filteredDeals.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error fetching deals:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch deals',
      },
      { status: 500 }
    );
  }
}

