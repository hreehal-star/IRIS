import { useState } from 'react';
import * as THREE from 'three';
import CameraController from './CameraController';
import Markers from "./Markers"
import {useTexture} from '@react-three/drei';
import { useMemo } from 'react';
import { type Disaster } from '../../hooks/useDisasters';
import { getCartesianCoordinates } from '../../core/mathUtils';

interface GlobeProps {
  selectedDisaster: Disaster | null;
  onMarkerClick: (disaster: Disaster) => void;
}

export default function Globe({ selectedDisaster, onMarkerClick }: GlobeProps) {
  const activeTargetVector = useMemo(() => {
    if (!selectedDisaster) return null;
    return getCartesianCoordinates(selectedDisaster.latitude, selectedDisaster.longitude);
  }, [selectedDisaster]);
  
  const earthTexture = useTexture('/earth_satellite.jpg');

  return (
    <group>
      <CameraController targetPosition={activeTargetVector} />
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial map={earthTexture} roughness={0.6} metalness = {0.1} />
      </mesh>
      <Markers onMarkerClick={onMarkerClick} />
    </group>
  );
}