/**
 * PolicyPage Component
 * 
 * Displays policy-safe solution frameworks in card format.
 * No prescriptive actions - only frameworks for consideration.
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Loader2,
  AlertTriangle,
  Users,
  Settings,
  Target,
  Eye,
  MapPin,
  ChevronRight,
  Lightbulb,
} from 'lucide-react';
import { PolicyFramework, PolicyFrameworkType } from '../types';
import { fetchPolicyFrameworks } from '../services/aadhaarApi';
import { useFilters } from '../hooks/useFilters';
import FilterBar from './FilterBar';

// Framework icons
const getFrameworkIcon = (type: PolicyFrameworkType) => {
  switch (type) {
    case 'CAPACITY_AUGMENTATION': return <Users className="h-6 w-6" />;
    case 'OPERATIONAL_STABILISATION': return <Settings className="h-6 w-6" />;
    case 'INCLUSION_OUTREACH': return <Target className="h-6 w-6" />;
    case 'MONITOR_ONLY': return <Eye className="h-6 w-6" />;
    default: return <Lightbulb className="h-6 w-6" />;
  }
};

// Framework colors
const getFrameworkColors = (type: PolicyFrameworkType) => {
  switch (type) {
    case 'CAPACITY_AUGMENTATION': return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', iconBg: 'bg-blue-100' };
    case 'OPERATIONAL_STABILISATION': return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', iconBg: 'bg-purple-100' };
    case 'INCLUSION_OUTREACH': return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', iconBg: 'bg-green-100' };
    default: return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', iconBg: 'bg-gray-100' };
  }
};

// Priority badge
const getPriorityBadge = (priority: PolicyFramework['priority']) => {
  switch (priority) {
    case 'High': return 'bg-red-100 text-red-700 border-red-200';
    case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    default: return 'bg-green-100 text-green-700 border-green-200';
  }
};

const PolicyPage: React.FC = () => {
  const { filterOptions, filters, loadingOptions, setStateFilter, setDistrictFilter, setSeverityFilter, setTimeWindowFilter, toggleSignalType, clearFilters } = useFilters();
  
  const [frameworks, setFrameworks] = useState<PolicyFramework[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedFramework, setExpandedFramework] = useState<string | null>(null);

  // Load frameworks
  const loadFrameworks = useCallback(async () => {
    setLoading(true);
    try {
      const apiFilters: any = {};
      if (filters.state) apiFilters.state = filters.state;
      if (filters.district) apiFilters.district = filters.district;
      
      const data = await fetchPolicyFrameworks(apiFilters);
      setFrameworks(data);
    } catch {
      console.warn('Using mock frameworks');
      // Use existing mock generation
      setFrameworks([
        { id: '1', type: 'CAPACITY_AUGMENTATION', title: 'Enrolment Center Expansion', description: 'Increase capacity in high-demand districts.', applicableRegions: ['Uttar Pradesh'], priority: 'High', indicators: ['Demand > 75%'] },
        { id: '2', type: 'OPERATIONAL_STABILISATION', title: 'System Performance Optimization', description: 'Address biometric failures.', applicableRegions: ['Bihar'], priority: 'High', indicators: ['Failure rate > 15%'] },
      ]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadFrameworks();
  }, [loadFrameworks]);

  // Group frameworks by type
  const frameworksByType = frameworks.reduce((acc, framework) => {
    if (!acc[framework.type]) acc[framework.type] = [];
    acc[framework.type].push(framework);
    return acc;
  }, {} as Record<PolicyFrameworkType, PolicyFramework[]>);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Policy Frameworks</h1>
        <p className="text-gray-600 text-sm mt-1">
          Solution frameworks for addressing identified issues
        </p>
      </div>

      {/* Filter Bar */}
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

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Lightbulb className="h-5 w-5 text-amber-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">Policy Guidance Only</p>
            <p className="text-sm text-amber-700 mt-1">
              These are analytical suggestions based on system data.
            </p>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="bg-white rounded-lg border p-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-3" />
          <p className="text-gray-600">Loading policy frameworks...</p>
        </div>
      ) : (
        /* Framework Cards */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(frameworksByType).map(([type, typeFrameworks]) => {
            const colors = getFrameworkColors(type as PolicyFrameworkType);
            return (
              <div key={type} className={`rounded-lg border ${colors.border} overflow-hidden`}>
                {/* Type Header */}
                <div className={`px-5 py-4 ${colors.bg} border-b ${colors.border}`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${colors.iconBg}`}>
                      <span className={colors.text}>{getFrameworkIcon(type as PolicyFrameworkType)}</span>
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-900">{type.replace(/_/g, ' ')}</h2>
                      <p className="text-xs text-gray-500 mt-0.5">{typeFrameworks.length} frameworks</p>
                    </div>
                  </div>
                </div>

                {/* Frameworks List */}
                <div className="bg-white divide-y divide-gray-100">
                  {typeFrameworks.map((framework) => (
                    <div key={framework.id} className="p-4">
                      <div className="flex items-start justify-between cursor-pointer" onClick={() => setExpandedFramework(expandedFramework === framework.id ? null : framework.id)}>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-sm text-gray-900">{framework.title}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${getPriorityBadge(framework.priority)}`}>
                              {framework.priority}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-2">{framework.description}</p>
                        </div>
                        <ChevronRight className={`h-5 w-5 text-gray-400 transition-transform ${expandedFramework === framework.id ? 'rotate-90' : ''}`} />
                      </div>

                      {/* Expanded Content */}
                      {expandedFramework === framework.id && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          {/* Applicable Regions */}
                          <p className="text-[10px] text-gray-500 font-medium uppercase mb-2">Applicable Regions</p>
                          <div className="flex flex-wrap gap-2">
                            {framework.applicableRegions.map((region, idx) => (
                              <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                <MapPin className="h-3 w-3" />{region}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PolicyPage;
