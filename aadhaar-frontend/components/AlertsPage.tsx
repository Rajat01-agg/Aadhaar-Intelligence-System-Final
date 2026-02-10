/**
 * AlertsPage Component
 * 
 * Displays alert cards for anomalies, trends, gaps, and capacity issues.
 * Each card shows region, alert type, severity, explanation, and confidence.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  AlertTriangle,
  TrendingUp,
  Activity,
  MapPin,
  Loader2,
  CheckCircle,
  Eye,
} from 'lucide-react';
import { AadhaarAlert, AlertSeverity } from '../types';
import { fetchAlerts, fetchAlertsSummary, markAlertAsRead, markAlertAsResolved } from '../services/aadhaarApi';
import { useFilters } from '../hooks/useFilters';
import FilterBar from './FilterBar';

// Mock data for fallback
const MOCK_ALERTS: AadhaarAlert[] = [
  { id: '1', region: 'Lucknow', regionType: 'District', alertType: 'ANOMALY', severity: 'Critical', title: 'Spike in Enrolment Requests', explanation: 'Unusual 300% increase detected.', confidence: 92, detectedAt: new Date().toISOString() },
  { id: '2', region: 'Mumbai', regionType: 'District', alertType: 'TREND', severity: 'High', title: 'Rising Demand Pressure', explanation: 'Sustained upward trend for 7 days.', confidence: 88, detectedAt: new Date().toISOString() },
  { id: '3', region: 'Bihar', regionType: 'State', alertType: 'GAP', severity: 'Medium', title: 'Accessibility Gap Detected', explanation: 'Rural areas show 40% lower coverage.', confidence: 85, detectedAt: new Date().toISOString() },
];

const AlertsPage: React.FC = () => {
  const { filterOptions, filters, loadingOptions, setStateFilter, setDistrictFilter, setSeverityFilter, setTimeWindowFilter, toggleSignalType, clearFilters } = useFilters();
  
  const [alerts, setAlerts] = useState<AadhaarAlert[]>([]);
  const [summary, setSummary] = useState<{ total: number; critical: number; high: number; unread: number } | null>(null);
  const [loading, setLoading] = useState(true);

  const mapSignalToAlertType = (signal: string) => {
    switch (signal) {
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
        return signal.toLowerCase().replace(/ /g, '_');
    }
  };

  const loadAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const alertFilters: any = {};
      if (filters.state) alertFilters.state = filters.state;
      if (filters.district) alertFilters.district = filters.district;
      if (filters.severity && filters.severity !== 'All') alertFilters.severity = filters.severity.toLowerCase();
      if (filters.signalTypes && filters.signalTypes.length > 0) {
        alertFilters.alertType = mapSignalToAlertType(filters.signalTypes[0]);
      }

      const [alertsData, summaryData] = await Promise.all([
        fetchAlerts(alertFilters),
        fetchAlertsSummary(alertFilters),
      ]);
      setAlerts(alertsData);
      setSummary(summaryData);
    } catch {
      console.warn('Using mock alerts');
      setAlerts(MOCK_ALERTS);
      setSummary({ total: 3, critical: 1, high: 1, unread: 2 });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  const handleMarkRead = async (id: string) => {
    try {
      await markAlertAsRead(id);
      loadAlerts();
    } catch { /* ignore */ }
  };

  const handleResolve = async (id: string) => {
    try {
      await markAlertAsResolved(id);
      loadAlerts();
    } catch { /* ignore */ }
  };

  const getSeverityColor = (severity: AlertSeverity) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-700 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Alerts & Notifications</h1>
        <p className="text-gray-600 text-sm mt-1">System-detected anomalies and risk signals</p>
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

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-xs text-gray-500 uppercase font-bold">Total Alerts</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{summary.total}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg border border-red-200 shadow-sm">
            <p className="text-xs text-red-600 uppercase font-bold">Critical</p>
            <p className="text-2xl font-bold text-red-700 mt-1">{summary.critical}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 shadow-sm">
            <p className="text-xs text-orange-600 uppercase font-bold">High</p>
            <p className="text-2xl font-bold text-orange-700 mt-1">{summary.high}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 shadow-sm">
            <p className="text-xs text-blue-600 uppercase font-bold">Unread</p>
            <p className="text-2xl font-bold text-blue-700 mt-1">{summary.unread}</p>
          </div>
        </div>
      )}

      {/* Alerts List */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
          <h2 className="font-bold text-gray-800">Active Alerts</h2>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        ) : alerts.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-gray-500">
            <p>No alerts match your filters</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {alerts.map((alert) => (
              <div key={alert.id} className="p-4 hover:bg-gray-50 transition-colors flex items-start gap-4">
                <div className={`p-2 rounded-lg ${alert.severity === 'Critical' ? 'bg-red-100' : 'bg-orange-100'}`}>
                  <AlertTriangle className={`h-5 w-5 ${alert.severity === 'Critical' ? 'text-red-600' : 'text-orange-600'}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border uppercase ${getSeverityColor(alert.severity)}`}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{alert.explanation}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {alert.region}</span>
                    <span>Confidence: {alert.confidence?.toFixed(0)}%</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleMarkRead(alert.id)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Mark as Read">
                    <Eye className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleResolve(alert.id)} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg" title="Mark as Resolved">
                    <CheckCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsPage;
