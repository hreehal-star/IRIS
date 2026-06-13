import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Globe from './components/Canvas/Globe';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import { useState } from 'react';
import Sidebar from './components/UI/Sidebar';
import DetailsPanel from './components/UI/DetailsPanel';
import { type Disaster } from './hooks/useDisasters';

const queryClient = new QueryClient();

function App() {
  const [selectedDisaster, setSelectedDisaster] = useState<Disaster | null>(null);
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

export default App;