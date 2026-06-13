import * as THREE from 'three';
import { getCartesianCoordinates } from '../../core/mathUtils';
import { useDisasters, type Disaster } from '../../hooks/useDisasters';

interface MarkersProps {
  onMarkerClick: (disaster: Disaster) => void;
}

function getMarkerVisuals(disaster: Disaster) {
  if (disaster.type === 'wildfire') {
    return { color: '#ffaa00', scale: Math.max(0.012, disaster.severity * 0.015) };
  }
  return { color: '#ff4444', scale: Math.max(0.012, disaster.severity * 0.008) };
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

        const { color, scale } = getMarkerVisuals(disaster);

        return (
          <mesh
            key={disaster.id}
            position={positionVector}
            onClick={(e) => {
              e.stopPropagation();
              onMarkerClick(disaster);
            }}
          >
            <sphereGeometry args={[scale, 16, 16]} />
            <meshBasicMaterial color={color} />
          </mesh>
        );
      })}
    </>
  );
}