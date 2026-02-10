/**
 * FilterBar Component
 * 
 * Reusable filter bar for the Aadhaar Intelligence Dashboard.
 * Used across Heatmap, Charts, Reports, and other pages.
 */

import React from 'react';
import { Filter, Calendar, AlertCircle, MapPin, Activity, Check, X } from 'lucide-react';
import { 
  FilterOptions, 
  AppliedFilters, 
  SignalType, 
  SeverityLevel, 
  TimeWindow 
} from '../types';

interface FilterBarProps {
  filterOptions: FilterOptions | null;
  filters: AppliedFilters;
  loading: boolean;
  onStateChange: (state: string) => void;
  onDistrictChange: (district: string) => void;
  onSignalTypeToggle: (signal: SignalType) => void;
  onSeverityChange: (severity: SeverityLevel) => void;
  onTimeWindowChange: (window: TimeWindow) => void;
  onClearFilters: () => void;
  // Optional action button (e.g. for reports)
  actionButton?: {
    label: string;
    onClick: () => void;
    loading?: boolean;
  };
}

const SIGNAL_OPTIONS: SignalType[] = [
  'Anomalies', 
  'Trends', 
  'Patterns', 
  'Accessibility Gap', 
  'Operational Stress'
];

const SEVERITY_OPTIONS: SeverityLevel[] = ['All', 'Critical', 'High', 'Medium'];
const TIME_OPTIONS: TimeWindow[] = ['Last 24h', 'Last 7 days', 'Last 30 days'];

const FilterBar: React.FC<FilterBarProps> = ({
  filterOptions,
  filters,
  loading,
  onStateChange,
  onDistrictChange,
  onSignalTypeToggle,
  onSeverityChange,
  onTimeWindowChange,
  onClearFilters,
  actionButton,
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
      
      {/* SECTION 1: SIGNAL TYPE & SEVERITY */}
      <div className="p-4 border-b border-gray-100 grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Filter 1: Signal Type (Multi-select Chips) */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-blue-600" />
            <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">
              Signal Type (Select Multiple)
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            {SIGNAL_OPTIONS.map((signal) => {
              const isSelected = filters.signalTypes?.includes(signal);
              return (
                <button
                  key={signal}
                  onClick={() => onSignalTypeToggle(signal)}
                  className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border
                    ${isSelected 
                      ? 'bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-300' 
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
                  `}
                >
                  {isSelected && <Check className="h-3 w-3" />}
                  {signal}
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter 2: Severity (Segmented Control) */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">
              Severity Level
            </label>
          </div>
          <div className="inline-flex bg-gray-100 p-1 rounded-lg">
            {SEVERITY_OPTIONS.map((severity) => (
              <button
                key={severity}
                onClick={() => onSeverityChange(severity)}
                className={`
                  px-4 py-1.5 rounded-md text-xs font-medium transition-all
                  ${filters.severity === severity 
                    ? 'bg-white text-gray-900 shadow-sm ring-1 ring-black/5' 
                    : 'text-gray-500 hover:text-gray-900'}
                `}
              >
                {severity}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 2: GEOGRAPHY & TIME */}
      <div className="p-4 flex flex-col md:flex-row items-end md:items-center justify-between gap-4">
        
        <div className="flex flex-col md:flex-row gap-6 w-full">
          {/* Filter 3: Geography */}
          <div className="flex-1 max-w-md">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-green-600" />
              <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                Geography
              </label>
            </div>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <select
                  value={filters.state || ''}
                  onChange={(e) => onStateChange(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none"
                >
                  <option value="">All India</option>
                  {filterOptions?.states.map((state) => (
                    <option key={state.code} value={state.code}>
                      {state.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-2.5 pointer-events-none">
                  <Filter className="h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Show District only if State is selected */}
              {filters.state && (
                <div className="relative flex-1 animate-in fade-in slide-in-from-left-2">
                  <select
                    value={filters.district || ''}
                    onChange={(e) => onDistrictChange(e.target.value)}
                    className="w-full pl-3 pr-8 py-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none"
                  >
                    <option value="">All Districts</option>
                    {filterOptions?.districts
                      .filter((d) => d.stateCode === filters.state)
                      .map((district) => (
                        <option key={district.code} value={district.code}>
                          {district.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Filter 4: Time Window */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-purple-600" />
              <label className="text-xs font-bold uppercase text-gray-500 tracking-wider">
                Time Window
              </label>
            </div>
            <div className="flex gap-2">
              {TIME_OPTIONS.map((window) => {
                const isSelected = filters.timeWindow === window;
                return (
                  <button
                    key={window}
                    onClick={() => onTimeWindowChange(window)}
                    className={`
                      px-3 py-1.5 border rounded-lg text-xs font-medium transition-all
                      ${isSelected 
                        ? 'bg-purple-50 border-purple-200 text-purple-700' 
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'}
                    `}
                  >
                    {window}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Clear / Action Buttons */}
        <div className="flex items-center gap-3 pt-6 md:pt-0">
          <button
            onClick={onClearFilters}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Reset Filters"
          >
            <X className="h-5 w-5" />
          </button>
          
          {actionButton && (
            <button
              onClick={actionButton.onClick}
              disabled={actionButton.loading}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-sm whitespace-nowrap"
            >
              {actionButton.loading ? 'Processing...' : actionButton.label}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default FilterBar;
