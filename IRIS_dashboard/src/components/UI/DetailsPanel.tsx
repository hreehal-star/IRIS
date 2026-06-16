import { type Disaster } from '../../hooks/useDisasters';
interface DetailsPanelProps {
  disaster: Disaster | null;
  onClose: () => void;
}

export default function DetailsPanel({ disaster, onClose }: DetailsPanelProps) {
  if (!disaster) return null;

  return (
    <div className="absolute top-6 right-6 w-96 bg-black/80 border border-white/10 rounded-xl p-6 z-10 backdrop-blur-md shadow-2xl">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
      >
        ✕
      </button>

      <div className="mb-4">
        <h2 className="text-white text-2xl font-bold leading-tight">{disaster.title}</h2>
        <p className="text-white/50 text-sm mt-1">Source: {disaster.source}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/5 p-3 rounded-lg border border-white/5">
          <div className="text-white/50 text-xs uppercase mb-1">Latitude</div>
          <div className="text-white font-mono">{disaster.latitude.toFixed(4)}°</div>
        </div>
        <div className="bg-white/5 p-3 rounded-lg border border-white/5">
          <div className="text-white/50 text-xs uppercase mb-1">Longitude</div>
          <div className="text-white font-mono">{disaster.longitude.toFixed(4)}°</div>
        </div>
        <div className="bg-white/5 p-3 rounded-lg border border-white/5">
          <div className="text-white/50 text-xs uppercase mb-1">Severity</div>
          <div className="text-white font-mono text-lg text-red-400">{disaster.severity.toFixed(1)}</div>
        </div>
        <div className="bg-white/5 p-3 rounded-lg border border-white/5">
          <div className="text-white/50 text-xs uppercase mb-1">Time</div>
          <div className="text-white font-mono text-sm">
            {new Date(disaster.timestamp).toLocaleDateString()}
          </div>
        </div>
      </div>

      <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium transition-colors">
        View Report
      </button>
    </div>
  );
}