import { Group, Image, Text } from 'react-konva';

const CHARACTER_SIZE = 24;

const Character = ({ charData, scale = { x: 1, y: 1 }, characterImage }) => {
  if (!charData) return null;

  const px = charData.position?.x ?? 0;
  const py = charData.position?.y ?? 0;
  const x = px * scale.x;
  const y = py * scale.y;

  const label = charData.name ?? `#${charData._id ?? '?'}`;

  return (
    <Group x={x} y={y}>
      {characterImage ? (
        <Image
          image={characterImage}
          width={CHARACTER_SIZE}
          height={CHARACTER_SIZE}
          offsetX={CHARACTER_SIZE / 2}
          offsetY={CHARACTER_SIZE / 2}
          shadowColor="black"
          shadowBlur={8}
          shadowOpacity={0.7}
        />
      ) : (
        <Circle
          radius={CHARACTER_SIZE / 2}
          fill="red"
          stroke="#FFFFFF"
          strokeWidth={1}
        />
      )}
      
      <Text
        text={label}
        fontSize={12}
        fontFamily="Roboto, sans-serif"
        fill="white"
        y={(CHARACTER_SIZE / 2) + 4}
        offsetX={label.length * 3}
        stroke="black"
        strokeWidth={0.5}
      />
    </Group>
  );
};

export default Character;