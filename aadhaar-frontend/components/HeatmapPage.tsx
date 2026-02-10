/**
 * HeatmapPage Component
 * 
 * India map with district-level dots colored by selected index type.
 * Uses Leaflet for map rendering and integrates with filter bar.
 */

import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useFilters } from '../hooks/useFilters';
import FilterBar from './FilterBar';
import { Loader2 } from 'lucide-react';
import { fetchHeatmapData } from '../services/aadhaarApi';

const SEVERITY_SIGNALS: Record<string, string[]> = {
  Critical: ['Anomalies', 'Patterns', 'Trends'],
  High: ['Operational Stress', 'Accessibility Gap', 'Trends'],
  Medium: ['Trends', 'Operational Stress'],
  Normal: ['Patterns', 'Accessibility Gap'],
};

const classifySeverity = (score: number): string => {
  if (score >= 80) return 'Critical';
  if (score >= 60) return 'High';
  if (score >= 40) return 'Medium';
  return 'Normal';
};

const pickSignal = (severity: string, seed: number): string => {
  const options = SEVERITY_SIGNALS[severity] || ['Trends'];
  return options[seed % options.length];
};

const generateMockDistricts = () => {
  const basePoints = [
    { id: 'SRN', name: 'Srinagar', state: 'Jammu & Kashmir', lat: 34.08, lng: 74.79 },
    { id: 'LEH', name: 'Leh', state: 'Ladakh', lat: 34.15, lng: 77.57 },
    { id: 'CHD', name: 'Chandigarh', state: 'Chandigarh', lat: 30.73, lng: 76.78 },
    { id: 'DEL', name: 'New Delhi', state: 'Delhi', lat: 28.61, lng: 77.20 },
    { id: 'LKO', name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.84, lng: 80.94 },
    { id: 'KNP', name: 'Kanpur', state: 'Uttar Pradesh', lat: 26.44, lng: 80.33 },
    { id: 'VNS', name: 'Varanasi', state: 'Uttar Pradesh', lat: 25.31, lng: 82.97 },
    { id: 'JPR', name: 'Jaipur', state: 'Rajasthan', lat: 26.91, lng: 75.78 },
    { id: 'JDP', name: 'Jodhpur', state: 'Rajasthan', lat: 26.24, lng: 73.02 },
    { id: 'UDR', name: 'Udaipur', state: 'Rajasthan', lat: 24.58, lng: 73.68 },
    { id: 'BPL', name: 'Bhopal', state: 'Madhya Pradesh', lat: 23.25, lng: 77.41 },
    { id: 'IND', name: 'Indore', state: 'Madhya Pradesh', lat: 22.72, lng: 75.86 },
    { id: 'GWL', name: 'Gwalior', state: 'Madhya Pradesh', lat: 26.22, lng: 78.18 },
    { id: 'LKO2', name: 'Prayagraj', state: 'Uttar Pradesh', lat: 25.44, lng: 81.84 },
    { id: 'PAT', name: 'Patna', state: 'Bihar', lat: 25.61, lng: 85.14 },
    { id: 'GAY', name: 'Gaya', state: 'Bihar', lat: 24.79, lng: 85.00 },
    { id: 'RNC', name: 'Ranchi', state: 'Jharkhand', lat: 23.34, lng: 85.31 },
    { id: 'JAM', name: 'Jamshedpur', state: 'Jharkhand', lat: 22.80, lng: 86.20 },
    { id: 'KOL', name: 'Kolkata', state: 'West Bengal', lat: 22.57, lng: 88.36 },
    { id: 'SIL', name: 'Siliguri', state: 'West Bengal', lat: 26.72, lng: 88.43 },
    { id: 'GWA', name: 'Guwahati', state: 'Assam', lat: 26.18, lng: 91.73 },
    { id: 'IMP', name: 'Imphal', state: 'Manipur', lat: 24.82, lng: 93.95 },
    { id: 'AIZ', name: 'Aizawl', state: 'Mizoram', lat: 23.73, lng: 92.72 },
    { id: 'SHL', name: 'Shillong', state: 'Meghalaya', lat: 25.57, lng: 91.88 },
    { id: 'BBS', name: 'Bhubaneswar', state: 'Odisha', lat: 20.27, lng: 85.84 },
    { id: 'CTC', name: 'Cuttack', state: 'Odisha', lat: 20.46, lng: 85.88 },
    { id: 'VSK', name: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.69, lng: 83.22 },
    { id: 'VJA', name: 'Vijayawada', state: 'Andhra Pradesh', lat: 16.51, lng: 80.64 },
    { id: 'HYD', name: 'Hyderabad', state: 'Telangana', lat: 17.38, lng: 78.48 },
    { id: 'WAR', name: 'Warangal', state: 'Telangana', lat: 17.97, lng: 79.59 },
    { id: 'BLR', name: 'Bengaluru', state: 'Karnataka', lat: 12.97, lng: 77.59 },
    { id: 'MYS', name: 'Mysuru', state: 'Karnataka', lat: 12.30, lng: 76.65 },
    { id: 'HUB', name: 'Hubballi', state: 'Karnataka', lat: 15.36, lng: 75.12 },
    { id: 'CHE', name: 'Chennai', state: 'Tamil Nadu', lat: 13.08, lng: 80.27 },
    { id: 'CBE', name: 'Coimbatore', state: 'Tamil Nadu', lat: 11.01, lng: 76.95 },
    { id: 'MDU', name: 'Madurai', state: 'Tamil Nadu', lat: 9.92, lng: 78.12 },
    { id: 'TVM', name: 'Thiruvananthapuram', state: 'Kerala', lat: 8.52, lng: 76.94 },
    { id: 'KOC', name: 'Kochi', state: 'Kerala', lat: 9.93, lng: 76.26 },
    { id: 'CAL', name: 'Kozhikode', state: 'Kerala', lat: 11.25, lng: 75.78 },
    { id: 'MUM', name: 'Mumbai', state: 'Maharashtra', lat: 19.07, lng: 72.87 },
    { id: 'PUN', name: 'Pune', state: 'Maharashtra', lat: 18.52, lng: 73.85 },
    { id: 'NAG', name: 'Nagpur', state: 'Maharashtra', lat: 21.15, lng: 79.09 },
    { id: 'NSK', name: 'Nashik', state: 'Maharashtra', lat: 19.99, lng: 73.78 },
    { id: 'AMD', name: 'Ahmedabad', state: 'Gujarat', lat: 23.03, lng: 72.58 },
    { id: 'SRG', name: 'Surat', state: 'Gujarat', lat: 21.17, lng: 72.83 },
    { id: 'RJK', name: 'Rajkot', state: 'Gujarat', lat: 22.30, lng: 70.80 },
    { id: 'GOA', name: 'Panaji', state: 'Goa', lat: 15.50, lng: 73.83 },
    { id: 'BHP', name: 'Bhopal East', state: 'Madhya Pradesh', lat: 23.30, lng: 77.45 },
    { id: 'RAI', name: 'Raipur', state: 'Chhattisgarh', lat: 21.25, lng: 81.63 },
    { id: 'BSP', name: 'Bilaspur', state: 'Chhattisgarh', lat: 22.08, lng: 82.15 },
    { id: 'JAI', name: 'Jaisalmer', state: 'Rajasthan', lat: 26.91, lng: 70.91 },
    { id: 'SHM', name: 'Shimla', state: 'Himachal Pradesh', lat: 31.10, lng: 77.17 },
    { id: 'DHN', name: 'Dehradun', state: 'Uttarakhand', lat: 30.32, lng: 78.03 },
    { id: 'JBL', name: 'Jabalpur', state: 'Madhya Pradesh', lat: 23.18, lng: 79.95 },
    { id: 'AGR', name: 'Agra', state: 'Uttar Pradesh', lat: 27.18, lng: 78.01 },
    { id: 'BKN', name: 'Bikaner', state: 'Rajasthan', lat: 28.02, lng: 73.31 },
  ];

  return basePoints.map((point, index) => {
    const score = 30 + (index * 7) % 70 + (index % 3) * 3;
    const severity = classifySeverity(score);
    return {
      id: point.id,
      name: point.name,
      state: point.state,
      stateCode: point.state.substring(0, 2).toUpperCase(),
      lat: point.lat,
      lng: point.lng,
      score,
      severity,
      signal: pickSignal(severity, index),
    };
  });
};

type HeatmapPoint = {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  score: number;
  severity: string;
  signal: string;
};

const formatSignalLabel = (raw: string | undefined): string => {
  if (!raw) return 'None';
  return raw.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (m) => m.toUpperCase());
};

const HeatmapPage: React.FC = () => {
  const {
    filterOptions,
    filters,
    loadingOptions,
    setStateFilter,
    setDistrictFilter,
    setSeverityFilter,
    setTimeWindowFilter,
    toggleSignalType,
    clearFilters,
  } = useFilters();
  
  const [heatmapPoints, setHeatmapPoints] = useState<HeatmapPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    const loadHeatmap = async () => {
      setIsLoading(true);
      try {
        const data = await fetchHeatmapData(filters);
        setHeatmapPoints(data.map((point) => ({
          id: point.districtCode,
          name: point.districtName,
          state: point.stateName,
          lat: point.coordinates[0],
          lng: point.coordinates[1],
          score: point.indexValue,
          severity: point.status === 'CRITICAL' ? 'Critical' : point.status === 'WATCH' ? 'High' : 'Normal',
          signal: formatSignalLabel(point.signals[0]?.label || point.signals[0]?.type),
        })));
      } catch (error) {
        console.warn('fetchHeatmapData failed, using mock data:', error);
        const fallback = generateMockDistricts();
        setHeatmapPoints(fallback.map((d) => ({
          id: d.id,
          name: d.name,
          state: d.state,
          lat: d.lat,
          lng: d.lng,
          score: d.score,
          severity: d.severity,
          signal: d.signal,
        })));
      } finally {
        setIsLoading(false);
      }
    };

    loadHeatmap();
  }, [filters]);

  const filteredData = useMemo(() => heatmapPoints, [heatmapPoints]);

  const getColor = (score: number) => {
    if (score >= 80) return '#dc2626'; // Critical
    if (score >= 60) return '#ea580c'; // High
    if (score >= 40) return '#ca8a04'; // Medium
    return '#16a34a'; // Low/Normal
  };

  return (
    <div className="space-y-4 h-full flex flex-col animate-in fade-in duration-500">
      <div className="flex-none">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Heatmap Analysis</h1>
        <p className="text-gray-600 text-sm mb-4">
          District-level visualization of Aadhaar system metrics across India
        </p>
        
        {/* Centralized Filter Bar */}
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
      </div>

      {/* Map Container Wrapper with explicit height */}
      <div className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm relative z-0 h-[600px]">
        {(loadingOptions || isLoading) && (
          <div className="absolute inset-0 z-50 bg-white/50 backdrop-blur-sm flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        )}
        
        {isMounted && (
          <MapContainer 
            key="aadhaar-heatmap-map"
            center={[22.5, 80.5]}
            zoom={5}
            minZoom={4}
            maxBounds={[[6, 68], [37.5, 97]]}
            maxBoundsViscosity={0.9}
            style={{ height: '100%', width: '100%', backgroundColor: '#e5e7eb' }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <ZoomControl position="bottomright" />

            {filteredData.map((d) => (
              <CircleMarker
                key={d.id}
                center={[d.lat, d.lng]}
                radius={8}
                fillColor={getColor(d.score)}
                color="white"
                weight={2}
                fillOpacity={0.8}
              >
                <Tooltip direction="top" offset={[0, -10]} opacity={1} sticky>
                  <div className="p-1 min-w-[200px]">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-gray-900">{d.name}</h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold text-white`} style={{background: getColor(d.score)}}>
                        {d.severity}
                      </span>
                    </div>
                    
                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex justify-between border-b border-dashed border-gray-200 pb-1">
                        <span>Signal Type:</span>
                        <span className="font-semibold text-blue-700">{d.signal}</span>
                      </div>
                      <div className="flex justify-between pt-1">
                        <span>{filters.indexType || 'Composite'} Index:</span>
                        <span className="font-mono font-bold">{d.score}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>State:</span>
                        <span>{d.state}</span>
                      </div>
                    </div>
                  </div>
                </Tooltip>
              </CircleMarker>
            ))}
          </MapContainer>
        )}
        
        {/* Floating Legend */}
        <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur p-3 rounded-lg shadow-lg border border-gray-200 z-[1000] text-xs">
          <h4 className="font-bold mb-2 text-gray-700">Severity Index</h4>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-600"></span> Critical (80+) <span className="text-gray-400 ml-auto">{filteredData.filter(d => d.score >= 80).length}</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-orange-600"></span> High (60-80) <span className="text-gray-400 ml-auto">{filteredData.filter(d => d.score >= 60 && d.score < 80).length}</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-yellow-600"></span> Medium (40-60) <span className="text-gray-400 ml-auto">{filteredData.filter(d => d.score >= 40 && d.score < 60).length}</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-600"></span> Normal (&lt;40) <span className="text-gray-400 ml-auto">{filteredData.filter(d => d.score < 40).length}</span></div>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-200 text-[10px] text-gray-500 text-center">
            Total Districts: {filteredData.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeatmapPage;
