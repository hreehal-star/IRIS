import * as THREE from 'three';
import { getCartesianCoordinates } from '../../core/mathUtils';
import { useDisasters } from '../../hooks/useDisasters';

interface MarkersProps {
  onMarkerClick: (position: THREE.Vector3) => void;
}

export default function Markers({ onMarkerClick }: MarkersProps) {
  const { data: disasters, isLoading, error } = useDisasters();

  if (isLoading) console.log("Streaming disaster metrics...");
  if (error) console.error("Data stream interrupted:", error);

  return (
    <>
      {disasters?.map((disaster) => {
        const positionVector = getCartesianCoordinates(
          disaster.latitude,
          disaster.longitude
        );

        const markerScale = Math.max(0.01, disaster.severity * 0.008);

        return (
          <mesh
            key={disaster.id}
            position={positionVector}
            onClick={(e) => {
              e.stopPropagation();
              onMarkerClick(positionVector);
            }}
          >
            <sphereGeometry args={[markerScale, 16, 16]} />
            <meshBasicMaterial color="#ff4444" />
          </mesh>
        );
      })}
    </>
  );
}