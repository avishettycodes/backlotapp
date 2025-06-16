import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export function GarageDoorButton() {
  const navigate = useNavigate()
  const [isOpening, setIsOpening] = useState(false)

  const handleClick = () => {
    setIsOpening(true)
    setTimeout(() => {
      navigate('/mygarage')
      setIsOpening(false) // Reset state after navigation
    }, 2500) // 2.5 seconds for animation
  }

  return (
    <svg
      width={32}
      height={32}
      viewBox="0 0 32 32"
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <defs>
        <clipPath id="garageDoorClip">
          {/* Defines the shape of the visible garage door opening */}
          <path d="M8 16 Q8 13 16 13 Q24 13 24 16 V26 H8 Z" />
        </clipPath>
      </defs>

      {/* Group for the garage door slats, clipped by the defined path */}
      <g clipPath="url(#garageDoorClip)">
      {/* Garage door slats */}
        {[0, 1, 2, 3].map(i => (
        <rect
          key={i}
            x={9}
            y={isOpening ? 17 - (i * 2.5) - 15 : 17 + i * 2.5} // Animate y position upwards
            width={14}
            height={1.5}
          rx={0.5}
          fill="#4A5568"
            style={{
              transition: 'all 2.5s ease-in-out', // Smooth transition
            }}
        />
      ))}
      </g>

      {/* Garage walls and outline (drawn last to ensure strokes are on top) */}
      <path
        d="M2 12 L16 4 L30 12 V28 H2 Z M8 16 Q8 13 16 13 Q24 13 24 16 V26 H8 Z"
        stroke="#4A5568"
        strokeWidth={1.5}
        fill="none"
      />
    </svg>
  )
} 