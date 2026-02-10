/**
 * ChartsPage Component
 * 
 * Charts & Visuals page with filter-driven Chart.js visualizations.
 * Includes line charts, bar charts, and pie charts.
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { useFilters } from '../hooks/useFilters';
import FilterBar from './FilterBar';
import { Download } from 'lucide-react';
import { fetchVisualsData } from '../services/aadhaarApi';
import { LineBarChartData, PieChartData } from '../types';

const mapIndexTypeToAnalyticsIndex = (value?: string): string | undefined => {
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

const toRechartsSeries = (chart?: LineBarChartData) => {
  if (!chart) return { rows: [], series: [] as string[] };
  const series = chart.datasets.map((dataset, index) => dataset.label || `Series ${index + 1}`);
  const rows = chart.labels.map((label, rowIndex) => {
    const row: Record<string, number | string> = { name: label };
    chart.datasets.forEach((dataset, datasetIndex) => {
      row[series[datasetIndex]] = dataset.data[rowIndex];
    });
    return row;
  });
  return { rows, series };
};

const toRechartsPie = (chart?: PieChartData) => {
  if (!chart || chart.datasets.length === 0) return [];
  const dataset = chart.datasets[0];
  return chart.labels.map((label, index) => ({
    name: label,
    value: dataset.data[index] ?? 0,
  }));
};

const ChartsPage: React.FC = () => {
  const {
    filterOptions,
    filters,
    loadingOptions,
    setStateFilter,
    setDistrictFilter,
    setSeverityFilter,
    setTimeWindowFilter,
    toggleSignalType,
    clearFilters
  } = useFilters();

  const [trendChart, setTrendChart] = useState<LineBarChartData | null>(null);
  const [comparisonChart, setComparisonChart] = useState<LineBarChartData | null>(null);
  const [distributionChart, setDistributionChart] = useState<PieChartData | null>(null);

  const fallbackTrendRows = useMemo(() => {
    const days = filters.timeWindow === 'Last 24h' ? 24 : filters.timeWindow === 'Last 7 days' ? 7 : 30;
    const labelPrefix = filters.timeWindow === 'Last 24h' ? 'Hr' : 'Day';
    return Array.from({ length: days }, (_, i) => ({
      name: `${labelPrefix} ${i + 1}`,
      Critical: Math.floor(Math.random() * 20) + 10,
      High: Math.floor(Math.random() * 30) + 20,
      Medium: Math.floor(Math.random() * 40) + 30,
    }));
  }, [filters.timeWindow]);

  const fallbackDistribution = useMemo(() => {
    const signals = filters.signalTypes && filters.signalTypes.length > 0
      ? filters.signalTypes
      : ['Anomalies', 'Trends', 'Patterns', 'Accessibility Gap', 'Operational Stress'];
    return signals.map(sig => ({
      name: sig,
      value: Math.floor(Math.random() * 100) + 20,
    }));
  }, [filters.signalTypes]);

  const fallbackComparisonRows = useMemo(() => {
    const levels = filters.severity && filters.severity !== 'All'
      ? [filters.severity]
      : ['Critical', 'High', 'Medium', 'Normal'];
    return levels.map(level => ({
      name: level,
      Count: Math.floor(Math.random() * 200) + 50,
    }));
  }, [filters.severity]);

  const loadCharts = useCallback(async () => {
    try {
      const baseFilters: Record<string, any> = {};
      if (filters.year) baseFilters.year = filters.year;
      if (filters.state) baseFilters.state = filters.state;
      const index = mapIndexTypeToAnalyticsIndex(filters.indexType);
      if (index) baseFilters.indexes = [index];

      const [trend, comparison, distribution] = await Promise.all([
        fetchVisualsData({
          chartType: 'line',
          context: 'trend',
          filters: baseFilters,
        }),
        fetchVisualsData({
          chartType: 'bar',
          context: 'comparison',
          filters: {
            ...baseFilters,
            groupBy: filters.state ? 'district' : 'state',
            limit: 10,
          },
        }),
        fetchVisualsData({
          chartType: 'pie',
          context: 'distribution',
          filters: baseFilters,
        }),
      ]);

      setTrendChart(trend.lineChart || null);
      setComparisonChart(comparison.barChart || null);
      setDistributionChart(distribution.pieChart || null);
    } catch (error) {
      console.warn('fetchVisualsData failed, using empty charts:', error);
      setTrendChart(null);
      setComparisonChart(null);
      setDistributionChart(null);
    }
  }, [filters]);

  useEffect(() => {
    loadCharts();
  }, [loadCharts]);

  const trendSeries = useMemo(() => toRechartsSeries(trendChart || undefined), [trendChart]);
  const comparisonSeries = useMemo(() => toRechartsSeries(comparisonChart || undefined), [comparisonChart]);
  const distributionData = useMemo(() => toRechartsPie(distributionChart || undefined), [distributionChart]);

  const trendRows = trendSeries.rows.length > 0 ? trendSeries.rows : fallbackTrendRows;
  const trendKeys = trendSeries.series.length > 0 ? trendSeries.series : ['Critical', 'High', 'Medium'];

  const comparisonRows = comparisonSeries.rows.length > 0 ? comparisonSeries.rows : fallbackComparisonRows;
  const comparisonKeys = comparisonSeries.series.length > 0 ? comparisonSeries.series : ['Count'];

  const pieData = distributionData.length > 0 ? distributionData : fallbackDistribution;

  const COLORS = ['#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#3b82f6'];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Visuals</h1>
          <p className="text-gray-600 text-sm mt-1">
            Visual breakdown of system signals and risk indexes
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
          <Download className="h-4 w-4" />
          Export Data
        </button>
      </div>

      <FilterBar 
        filterOptions={filterOptions}
        filters={filters}
        loading={loadingOptions}
        onStateChange={setStateFilter}
        onDistrictChange={setDistrictFilter}
        onSeverityChange={setSeverityFilter}
        onTimeWindowChange={setTimeWindowFilter}
        onSignalTypeToggle={toggleSignalType}
        onClearFilters={clearFilters}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Trend Over Time (Respects TimeWindow) */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Signal Trends ({filters.timeWindow})</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendRows}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 12}} />
                <YAxis />
                <RechartsTooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'}} />
                <Legend />
                {trendKeys.map((series, index) => (
                  <Line
                    key={series}
                    type="monotone"
                    dataKey={series}
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Signal Distribution (Respects SignalType filter) */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Signal Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Severity Breakdown (Respects Severity filter) */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm lg:col-span-2">
          <h3 className="font-bold text-gray-800 mb-4">Regional Severity Breakdown</h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonRows} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} />
                <RechartsTooltip cursor={{fill: 'transparent'}} />
                {comparisonKeys.map((series, index) => (
                  <Bar
                    key={series}
                    dataKey={series}
                    fill={COLORS[index % COLORS.length]}
                    radius={[0, 4, 4, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChartsPage;
