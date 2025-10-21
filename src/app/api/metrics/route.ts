import { NextResponse } from 'next/server';
import { fetchDeals, fetchActivities, fetchUsers, fetchPipelines, computeMetrics } from '@/lib/pipedrive';
import { cache } from '@/lib/cache';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // Check cache first
    const cachedMetrics = cache.get('metrics');
    if (cachedMetrics) {
      console.log('Returning cached metrics');
      return NextResponse.json({
        success: true,
        data: cachedMetrics,
        timestamp: new Date().toISOString(),
        cached: true,
      });
    }

    console.log('Fetching fresh data from Pipedrive...');
    const startTime = Date.now();

    const today = new Date().toISOString().split('T')[0];
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 30);
    const futureDateStr = futureDate.toISOString().split('T')[0];

    // Fetch all data in parallel
    const [deals, activities, users, pipelines] = await Promise.all([
      fetchDeals(),
      fetchActivities(today, futureDateStr),
      fetchUsers(),
      fetchPipelines(),
    ]);

    console.log(`Fetched ${deals.length} deals, ${activities.length} activities, ${users.length} users, ${pipelines.length} pipelines in ${Date.now() - startTime}ms`);

    // Compute metrics
    const metrics = await computeMetrics(deals, activities, users, pipelines);

    // Cache for 5 minutes
    cache.set('metrics', metrics, 5 * 60 * 1000);

    console.log(`Total processing time: ${Date.now() - startTime}ms`);

    return NextResponse.json({
      success: true,
      data: metrics,
      timestamp: new Date().toISOString(),
      cached: false,
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

