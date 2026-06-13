import {useFrame} from '@react-three/fiber'
import * as THREE from 'three';

interface CameraControllerProps {
  targetPosition: THREE.Vector3 | null;
}

// camera's resting radius
const CAMERA_ORBIT_RADIUS = 2.5;

export default function CameraController({ targetPosition }: CameraControllerProps) {
  useFrame(({ camera }, delta) => {
    if (!targetPosition) return;

    // calculating where the camera should be
    const wantedCameraPos = targetPosition.clone().normalize().multiplyScalar(CAMERA_ORBIT_RADIUS);

    // finding camera's current position towards the target position
    camera.position.lerp(wantedCameraPos, 2.0 * delta);

    camera.position.normalize().multiplyScalar(CAMERA_ORBIT_RADIUS);
    camera.lookAt(0, 0, 0);
  });

  return null;
}