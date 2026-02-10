/**
 * useFilters Hook
 * 
 * Centralized filter state management for the Aadhaar Intelligence Dashboard.
 * Provides filter options from API and maintains current filter selections.
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  FilterOptions, 
  AppliedFilters, 
  MetricType, 
  AgeGroup, 
  IndexType,
  SignalType,
  SeverityLevel,
  TimeWindow
} from '../types';
import { fetchFilterOptions } from '../services/aadhaarApi';

// Mock filter options as fallback
const MOCK_FILTER_OPTIONS: FilterOptions = {
  states: [
    { code: 'Uttar Pradesh', name: 'Uttar Pradesh' },
    { code: 'Maharashtra', name: 'Maharashtra' },
    { code: 'Bihar', name: 'Bihar' },
    { code: 'West Bengal', name: 'West Bengal' },
    { code: 'Jammu & Kashmir', name: 'Jammu & Kashmir' },
    { code: 'Delhi', name: 'Delhi' },
    { code: 'Karnataka', name: 'Karnataka' },
    { code: 'Gujarat', name: 'Gujarat' },
  ],
  districts: [
    { code: 'Lucknow', name: 'Lucknow', stateCode: 'Uttar Pradesh' },
    { code: 'Varanasi', name: 'Varanasi', stateCode: 'Uttar Pradesh' },
    { code: 'Kanpur', name: 'Kanpur', stateCode: 'Uttar Pradesh' },
    { code: 'Mumbai', name: 'Mumbai', stateCode: 'Maharashtra' },
    { code: 'Srinagar', name: 'Srinagar', stateCode: 'Jammu & Kashmir' },
    { code: 'Jammu', name: 'Jammu', stateCode: 'Jammu & Kashmir' },
    { code: 'New Delhi', name: 'New Delhi', stateCode: 'Delhi' },
    { code: 'Bangalore', name: 'Bangalore', stateCode: 'Karnataka' },
  ],
  years: [2023, 2024, 2025],
  months: [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ],
  metricTypes: ['Enrolment', 'Biometric', 'Demographic'],
  ageGroups: ['All', '0-5', '5-18', '18-60', '60+'],
  indexTypes: ['CompositeRisk', 'Demand', 'Stress', 'Gap'],
  signalTypes: ['Anomalies', 'Trends', 'Patterns', 'Accessibility Gap', 'Operational Stress']
};

export const useFilters = () => {
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);
  const [loadingOptions, setLoadingOptions] = useState(true);
  
  const [filters, setFilters] = useState<AppliedFilters>({
    state: '',
    district: '',
    year: new Date().getFullYear(),
    metricType: 'Enrolment',
    ageGroup: 'All',
    indexType: 'CompositeRisk',
    severity: 'All',
    timeWindow: 'Last 7 days',
    signalTypes: ['Anomalies', 'Accessibility Gap', 'Operational Stress', 'Trends']
  });

  const [filteredDistricts, setFilteredDistricts] = useState<FilterOptions['districts']>([]);

  // Fetch filter options from API
  useEffect(() => {
    const loadOptions = async () => {
      setLoadingOptions(true);
      try {
        const data = await fetchFilterOptions();
        setFilterOptions(data);
      } catch {
        console.warn('Using mock filter options');
        setFilterOptions(MOCK_FILTER_OPTIONS);
      } finally {
        setLoadingOptions(false);
      }
    };
    loadOptions();
  }, []);

  // Update filtered districts when state changes
  useEffect(() => {
    if (filterOptions && filters.state) {
      const stateDistricts = filterOptions.districts.filter(d => d.stateCode === filters.state);
      setFilteredDistricts(stateDistricts);
    } else {
      setFilteredDistricts(filterOptions?.districts || []);
    }
  }, [filters.state, filterOptions]);

  // Handlers
  const setStateFilter = (state: string) => {
    setFilters(prev => ({ ...prev, state, district: '' })); // Reset district on state change
  };

  const setDistrictFilter = (district: string) => setFilters(prev => ({ ...prev, district }));
  const setYearFilter = (year: number) => setFilters(prev => ({ ...prev, year }));
  const setMonthFilter = (month: number) => setFilters(prev => ({ ...prev, month }));
  const setMetricTypeFilter = (metricType: MetricType) => setFilters(prev => ({ ...prev, metricType }));
  const setAgeGroupFilter = (ageGroup: AgeGroup) => setFilters(prev => ({ ...prev, ageGroup }));
  const setIndexTypeFilter = (indexType: IndexType) => setFilters(prev => ({ ...prev, indexType }));
  const setSeverityFilter = (severity: SeverityLevel) => setFilters(prev => ({ ...prev, severity }));
  const setTimeWindowFilter = (timeWindow: TimeWindow) => setFilters(prev => ({ ...prev, timeWindow }));
  
  const toggleSignalType = (signal: SignalType) => {
    setFilters(prev => {
      const current = prev.signalTypes || [];
      const exists = current.includes(signal);
      return {
        ...prev,
        signalTypes: exists 
          ? current.filter(s => s !== signal)
          : [...current, signal]
      };
    });
  };

  const clearFilters = () => {
    setFilters({
      state: '',
      district: '',
      year: new Date().getFullYear(),
      metricType: 'Enrolment',
      ageGroup: 'All',
      indexType: 'CompositeRisk',
      severity: 'All',
      timeWindow: 'Last 7 days',
      signalTypes: ['Anomalies']
    });
  };

  // Helper to filter data based on current filters
  const applyFiltersToData = useCallback(<T extends Record<string, any>>(data: T[]): T[] => {
    return data.filter(item => {
      if (filters.state && item.stateCode !== filters.state && item.state !== filters.state) return false;
      if (filters.district && item.districtCode !== filters.district && item.id !== filters.district) return false;
      
      if (filters.severity && filters.severity !== 'All') {
        if (item.severity !== filters.severity) return false;
      }

      if (filters.signalTypes && filters.signalTypes.length > 0) {
        if (item.signal) {
          if (!filters.signalTypes.includes(item.signal)) return false;
        }
      }
      
      return true;
    });
  }, [filters]);

  return {
    filterOptions,
    filters,
    loadingOptions,
    setStateFilter,
    setDistrictFilter,
    setYearFilter,
    setMonthFilter,
    setMetricTypeFilter,
    setAgeGroupFilter,
    setIndexTypeFilter,
    setSeverityFilter,
    setTimeWindowFilter,
    toggleSignalType,
    clearFilters,
    filteredDistricts,
    applyFiltersToData
  };
};
