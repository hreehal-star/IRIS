import {getCartesianCoordinates} from "../../core/mathUtils";
import {useState} from 'react';
import * as THREE from 'three';
import CameraController from './CameraController';

const TEST_LOCATIONS = [
  { latitude: 50, longitude: 0 },
  { latitude: -20, longitude: 30 },
  { latitude: 0, longitude: -80 }
];

export default function Globe() {
  // store the  3D vector that is tracked
  const [activeTarget, setActiveTarget] = useState<THREE.Vector3 | null>(null);

  return (
    <group>
      <CameraController targetPosition={activeTarget} />
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#4A90E2" wireframe={true} />
      </mesh>

      {TEST_LOCATIONS.map((location, index) => {
        const positionVector = getCartesianCoordinates(
          location.latitude,
          location.longitude
        );

        return (
          <mesh 
            key={index} 
            position={positionVector}
            onClick={(e) => {
              e.stopPropagation(); // prevents clicking from passing through the earth
              setActiveTarget(positionVector);
            }}
          >
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshBasicMaterial color="#FF3366" />
          </mesh>
        );
      })}
    </group>
  );
}