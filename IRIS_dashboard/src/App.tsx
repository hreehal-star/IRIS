import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Globe from './components/Canvas/Globe';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <OrbitControls minDistance={1.2} maxDistance={5}/>
        <Globe/>
      </Canvas>
    </QueryClientProvider>
  );
}

export default App;