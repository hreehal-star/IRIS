// src/components/UI/EventAdvisory.tsx
import { useState, useEffect } from 'react';
import { type Disaster } from '../../hooks/useDisasters';

interface EventAdvisoryProps {
  disaster: Disaster;
  onClose: () => void;
}

interface AdvisoryData {
  advisory_id: string;
  risk_level: string;
  impact_radius_km: number;
  advisory_type: string;
  coordinates: string;
  safety_tips: string[];
  summary: string;
}

export default function EventAdvisory({ disaster, onClose }: EventAdvisoryProps) {
  const [advisory, setAdvisory] = useState<AdvisoryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdvisory = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(disaster)
        });
        const data = await response.json();
        setAdvisory(data);
      } catch (error) {
        console.error("Failed to fetch advisory:", error);
      } finally {
        setTimeout(() => setIsLoading(false), 600);
      }
    };

    fetchAdvisory();
  }, [disaster]);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
      <div className="bg-[#111111] border border-white/10 w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="border-b border-white/5 p-6 flex justify-between items-start bg-white/5">
          <div>
            <div className="text-blue-400 font-semibold text-sm tracking-wider uppercase mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              Public Safety Advisory
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">{disaster.title}</h2>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white text-2xl transition-colors">✕</button>
        </div>

        {/* Body */}
        <div className="p-8 flex-1 min-h-[300px]">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="text-white/50">Compiling local event details...</div>
            </div>
          ) : advisory ? (
            <div className="space-y-8 animate-fade-in">
              
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/5 p-4 rounded-lg">
                  <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Risk Level</div>
                  <div className={`font-bold text-xl ${advisory.risk_level === 'SEVERE' ? 'text-red-400' : 'text-orange-400'}`}>
                    {advisory.risk_level}
                  </div>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Impact Radius</div>
                  <div className="text-white text-xl">{advisory.impact_radius_km} km</div>
                </div>
                <div className="bg-white/5 p-4 rounded-lg">
                  <div className="text-white/40 text-xs uppercase tracking-wider mb-1">Status</div>
                  <div className="text-white text-xl">{advisory.advisory_type}</div>
                </div>
              </div>

              <div>
                <h3 className="text-white/80 text-lg font-semibold mb-2">Situation Overview</h3>
                <p className="text-white/60 leading-relaxed text-md">{advisory.summary}</p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-5">
                <h3 className="text-blue-400 text-sm font-bold uppercase tracking-wider mb-3">Safety Recommendations</h3>
                <ul className="space-y-3">
                  {advisory.safety_tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-blue-500 mr-3 mt-0.5">•</span>
                      <span className="text-white/80 leading-snug">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-red-400">Failed to load event details.</div>
          )}
        </div>
      </div>
    </div>
  );
}