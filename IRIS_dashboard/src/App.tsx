import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Globe from './components/Canvas/Globe';

function App() {
  return (
    // The Canvas component automatically sizes itself to its parent container (#root)
    <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
      
      {/* Lighting is required to see 3D objects */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={2} />
      
      {/* Allows you to use your mouse to rotate and zoom around the origin */}
      <OrbitControls />

      {/* Your custom 3D component */}
      <Globe />
      
    </Canvas>
  );
}

export default App;