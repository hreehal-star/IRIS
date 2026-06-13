import { useDisasters, type Disaster } from '../../hooks/useDisasters';

interface SidebarProps {
  onSelectEvent: (disaster: Disaster) => void;
  selectedEventId?: string;
}

export default function Sidebar({ onSelectEvent, selectedEventId }: SidebarProps) {
  const { data: disasters, isLoading } = useDisasters();

  if (isLoading) {
    return (
      <div className="absolute top-0 left-0 h-full w-80 bg-black/80 border-r border-white/10 p-6 flex flex-col z-10 backdrop-blur-md">
        <h2 className="text-white text-xl font-bold mb-4">Live Feed</h2>
        <div className="text-white/50">Establishing secure uplink...</div>
      </div>
    );
  }

  return (
    <div className="absolute top-0 left-0 h-full w-80 bg-black/80 border-r border-white/10 p-4 flex flex-col z-10 backdrop-blur-md">
      <h2 className="text-white text-xl font-bold mb-4 uppercase tracking-widest border-b border-white/20 pb-2">
        Live Feed
      </h2>
      
      <div className="overflow-y-auto flex-1 pr-2 space-y-3 custom-scrollbar">
        {disasters?.map((disaster) => (
          <div 
            key={disaster.id}
            onClick={() => onSelectEvent(disaster)}
            className={`p-3 rounded-lg cursor-pointer transition-all duration-200 border ${
              selectedEventId === disaster.id 
                ? 'bg-blue-500/20 border-blue-500' 
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="flex justify-between items-start mb-1">
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                disaster.type === 'wildfire' ? 'bg-orange-500/20 text-orange-400' : 
                disaster.type === 'crisis' ? 'bg-purple-500/20 text-purple-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {disaster.type.toUpperCase()}
              </span>
              <span className="text-white/50 text-xs">
                {new Date(disaster.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <h3 className="text-white text-sm font-semibold truncate" title={disaster.title}>
              {disaster.title}
            </h3>
            <div className="text-white/70 text-xs mt-2 flex justify-between">
              <span>Severity: {disaster.severity.toFixed(1)}</span>
              <span>{disaster.source}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}