import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Globe from './components/Canvas/Globe';
import { useState } from 'react';
import Sidebar from './components/UI/Sidebar';
import DetailsPanel from './components/UI/DetailsPanel';
import { type Disaster } from './hooks/useDisasters';
import { useDisasterWebSocket } from './hooks/useDisasterWebSocket';

function App() {
  const [selectedDisaster, setSelectedDisaster] = useState<Disaster | null>(null);
  useDisasterWebSocket();

  return (
      <div className="relative w-screen h-screen bg-[#050505] overflow-hidden">
        <Sidebar onSelectEvent={setSelectedDisaster} selectedEventId={selectedDisaster?.id}/>
        <DetailsPanel disaster={selectedDisaster} onClose={() => setSelectedDisaster(null)}/>
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <OrbitControls minDistance={1.2} maxDistance={5} enablePan={false}/>
        <Globe selectedDisaster={selectedDisaster} onMarkerClick={setSelectedDisaster}/>
      </Canvas>
      </div>
  );
}

export default App;