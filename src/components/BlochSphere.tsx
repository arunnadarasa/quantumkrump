import { Canvas } from '@react-three/fiber';
import { OrbitControls, Line, Text } from '@react-three/drei';
import { Vector3 } from 'three';

interface BlochSphereProps {
  probabilities: Record<string, number>;
}

export const BlochSphere = ({ probabilities }: BlochSphereProps) => {
  // Calculate Bloch sphere coordinates from probabilities
  // For a single qubit: |ψ⟩ = cos(θ/2)|0⟩ + e^(iφ) sin(θ/2)|1⟩
  const prob0 = probabilities['0'] || 0;
  const prob1 = probabilities['1'] || 0;
  
  // Calculate theta from probabilities
  const theta = 2 * Math.acos(Math.sqrt(prob0));
  const phi = 0; // We don't have phase information from measurements
  
  // Convert to Cartesian coordinates
  const x = Math.sin(theta) * Math.cos(phi);
  const y = Math.sin(theta) * Math.sin(phi);
  const z = Math.cos(theta);

  return (
    <div className="w-full h-[400px] bg-muted/30 rounded-lg">
      <Canvas camera={{ position: [3, 3, 3], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        
        {/* Bloch Sphere */}
        <mesh>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial 
            color="hsl(var(--primary))" 
            transparent 
            opacity={0.1} 
            wireframe 
          />
        </mesh>

        {/* X, Y, Z axes */}
        <Line
          points={[[-1.5, 0, 0], [1.5, 0, 0]]}
          color="hsl(var(--destructive))"
          lineWidth={2}
        />
        <Line
          points={[[0, -1.5, 0], [0, 1.5, 0]]}
          color="hsl(var(--chart-2))"
          lineWidth={2}
        />
        <Line
          points={[[0, 0, -1.5], [0, 0, 1.5]]}
          color="hsl(var(--chart-3))"
          lineWidth={2}
        />

        {/* Axis labels */}
        <Text position={[1.7, 0, 0]} fontSize={0.2} color="hsl(var(--destructive))">
          X
        </Text>
        <Text position={[0, 1.7, 0]} fontSize={0.2} color="hsl(var(--chart-2))">
          Y
        </Text>
        <Text position={[0, 0, 1.7]} fontSize={0.2} color="hsl(var(--chart-3))">
          |0⟩
        </Text>
        <Text position={[0, 0, -1.7]} fontSize={0.2} color="hsl(var(--chart-3))">
          |1⟩
        </Text>

        {/* State vector arrow */}
        <Line
          points={[[0, 0, 0], [x, y, z]]}
          color="hsl(var(--primary))"
          lineWidth={4}
        />
        
        {/* State point */}
        <mesh position={[x, y, z]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="hsl(var(--primary))" />
        </mesh>

        <OrbitControls enableZoom={true} enablePan={false} />
      </Canvas>
    </div>
  );
};
