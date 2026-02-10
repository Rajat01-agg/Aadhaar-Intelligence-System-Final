/**
 * Aadhaar Intelligence System - API Service
 * All API calls to the backend are defined here.
 */

import api from './api';
import {
  DashboardOverview,
  StateSummary,
  DistrictSummary,
  FilterOptions,
  HeatmapDataPoint,
  AadhaarAlert,
  PolicyFramework,
  ReportMetadata,
  VisualsResponse,
  AppliedFilters,
  MetricType,
  IndexType,
  AgeGroup,
  SignalType,
  SearchResponse,
  SearchResult,
  NotificationResponse,
  Notification,
} from '../types';

const mapMetricTypeFromApi = (value: string): MetricType => {
  switch (value) {
    case 'enrolment':
      return 'Enrolment';
    case 'biometric_update':
      return 'Biometric';
    case 'demographic_update':
      return 'Demographic';
    default:
      return value.replace(/_/g, ' ') as MetricType;
  }
};

const mapMetricTypeToApi = (value?: MetricType): string | undefined => {
  if (!value) return undefined;
  switch (value) {
    case 'Enrolment':
      return 'enrolment';
    case 'Biometric':
      return 'biometric_update';
    case 'Demographic':
      return 'demographic_update';
    default:
      return value.toLowerCase().replace(/ /g, '_');
  }
};

const mapAgeGroupFromApi = (value: string): AgeGroup => {
  switch (value) {
    case 'age_0_5':
      return '0-5';
    case 'age_6_17':
      return '5-18';
    case 'age_18_plus':
      return '18-60';
    default:
      return value.replace(/_/g, '-') as AgeGroup;
  }
};

const mapIndexTypeFromApi = (value: string): IndexType => {
  switch (value) {
    case 'demandPressureIndex':
      return 'Demand';
    case 'operationalStressIndex':
      return 'Stress';
    case 'updateAccessibilityGap':
      return 'Gap';
    case 'compositeRiskScore':
      return 'CompositeRisk';
    default:
      return value as IndexType;
  }
};

const mapIndexTypeToHeatmapParam = (value?: IndexType): string => {
  switch (value) {
    case 'Demand':
      return 'demandPressureIndex';
    case 'Stress':
      return 'operationalStressIndex';
    case 'Gap':
      return 'updateAccessibilityGap';
    case 'CompositeRisk':
    default:
      return 'compositeRiskScore';
  }
};

const mapIndexTypeToAnalyticsIndex = (value?: IndexType): string | undefined => {
  switch (value) {
    case 'Demand':
      return 'demand_pressure';
    case 'Stress':
      return 'operational_stress';
    case 'Gap':
      return 'accessibility_gap';
    case 'CompositeRisk':
      return 'composite_risk';
    default:
      return undefined;
  }
};

const mapSignalTypeToAlertType = (value: SignalType): string => {
  switch (value) {
    case 'Anomalies':
      return 'anomaly';
    case 'Trends':
      return 'trend';
    case 'Patterns':
      return 'pattern';
    case 'Accessibility Gap':
      return 'accessibility_gap';
    case 'Operational Stress':
      return 'operational_stress';
    default:
      return value.toLowerCase().replace(/ /g, '_');
  }
};

// ============================================
// METADATA
// ============================================
interface MetadataFiltersResponse {
  success: boolean;
  data: {
    states: string[];
    districtsByState: Record<string, string[]>;
    years: number[];
    months: number[];
    metricTypes: string[];
    ageGroups: string[];
    indexTypes: string[];
  };
}

export const fetchFilterOptions = async (): Promise<FilterOptions> => {
  try {
    const response = await api.get<MetadataFiltersResponse>('/metadata/filters');
    const d = response.data;
    
    // Transform backend format to frontend format
    const states = d.states.map((name) => ({ code: name, name }));
    const districts: FilterOptions['districts'] = [];
    Object.entries(d.districtsByState).forEach(([stateName, districtList]) => {
      const stateCode = stateName;
      districtList.forEach(districtName => {
        districts.push({ code: districtName, name: districtName, stateCode });
      });
    });

    return {
      states,
      districts,
      years: d.years,
      months: d.months.map(m => ({ value: m, label: new Date(2000, m - 1).toLocaleString('default', { month: 'long' }) })),
      metricTypes: d.metricTypes.map(mapMetricTypeFromApi),
      ageGroups: d.ageGroups.map(mapAgeGroupFromApi),
      indexTypes: d.indexTypes.map(mapIndexTypeFromApi),
      signalTypes: ['Anomalies', 'Trends', 'Patterns', 'Accessibility Gap', 'Operational Stress'],
    };
  } catch (error) {
    console.warn('fetchFilterOptions failed, using mock:', error);
    throw error;
  }
};

// ============================================
// DASHBOARD
// ============================================
interface DashboardOverviewResponse {
  success: boolean;
  data: {
    totalTransactions: number;
    averageIndexes: {
      demandPressure: number;
      operationalStress: number;
      compositeRisk: number;
    };
    highRiskDistrictCount: number;
    lastUpdated: string;
  };
}

export const fetchDashboardOverview = async (): Promise<DashboardOverview> => {
  try {
    const response = await api.get<DashboardOverviewResponse>('/api/dashboard/overview');
    const d = response.data;
    return {
      totalTransactions: d.totalTransactions,
      avgDemandPressure: d.averageIndexes.demandPressure * 100,
      avgOperationalStress: d.averageIndexes.operationalStress * 100,
      overallCompositeRisk: d.averageIndexes.compositeRisk * 100,
      highRiskDistrictCount: d.highRiskDistrictCount,
      lastUpdated: d.lastUpdated,
    };
  } catch (error) {
    console.warn('fetchDashboardOverview failed:', error);
    throw error;
  }
};

interface StatesSummaryResponse {
  success: boolean;
  data: {
    state: string;
    status: 'CRITICAL' | 'WATCH' | 'NORMAL';
    compositeRisk: number;
    demandPressure: number;
    operationalStress: number;
    trend: string;
    hasAnomaly: boolean;
  }[];
}

export const fetchStatesSummary = async (): Promise<StateSummary[]> => {
  try {
    const response = await api.get<StatesSummaryResponse>('/api/dashboard/states-summary');
    return response.data.map(s => ({
      stateCode: s.state.substring(0, 2).toUpperCase(),
      stateName: s.state,
      status: s.status,
      hasAnomaly: s.hasAnomaly,
      trend: s.trend.toLowerCase() as 'up' | 'down' | 'stable',
      compositeRiskIndex: s.compositeRisk * 100,
      districtCount: 30, // Placeholder, would come from detailed API
      highRiskDistricts: Math.round(s.compositeRisk * 10),
    }));
  } catch (error) {
    console.warn('fetchStatesSummary failed:', error);
    throw error;
  }
};

interface DistrictsSummaryResponse {
  success: boolean;
  state: string;
  data: {
    district: string;
    status: 'CRITICAL' | 'WATCH' | 'NORMAL';
    compositeRisk: number;
    demandPressure: number;
    operationalStress: number;
    signals: string[];
  }[];
}

export const fetchDistrictsSummary = async (stateName: string): Promise<DistrictSummary[]> => {
  try {
    const response = await api.get<DistrictsSummaryResponse>(`/api/dashboard/states/${encodeURIComponent(stateName)}/districts-summary`);
    return response.data.map(d => ({
      districtCode: d.district.substring(0, 3).toUpperCase(),
      districtName: d.district,
      stateName: response.state,
      status: d.status,
      demandPressureIndex: d.demandPressure * 100,
      operationalStressIndex: d.operationalStress * 100,
      accessibilityGapIndex: 40, // Placeholder
      compositeRiskIndex: d.compositeRisk * 100,
      trend: 'stable',
      signals: d.signals.map(s => ({ type: s as any, label: s })),
      coordinates: [20 + Math.random() * 10, 75 + Math.random() * 10],
    }));
  } catch (error) {
    console.warn('fetchDistrictsSummary failed:', error);
    throw error;
  }
};

// ============================================
// HEATMAP
// ============================================
interface HeatmapResponse {
  success: boolean;
  count: number;
  data: {
    state: string;
    district: string;
    primaryValue: number;
    riskLevel: string;
    hover: {
      demandPressure: number;
      operationalStress: number;
      accessibilityGap: number;
      compositeRisk: number;
      anomaly: { alertType: string; severity: string } | null;
      trend: string;
      pattern: string;
    };
  }[];
}

export const fetchHeatmapData = async (filters: AppliedFilters): Promise<HeatmapDataPoint[]> => {
  try {
    const params = new URLSearchParams();
    if (filters.year) params.append('year', filters.year.toString());
    if (filters.month) params.append('month', filters.month.toString());
    if (filters.state) params.append('state', filters.state);
    params.append('indexType', mapIndexTypeToHeatmapParam(filters.indexType));

    const response = await api.get<HeatmapResponse>(`/api/heatmap?${params.toString()}`);
    return response.data.map(d => ({
      districtCode: d.district.substring(0, 3).toUpperCase(),
      districtName: d.district,
      stateName: d.state,
      coordinates: [20 + Math.random() * 15, 72 + Math.random() * 15] as [number, number],
      indexValue: d.primaryValue * 100,
      indexType: 'CompositeRisk',
      status: d.riskLevel === 'critical' ? 'CRITICAL' : d.riskLevel === 'high' ? 'WATCH' : 'NORMAL',
      signals: d.hover.anomaly ? [{ type: 'ANOMALY' as const, label: d.hover.anomaly.alertType }] : [],
    }));
  } catch (error) {
    console.warn('fetchHeatmapData failed:', error);
    throw error;
  }
};

// ============================================
// ANALYTICS / CHARTS
// ============================================
interface AnalyticsVisualsRequest {
  chartType: 'line' | 'bar' | 'pie';
  context: 'trend' | 'comparison' | 'distribution';
  filters: {
    year?: number;
    state?: string;
    indexes?: string[];
    groupBy?: string;
    limit?: number;
  };
}

interface AnalyticsVisualsResponse {
  success: boolean;
  chartType: string;
  context: string;
  data: {
    labels: string[];
    datasets: { label: string; data: number[] }[];
    meta?: { aggregation: string };
  };
}

export const fetchVisualsData = async (request: AnalyticsVisualsRequest): Promise<VisualsResponse> => {
  try {
    const response = await api.post<AnalyticsVisualsResponse>('/api/analytics/visuals', request);
    return {
      lineChart: request.chartType === 'line' ? { ...response.data, title: `${request.context} Analysis` } : undefined,
      barChart: request.chartType === 'bar' ? { ...response.data, title: `${request.context} Analysis` } : undefined,
      pieChart: request.chartType === 'pie' ? { ...response.data, title: `${request.context} Distribution` } : undefined,
    };
  } catch (error) {
    console.warn('fetchVisualsData failed:', error);
    throw error;
  }
};

// ============================================
// ALERTS
// ============================================
interface AlertsRequest {
  alertType?: string;
  severity?: string;
  state?: string;
  district?: string;
  isRead?: boolean;
}

interface AlertsResponse {
  success: boolean;
  data: {
    id: string;
    alertType: string;
    severity: string;
    message: string;
    state: string;
    district: string;
    createdAt: string;
    isRead: boolean;
    isResolved: boolean;
  }[];
}

export const fetchAlerts = async (filters: AlertsRequest = {}): Promise<AadhaarAlert[]> => {
  try {
    const response = await api.post<AlertsResponse>('/api/alerts', filters);
    return response.data.map(a => ({
      id: a.id,
      region: a.district || a.state,
      regionType: a.district ? 'District' : 'State',
      alertType: a.alertType.toUpperCase() as any,
      severity: a.severity.charAt(0).toUpperCase() + a.severity.slice(1) as any,
      title: `${a.alertType} Alert`,
      explanation: a.message,
      confidence: 85 + Math.random() * 10,
      detectedAt: a.createdAt,
    }));
  } catch (error) {
    console.warn('fetchAlerts failed:', error);
    throw error;
  }
};

interface AlertsSummaryResponse {
  success: boolean;
  data: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    unread: number;
    anomalies: number;
    trends: number;
    patterns: number;
    accessibilityGap: number;
    operationalStress: number;
  };
}

export const fetchAlertsSummary = async (filters: AlertsRequest = {}): Promise<AlertsSummaryResponse['data']> => {
  try {
    const response = await api.post<AlertsSummaryResponse>('/api/alerts/summary', filters);
    return response.data;
  } catch (error) {
    console.warn('fetchAlertsSummary failed:', error);
    throw error;
  }
};

export const markAlertAsRead = async (alertId: string): Promise<void> => {
  await api.patch(`/api/alerts/${alertId}/read`);
};

export const markAlertAsResolved = async (alertId: string): Promise<void> => {
  await api.patch(`/api/alerts/${alertId}/resolved`);
};

// ============================================
// REPORTS
// ============================================
interface GenerateReportResponse {
  success: boolean;
  reportId: string;
  pdfUrl: string;
  findingsSummary: { totalFindings: number; critical: number };
}

export const generateReport = async (filters: AppliedFilters): Promise<ReportMetadata> => {
  try {
    const payload = {
      year: filters.year,
      month: filters.month,
      state: filters.state,
      district: filters.district,
      metricCategory: mapMetricTypeToApi(filters.metricType),
    };
    const response = await api.post<GenerateReportResponse>('/api/reports/generate', payload);
    return {
      id: response.reportId,
      title: `Report - ${filters.state || 'All India'} ${filters.year || ''}`,
      generatedAt: new Date().toISOString(),
      filters: filters as any,
      status: 'Ready',
      fileUrl: response.pdfUrl,
    };
  } catch (error) {
    console.warn('generateReport failed:', error);
    throw error;
  }
};

interface ReportsListResponse {
  success: boolean;
  reports: {
    id: string;
    title: string;
    status: string;
    pdfUrl: string;
    createdAt: string;
  }[];
  pagination: { total: number; page: number; limit: number };
}

export const fetchReports = async (): Promise<ReportMetadata[]> => {
  try {
    const response = await api.get<ReportsListResponse>('/api/reports');
    return response.reports.map(r => ({
      id: r.id,
      title: r.title,
      generatedAt: r.createdAt,
      filters: {},
      status: r.status === 'COMPLETED' ? 'Ready' : 'Processing',
      fileUrl: r.pdfUrl,
    }));
  } catch (error) {
    console.warn('fetchReports failed:', error);
    throw error;
  }
};

export const deleteReport = async (reportId: string): Promise<void> => {
  await api.delete(`/api/reports/${reportId}`);
};

export const getReportDownloadUrl = (report: ReportMetadata): string => {
  return report.fileUrl || `/api/reports/${report.id}/download`;
};

// ============================================
// POLICY
// ============================================
interface PolicySuggestionsRequest {
  state?: string;
  district?: string;
  riskSignal?: string[];
}

interface PolicySuggestionsResponse {
  success: boolean;
  data: {
    id: string;
    riskSignal: string;
    riskScore: number;
    predictionConfidence: number;
    contributingFactors: string;
    state: string;
    district: string;
  }[];
}

export const fetchPolicySuggestions = async (filters: PolicySuggestionsRequest = {}): Promise<any[]> => {
  try {
    const response = await api.post<PolicySuggestionsResponse>('/api/policy/suggestions', filters);
    return response.data;
  } catch (error) {
    console.warn('fetchPolicySuggestions failed:', error);
    throw error;
  }
};

interface PolicyFrameworksRequest {
  state?: string;
  district?: string;
  frameworkType?: string[];
}

interface PolicyFrameworksResponse {
  success: boolean;
  data: {
    id: string;
    frameworkType: string;
    title: string;
    description: string;
    frameworkConfidence: number;
  }[];
}

export const fetchPolicyFrameworks = async (filters: PolicyFrameworksRequest = {}): Promise<PolicyFramework[]> => {
  try {
    const response = await api.post<PolicyFrameworksResponse>('/api/policy/frameworks', filters);
    return response.data.map(f => ({
      id: f.id,
      type: f.frameworkType.toUpperCase().replace(/ /g, '_') as any,
      title: f.title,
      description: f.description,
      applicableRegions: [filters.state || 'All India'],
      priority: f.frameworkConfidence > 0.7 ? 'High' : f.frameworkConfidence > 0.4 ? 'Medium' : 'Low',
      indicators: [],
    }));
  } catch (error) {
    console.warn('fetchPolicyFrameworks failed:', error);
    throw error;
  }
};

// ============================================
// SYNC (Admin)
// ============================================
export const syncData = async (): Promise<{ jobId: string }> => {
  try {
    const response = await api.post<{ success: boolean; jobId: string }>('/api/sync', { source: 'data.gov.in', force: true });
    return { jobId: response.jobId };
  } catch (error) {
    console.warn('syncData failed:', error);
    throw error;
  }
};

export const fetchSyncStatus = async (): Promise<{ lastSyncTime: string }> => {
  // This would need a dedicated endpoint; returning mock for now
  return { lastSyncTime: new Date(Date.now() - 3600000).toISOString() };
};

export const fetchHealthSummary = async () => {
  // Derived from dashboard overview for now
  const overview = await fetchDashboardOverview();
  return {
    majorAnomaliesCount: Math.round(overview.highRiskDistrictCount / 5),
    systemStressLevel: overview.avgOperationalStress > 70 ? 'High' : overview.avgOperationalStress > 40 ? 'Moderate' : 'Low',
    nationalRiskTrend: 'stable' as const,
    criticalStatesCount: Math.round(overview.highRiskDistrictCount / 20),
    watchStatesCount: Math.round(overview.highRiskDistrictCount / 10),
    lastUpdated: overview.lastUpdated,
  };
};

// ============================================
// SEARCH
// ============================================
interface SearchApiResponse {
  success: boolean;
  data: {
    alerts?: {
      id: string;
      alertType?: string;
      severity?: string;
      message?: string;
      state?: string;
      district?: string;
    }[];
    predictiveIndicators?: {
      id?: string;
      title?: string;
      state?: string;
      district?: string;
      status?: string;
    }[];
    solutionFrameworks?: {
      id?: string;
      title?: string;
      state?: string;
      district?: string;
    }[];
  };
}

const mapSearchResults = (payload: SearchApiResponse['data']): SearchResult[] => {
  const results: SearchResult[] = [];

  payload.alerts?.forEach(alert => {
    results.push({
      id: alert.id,
      type: 'alert',
      title: alert.alertType ? `${alert.alertType} Alert` : 'Alert',
      subtitle: alert.message || [alert.district, alert.state].filter(Boolean).join(' • '),
      status: alert.severity ? (alert.severity.toUpperCase() as any) : undefined,
    });
  });

  payload.predictiveIndicators?.forEach((indicator, index) => {
    const isDistrict = Boolean(indicator.district);
    results.push({
      id: indicator.id || `predictive-${index}`,
      type: isDistrict ? 'district' : 'state',
      title: indicator.title || indicator.district || indicator.state || 'Indicator',
      subtitle: [indicator.district, indicator.state].filter(Boolean).join(' • ') || undefined,
    });
  });

  payload.solutionFrameworks?.forEach((framework, index) => {
    const isDistrict = Boolean(framework.district);
    results.push({
      id: framework.id || `framework-${index}`,
      type: isDistrict ? 'district' : 'state',
      title: framework.title || framework.district || framework.state || 'Framework',
      subtitle: [framework.district, framework.state].filter(Boolean).join(' • ') || undefined,
    });
  });

  return results;
};

export const search = async (query: string): Promise<SearchResponse> => {
  const response = await api.get<SearchApiResponse>(`/api/search?q=${encodeURIComponent(query)}`);
  const results = mapSearchResults(response.data);
  return {
    query,
    results,
    totalCount: results.length,
  };
};

// ============================================
// NOTIFICATIONS (derived from alerts for now)
// ============================================
const mapAlertToNotification = (alert: AlertsResponse['data'][number]): Notification => {
  const severity = alert.severity?.toLowerCase();
  const type: Notification['type'] =
    severity === 'critical' ? 'emergency' :
    severity === 'high' ? 'warning' :
    severity === 'medium' ? 'info' :
    'info';

  return {
    id: alert.id,
    type,
    title: `${alert.alertType} Alert`,
    message: alert.message,
    region: alert.district || alert.state,
    timestamp: alert.createdAt,
    isRead: alert.isRead,
  };
};

export const fetchNotifications = async (): Promise<NotificationResponse> => {
  const response = await api.post<AlertsResponse>('/api/alerts', {});
  const notifications = response.data.map(mapAlertToNotification);
  const unreadCount = notifications.filter(n => !n.isRead).length;
  return { notifications, unreadCount };
};

export const markAllNotificationsRead = async (): Promise<void> => {
  // No bulk endpoint in contract; treat as no-op for now.
  return;
};
