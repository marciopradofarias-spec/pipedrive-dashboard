import { NextResponse } from 'next/server';
import { fetchDeals, fetchActivities, fetchUsers, fetchPipelines, computeMetrics } from '@/lib/pipedrive';
import { cache } from '@/lib/cache';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function getDateRange(period: string) {
  const now = new Date();
  const saoPauloOffset = -3 * 60; // UTC-3
  const saoPauloTime = new Date(now.getTime() + saoPauloOffset * 60 * 1000);
  
  let startDate: Date;
  let endDate: Date = new Date(saoPauloTime);
  endDate.setHours(23, 59, 59, 999);

  switch (period) {
    case 'hoje':
      startDate = new Date(saoPauloTime);
      startDate.setHours(0, 0, 0, 0);
      break;
    
    case 'semana':
      // Início da semana (segunda-feira)
      startDate = new Date(saoPauloTime);
      const day = startDate.getDay();
      const diff = day === 0 ? -6 : 1 - day; // Se domingo, volta 6 dias, senão volta para segunda
      startDate.setDate(startDate.getDate() + diff);
      startDate.setHours(0, 0, 0, 0);
      break;
    
    case 'mes':
      startDate = new Date(saoPauloTime.getFullYear(), saoPauloTime.getMonth(), 1);
      startDate.setHours(0, 0, 0, 0);
      break;
    
    case 'trimestre':
      const currentMonth = saoPauloTime.getMonth();
      const quarterStartMonth = Math.floor(currentMonth / 3) * 3;
      startDate = new Date(saoPauloTime.getFullYear(), quarterStartMonth, 1);
      startDate.setHours(0, 0, 0, 0);
      break;
    
    case 'ano':
      startDate = new Date(saoPauloTime.getFullYear(), 0, 1);
      startDate.setHours(0, 0, 0, 0);
      break;
    
    default:
      // Default: mês atual
      startDate = new Date(saoPauloTime.getFullYear(), saoPauloTime.getMonth(), 1);
      startDate.setHours(0, 0, 0, 0);
  }

  return {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'mes';

    // Create cache key with period
    const cacheKey = `metrics_${period}`;
    
    // Check cache first
    const cachedMetrics = cache.get(cacheKey);
    if (cachedMetrics) {
      console.log(`Returning cached metrics for period: ${period}`);
      return NextResponse.json({
        success: true,
        data: cachedMetrics,
        timestamp: new Date().toISOString(),
        cached: true,
        period,
      });
    }

    console.log(`Fetching fresh data from Pipedrive for period: ${period}...`);
    const startTime = Date.now();

    const { startDate, endDate } = getDateRange(period);
    console.log(`Date range: ${startDate} to ${endDate}`);

    // Fetch all data in parallel
    const [deals, activities, users, pipelines] = await Promise.all([
      fetchDeals(),
      fetchActivities(startDate, endDate),
      fetchUsers(),
      fetchPipelines(),
    ]);

    console.log(`Fetched ${deals.length} deals, ${activities.length} activities, ${users.length} users, ${pipelines.length} pipelines in ${Date.now() - startTime}ms`);

    // Compute metrics with date range
    const metrics = await computeMetrics(deals, activities, users, pipelines, startDate, endDate);

    // Cache for 5 minutes
    cache.set(cacheKey, metrics, 5 * 60 * 1000);

    console.log(`Total processing time: ${Date.now() - startTime}ms`);

    return NextResponse.json({
      success: true,
      data: metrics,
      timestamp: new Date().toISOString(),
      cached: false,
      period,
      dateRange: { startDate, endDate },
    });
  } catch (error: any) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch metrics',
      },
      { status: 500 }
    );
  }
}

