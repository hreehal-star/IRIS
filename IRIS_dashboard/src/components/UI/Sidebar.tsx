import { useDisasters, type Disaster } from '../../hooks/useDisasters';
import { useState, useMemo } from 'react';

interface SidebarProps {
  onSelectEvent: (disaster: Disaster) => void;
  selectedEventId?: string;
}

type SortOption = 'time' | 'severity' | 'type';

export default function Sidebar({ onSelectEvent, selectedEventId }: SidebarProps) {
  const { data: disasters, isLoading } = useDisasters();
  const [sortBy, setSortBy] = useState<SortOption>('time');

  const sortedDisasters = useMemo(() => {
    if (!disasters) return [];
    
    // Create a copy of the array before sorting to avoid mutating the React Query cache
    return [...disasters].sort((a, b) => {
      if (sortBy === 'time') {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
      if (sortBy === 'severity') {
        return b.severity - a.severity;
      }
      if (sortBy === 'type') {
        return a.type.localeCompare(b.type);
      }
      return 0;
    });
  }, [disasters, sortBy]);

  if (isLoading) {
    return (
      <div className="absolute top-0 left-0 h-full w-80 bg-black/80 border-r border-white/10 p-6 flex flex-col z-10 backdrop-blur-md">
        <h2 className="text-white text-xl font-bold mb-4">Live Feed</h2>
        <div className="text-white/50">Establishing uplink...</div>
      </div>
    );
  }
return (
    // Reduced width to w-72, increased transparency to black/40 to show more of the 3D globe underneath
    <div className="absolute top-0 left-0 h-full w-72 bg-black/40 border-r border-white/10 p-4 flex flex-col z-10 backdrop-blur-md transition-all">
      
      {/* Header & Sorting */}
      <div className="mb-4 border-b border-white/10 pb-4">
        <h2 className="text-white text-lg font-bold tracking-widest uppercase mb-3">Live Feed</h2>
        
        <div className="flex gap-2">
          {(['time', 'severity', 'type'] as SortOption[]).map((option) => (
            <button
              key={option}
              onClick={() => setSortBy(option)}
              className={`flex-1 text-[10px] uppercase tracking-wider py-1.5 rounded transition-colors ${
                sortBy === option 
                  ? 'bg-blue-600 text-white font-bold' 
                  : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      
      <div className="overflow-y-auto flex-1 pr-2 space-y-2 custom-scrollbar">
        {sortedDisasters.map((disaster) => (
          <div 
            key={disaster.id}
            onClick={() => onSelectEvent(disaster)}
            className={`p-2.5 rounded-lg cursor-pointer transition-all duration-200 border ${
              selectedEventId === disaster.id 
                ? 'bg-blue-500/20 border-blue-500' 
                : 'bg-black/40 border-white/5 hover:bg-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex justify-between items-center mb-1.5">
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                disaster.type === 'wildfire' ? 'bg-orange-500/20 text-orange-400' : 
                disaster.type === 'crisis' ? 'bg-purple-500/20 text-purple-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {disaster.type}
              </span>
              <span className="text-white/40 text-[10px]">
                {new Date(disaster.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            
            <h3 className="text-white/90 text-xs font-semibold leading-tight line-clamp-2 mb-2" title={disaster.title}>
              {disaster.title}
            </h3>
            
            <div className="text-white/50 text-[10px] flex justify-between items-end">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
                Mag: {disaster.severity.toFixed(1)}
              </span>
              <span className="truncate max-w-[90px] text-right">{disaster.source}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}