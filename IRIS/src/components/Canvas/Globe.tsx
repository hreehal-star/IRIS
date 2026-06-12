export default function Globe() {
  return (
    <mesh>
      {/* A sphere with radius 1, and 32 segments for horizontal/vertical resolution */}
      <sphereGeometry args={[1, 32, 32]} />
      {/* A wireframe material so we can see the mathematical structure */}
      <meshStandardMaterial color="#4A90E2" wireframe={true} />
    </mesh>
  );
}