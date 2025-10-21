import axios from 'axios';

const PIPEDRIVE_API_TOKEN = process.env.PIPEDRIVE_API_TOKEN!;
const PIPEDRIVE_BASE_URL = process.env.PIPEDRIVE_BASE_URL!;
const MARCIO_USER_ID = parseInt(process.env.MARCIO_USER_ID || '14466882');

interface PipedriveResponse<T> {
  data: T[];
  additional_data?: {
    pagination?: {
      more_items_in_collection: boolean;
    };
  };
}

async function fetchAllPages<T>(url: string, params: Record<string, any>): Promise<T[]> {
  let allData: T[] = [];
  let start = 0;
  let hasMore = true;

  while (hasMore) {
    const response = await axios.get<PipedriveResponse<T>>(url, {
      params: { ...params, start, limit: 500 },
    });

    if (response.data.data) {
      allData = allData.concat(response.data.data);
    }

    hasMore = response.data.additional_data?.pagination?.more_items_in_collection || false;
    start += 500;
  }

  return allData;
}

export async function fetchDeals() {
  const url = `${PIPEDRIVE_BASE_URL}/api/v1/deals`;
  const params = {
    api_token: PIPEDRIVE_API_TOKEN,
    status: 'all_not_deleted',
  };

  const deals = await fetchAllPages(url, params);
  // Filter out Marcio's deals
  return deals.filter((deal: any) => deal.user_id?.id !== MARCIO_USER_ID);
}

export async function fetchActivities(since: string, until: string) {
  const url = `${PIPEDRIVE_BASE_URL}/api/v1/activities`;
  const params = {
    api_token: PIPEDRIVE_API_TOKEN,
    since,
    until,
  };

  const activities = await fetchAllPages(url, params);
  // Filter out Marcio's activities
  return activities.filter((activity: any) => activity.user_id !== MARCIO_USER_ID);
}

export async function fetchUsers() {
  const url = `${PIPEDRIVE_BASE_URL}/api/v1/users`;
  const params = {
    api_token: PIPEDRIVE_API_TOKEN,
  };

  return await fetchAllPages(url, params);
}

export async function fetchPipelines() {
  const url = `${PIPEDRIVE_BASE_URL}/api/v1/pipelines`;
  const params = {
    api_token: PIPEDRIVE_API_TOKEN,
  };

  return await fetchAllPages(url, params);
}

export interface DealMetrics {
  general: {
    new_count: number;
    new_value: number;
    won_count: number;
    won_value: number;
    lost_count: number;
    lost_value: number;
    scheduled: number;
    no_show: number;
    realized_successfully: number;
    monthly_won_count: number;
    monthly_won_value: number;
    yesterday_won_count: number;
    yesterday_won_value: number;
    current_month: string;
    days_in_month: number;
    days_remaining: number;
    meetings_scheduled_stage: number;
    meetings_created_this_month: number;
    meetings_updated_this_month: number;
    meetings_scheduled_activities: number;
    total_meetings_scheduled: number;
  };
  monthly_stats_by_owner: Array<{
    owner_name: string;
    deal_count: number;
    total_value: number;
  }>;
  monthly_stats_by_pipeline: Array<{
    pipeline_name: string;
    deal_count: number;
    total_value: number;
  }>;
  by_pipeline: Array<{
    pipeline_name: string;
    new_count: number;
    won_count: number;
    lost_count: number;
  }>;
  by_owner: Array<{
    owner_name: string;
    new_count: number;
    won_count: number;
    lost_count: number;
    activity_count: number;
  }>;
  closing_pipeline_summary: Array<{
    stage_name: string;
    deal_count: number;
    total_value: number;
  }>;
  lost_reasons: Array<{
    motivo: string;
    quantidade: number;
  }>;
  new_deals_list: Array<{
    title: string;
    value: number;
    owner_name: string;
    pipeline_name: string;
  }>;
}

export async function computeMetrics(
  deals: any[],
  activities: any[],
  users: any[],
  pipelines: any[]
): Promise<DealMetrics> {
  // Create user and pipeline maps
  const userMap = new Map(users.map((u: any) => [u.id, u.name]));
  const pipelineMap = new Map(pipelines.map((p: any) => [p.id, p.name]));

  // Get current date in São Paulo timezone
  const now = new Date();
  const saoPauloOffset = -3 * 60; // UTC-3
  const saoPauloTime = new Date(now.getTime() + saoPauloOffset * 60 * 1000);
  
  const today = new Date(saoPauloTime.toDateString());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const monthStart = new Date(saoPauloTime.getFullYear(), saoPauloTime.getMonth(), 1);
  const monthEnd = new Date(saoPauloTime.getFullYear(), saoPauloTime.getMonth() + 1, 0);
  const daysRemaining = monthEnd.getDate() - saoPauloTime.getDate();

  // Helper to parse dates
  const parseDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    return new Date(dateStr);
  };

  const isSameDay = (date1: Date | null, date2: Date) => {
    if (!date1) return false;
    return date1.toDateString() === date2.toDateString();
  };

  const isInMonth = (date: Date | null) => {
    if (!date) return false;
    return date >= monthStart && date <= monthEnd;
  };

  // Process deals
  const dealsWithDates = deals.map((deal: any) => ({
    ...deal,
    owner_name: userMap.get(deal.user_id?.id) || 'Desconhecido',
    pipeline_name: pipelineMap.get(deal.pipeline_id) || 'Desconhecido',
    add_time_date: parseDate(deal.add_time),
    update_time_date: parseDate(deal.update_time),
    won_time_date: parseDate(deal.won_time),
    stage_change_time_date: parseDate(deal.stage_change_time),
  }));

  // Calculate metrics
  const newToday = dealsWithDates.filter((d: any) => isSameDay(d.add_time_date, today));
  const wonToday = dealsWithDates.filter((d: any) => d.status === 'won' && isSameDay(d.won_time_date, today));
  const wonYesterday = dealsWithDates.filter((d: any) => d.status === 'won' && isSameDay(d.won_time_date, yesterday));
  const wonThisMonth = dealsWithDates.filter((d: any) => d.status === 'won' && isInMonth(d.won_time_date));
  const lostToday = dealsWithDates.filter((d: any) => d.status === 'lost' && isSameDay(d.update_time_date, today));
  
  const movedToday = dealsWithDates.filter((d: any) => isSameDay(d.stage_change_time_date, today));
  const scheduled = movedToday.filter((d: any) => d.stage_id === 40).length;
  const noShow = movedToday.filter((d: any) => d.stage_id === 39).length;
  const realizedSuccessfully = movedToday.filter((d: any) => 
    [7, 8, 9].includes(d.stage_id) || d.status === 'won'
  ).length;

  // Meetings analysis
  const meetingsAll = dealsWithDates.filter((d: any) => d.stage_id === 40);
  const meetingsCreatedThisMonth = meetingsAll.filter((d: any) => isInMonth(d.add_time_date)).length;
  const meetingsUpdatedThisMonth = meetingsAll.filter((d: any) => isInMonth(d.update_time_date)).length;

  // Monthly stats by owner
  const ownerStats = new Map<string, { count: number; value: number }>();
  wonThisMonth.forEach((deal: any) => {
    const owner = deal.owner_name;
    const current = ownerStats.get(owner) || { count: 0, value: 0 };
    ownerStats.set(owner, {
      count: current.count + 1,
      value: current.value + (deal.value || 0),
    });
  });

  const monthly_stats_by_owner = Array.from(ownerStats.entries())
    .map(([owner_name, stats]) => ({
      owner_name,
      deal_count: stats.count,
      total_value: stats.value,
    }))
    .sort((a, b) => b.total_value - a.total_value);

  // Monthly stats by pipeline
  const pipelineStats = new Map<string, { count: number; value: number }>();
  wonThisMonth.forEach((deal: any) => {
    const pipeline = deal.pipeline_name;
    const current = pipelineStats.get(pipeline) || { count: 0, value: 0 };
    pipelineStats.set(pipeline, {
      count: current.count + 1,
      value: current.value + (deal.value || 0),
    });
  });

  const monthly_stats_by_pipeline = Array.from(pipelineStats.entries())
    .map(([pipeline_name, stats]) => ({
      pipeline_name,
      deal_count: stats.count,
      total_value: stats.value,
    }))
    .sort((a, b) => b.total_value - a.total_value);

  // Closing pipeline summary
  const closingStages = [7, 8, 9];
  const stageMap = { 7: 'Oportunidade', 8: 'Negociação', 9: 'Contrato' };
  const closingDeals = dealsWithDates.filter((d: any) => 
    d.status === 'open' && closingStages.includes(d.stage_id)
  );

  const stageStats = new Map<string, { count: number; value: number }>();
  closingDeals.forEach((deal: any) => {
    const stageName = stageMap[deal.stage_id as keyof typeof stageMap];
    const current = stageStats.get(stageName) || { count: 0, value: 0 };
    stageStats.set(stageName, {
      count: current.count + 1,
      value: current.value + (deal.value || 0),
    });
  });

  const closing_pipeline_summary = Array.from(stageStats.entries()).map(([stage_name, stats]) => ({
    stage_name,
    deal_count: stats.count,
    total_value: stats.value,
  }));

  return {
    general: {
      new_count: newToday.length,
      new_value: newToday.reduce((sum: number, d: any) => sum + (d.value || 0), 0),
      won_count: wonToday.length,
      won_value: wonToday.reduce((sum: number, d: any) => sum + (d.value || 0), 0),
      lost_count: lostToday.length,
      lost_value: lostToday.reduce((sum: number, d: any) => sum + (d.value || 0), 0),
      scheduled,
      no_show: noShow,
      realized_successfully: realizedSuccessfully,
      monthly_won_count: wonThisMonth.length,
      monthly_won_value: wonThisMonth.reduce((sum: number, d: any) => sum + (d.value || 0), 0),
      yesterday_won_count: wonYesterday.length,
      yesterday_won_value: wonYesterday.reduce((sum: number, d: any) => sum + (d.value || 0), 0),
      current_month: saoPauloTime.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
      days_in_month: saoPauloTime.getDate(),
      days_remaining: daysRemaining,
      meetings_scheduled_stage: meetingsAll.length,
      meetings_created_this_month: meetingsCreatedThisMonth,
      meetings_updated_this_month: meetingsUpdatedThisMonth,
      meetings_scheduled_activities: 0, // Will be calculated from activities
      total_meetings_scheduled: meetingsAll.length,
    },
    monthly_stats_by_owner,
    monthly_stats_by_pipeline,
    by_pipeline: [],
    by_owner: [],
    closing_pipeline_summary,
    lost_reasons: [],
    new_deals_list: newToday.map((d: any) => ({
      title: d.title || 'Sem título',
      value: d.value || 0,
      owner_name: d.owner_name,
      pipeline_name: d.pipeline_name,
    })),
  };
}

