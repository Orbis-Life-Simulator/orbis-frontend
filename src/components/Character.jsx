// src/components/Character.js
import React, { useState } from 'react';
import { Circle, Text, Tag, Label } from 'react-konva';

const speciesColorMap = { 1: '#2c3e50', 2: '#3498db', 3: '#2ecc71', 4: '#f1c40f', 5: '#e67e22', 6: '#c0392b', 7: '#8e44ad', 8: '#7f8c8d' };

function Character({ charData }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = (e) => {
    e.target.getStage().container().style.cursor = 'pointer';
    setShowTooltip(true);
  };

  const handleMouseLeave = (e) => {
    e.target.getStage().container().style.cursor = 'default';
    setShowTooltip(false);
  };

  return (
    <>
      <Circle
        x={charData.position_x}
        y={charData.position_y}
        radius={7}
        fill={speciesColorMap[charData.species_id] || '#000000'}
        stroke="black"
        strokeWidth={1}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      />
      {showTooltip && (
        <Label x={charData.position_x + 10} y={charData.position_y - 10}>
          <Tag fill={'#f0f0f0'} pointerDirection={'down'} pointerWidth={10} pointerHeight={10} lineJoin={'round'} shadowColor={'black'} shadowBlur={10} shadowOpacity={0.5}/>
          <Text
            text={`Nome: ${charData.name}\nVida: ${charData.current_health}\nEstado: ${charData.current_state}`}
            fontFamily={'Calibri'}
            fontSize={14}
            padding={5}
            fill={'black'}
          />
        </Label>
      )}
    </>
  );
}

export default Character;