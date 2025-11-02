interface BlochSphereProps {
  probabilities: Record<string, number>;
}

export const BlochSphere = ({ probabilities }: BlochSphereProps) => {
  console.log('BlochSphere rendering with probabilities:', probabilities);
  
  // Calculate state representation
  const prob0 = Math.max(0, Math.min(1, probabilities['0'] || 0));
  const prob1 = Math.max(0, Math.min(1, probabilities['1'] || 0));
  
  // Calculate angle for 2D projection (theta on XZ plane)
  const theta = 2 * Math.acos(Math.sqrt(prob0));
  const angle = isFinite(theta) ? theta : 0;
  
  // Convert to 2D coordinates (side view of Bloch sphere)
  const centerX = 200;
  const centerY = 200;
  const radius = 150;
  
  // Calculate state vector position
  const stateX = centerX;
  const stateY = centerY - (radius * Math.cos(angle));
  
  return (
    <div className="w-full h-[400px] bg-muted/30 rounded-lg flex items-center justify-center">
      <svg width="400" height="400" viewBox="0 0 400 400">
        {/* Background circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
        
        {/* Vertical axis */}
        <line
          x1={centerX}
          y1={centerY - radius - 20}
          x2={centerX}
          y2={centerY + radius + 20}
          stroke="hsl(var(--primary))"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
        />
        
        {/* Arrow marker definition */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="5"
            refY="5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 5, 0 10"
              fill="hsl(var(--primary))"
            />
          </marker>
        </defs>
        
        {/* |0⟩ label at top */}
        <text
          x={centerX + 15}
          y={centerY - radius - 25}
          fill="hsl(var(--primary))"
          fontSize="18"
          fontWeight="bold"
        >
          |0⟩
        </text>
        
        {/* |1⟩ label at bottom */}
        <text
          x={centerX + 15}
          y={centerY + radius + 35}
          fill="hsl(var(--primary))"
          fontSize="18"
          fontWeight="bold"
        >
          |1⟩
        </text>
        
        {/* State vector line */}
        <line
          x1={centerX}
          y1={centerY}
          x2={stateX}
          y2={stateY}
          stroke="hsl(var(--chart-1))"
          strokeWidth="4"
        />
        
        {/* State point */}
        <circle
          cx={stateX}
          cy={stateY}
          r="8"
          fill="hsl(var(--chart-1))"
        />
        
        {/* Probability labels */}
        <text
          x={20}
          y={30}
          fill="hsl(var(--foreground))"
          fontSize="14"
        >
          P(|0⟩) = {(prob0 * 100).toFixed(1)}%
        </text>
        <text
          x={20}
          y={50}
          fill="hsl(var(--foreground))"
          fontSize="14"
        >
          P(|1⟩) = {(prob1 * 100).toFixed(1)}%
        </text>
        
        {/* Angle indicator */}
        {angle > 0.1 && (
          <path
            d={`M ${centerX} ${centerY - 30} A 30 30 0 0 1 ${centerX + 30 * Math.sin(angle)} ${centerY - 30 * Math.cos(angle)}`}
            fill="none"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth="1"
            strokeDasharray="2,2"
          />
        )}
      </svg>
    </div>
  );
};
