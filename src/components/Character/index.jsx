import { Group, Circle, Text } from 'react-konva';

const speciesColorMap = {
  'Anão': '#c0392b',
  'Humano': '#3498db',
  'Elfo': '#2ecc71',
  'Fada': '#9b59b6',
  'Goblin': '#f1c40f',
  'Orc': '#2c3e50',
  'Troll': '#7f8c8d',
  'Zumbi': '#16a085',
  'default': '#ffffff'
};

const Character = ({ charData, scale = { x: 1, y: 1 } }) => {
  if (!charData) return null;

  const px = charData.position?.x ?? charData.pos?.x ?? charData.x ?? charData.coordinates?.x ?? 0;
  const py = charData.position?.y ?? charData.pos?.y ?? charData.y ?? charData.coordinates?.y ?? 0;

  const x = (typeof px === 'number' ? px : parseFloat(px || 0)) * (scale.x ?? 1);
  const y = (typeof py === 'number' ? py : parseFloat(py || 0)) * (scale.y ?? 1);

  const speciesName = charData.species?.name ?? charData.species ?? 'default';
  const color = speciesColorMap[speciesName] || speciesColorMap.default;

  const label = charData.name ?? charData.displayName ?? `#${charData.id ?? charData._id ?? '?'}`;

  const radius = 9;

  return (
    <Group x={x} y={y}>
      <Circle
        radius={radius}
        fill={color}
        stroke="#FFFFFF"
        strokeWidth={2}
        shadowColor="black"
        shadowBlur={6}
        shadowOpacity={0.6}
      />

      <Text
        text={label}
        fontSize={12}
        fontFamily="Roboto"
        fill="white"
        x={-Math.min(80, label.length * 5)}
        y={radius + 4}
        stroke="black"
        strokeWidth={0.4}
      />
    </Group>
  );
};

export default Character;