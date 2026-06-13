import { useState } from 'react';
import * as THREE from 'three';
import CameraController from './CameraController';
import Markers from "./Markers"
import {useTexture} from '@react-three/drei';

export default function Globe() {
  const [activeTarget, setActiveTarget] = useState<THREE.Vector3 | null>(null);
  const earthTexture = useTexture('/earth_satellite.jpg');
  return (
    <group>
      <CameraController targetPosition={activeTarget} />
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial map={earthTexture} roughness={0.6} metalness = {0.1} />
      </mesh>
      <Markers onMarkerClick={setActiveTarget} />
    </group>
  );
}