import React from 'react';
import Svg, { Rect, Path } from 'react-native-svg';

export default function ParkingLogo({ size = 36 }: { size?: number }) {
  // U-shaped stall dimensions
  const bottomLineY = size * 0.8;
  const leftX = size * 0.1;
  const rightX = size * 0.9;
  const topY = size * 0.1;
  
  // Car dimensions
  const carWidth = size * 0.4;
  const carHeight = size * 0.15;
  const carX = size * 0.5 - carWidth / 2; // Center horizontally
  const carY = bottomLineY - carHeight; // Flush on top of bottom line
  
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* U-shaped stall - open at top */}
      <Path
        d={`
          M${leftX},${topY}
          L${leftX},${bottomLineY}
          L${rightX},${bottomLineY}
          L${rightX},${topY}
        `}
        fill="none"
        stroke="#0A3D62"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Car block - backed into stall */}
      <Rect
        x={carX}
        y={carY}
        width={carWidth}
        height={carHeight}
        rx={2}
        ry={2}
        fill="#3A5CA8"
      />
    </Svg>
  );
} 