import React from 'react';
import { Svg, G, Rect, Text as SvgText, Circle, Path } from 'react-native-svg';

const formatNumber = (num: number): string => {
  const floorNumber = (value: number) => Math.floor(value);

  if (num >= 1000000000) {
    return floorNumber(num / 1000000000).toFixed(0) + 'B';
  } else if (num >= 1000000) {
    return floorNumber(num / 1000000).toFixed(0) + 'M';
  } else if (num >= 1000) {
    return floorNumber(num / 1000).toFixed(0) + 'k';
  } else {
    return floorNumber(num).toString();
  }
};

const Decorator = ({
  x,
  y,
  data,
  selectedIndex,
  setSelectedIndex,
  bookingDate,
}) => (
  <>
    {data.map((value, index) => {
      const circleY = y(value);
      const isUpperHalf = circleY < 150;
      const tooltipY = isUpperHalf ? circleY + 10 : circleY - 65;
      const textY1 = isUpperHalf ? circleY + 25 : circleY - 50;
      const textY2 = isUpperHalf ? circleY + 40 : circleY - 35;
      return (
        <G key={index}>
          <Circle
            cx={x(index)}
            cy={circleY}
            r={6}
            fill={'#0D69D7'}
            stroke={'#fff'}
            strokeWidth={4}
            onPress={() => setSelectedIndex(index)}
            accessibilityRole="button"
            accessibilityLabel={`Data point at index ${index}`}
          />
          {selectedIndex === index && (
            <G>
              <Rect
                x={x(index) - 45}
                y={tooltipY}
                width={90}
                height={50}
                fill={'#0D69D7'}
                rx={2}
                ry={2}
              />
              <SvgText
                x={x(index)}
                y={textY1}
                fill="white"
                fontSize={14}
                fontFamily="Lato"
                fontWeight={"600"}
                textAnchor="middle">
                {bookingDate[index]}
              </SvgText>
              <SvgText
                x={x(index)}
                y={textY2}
                fill="white"
                fontSize={14}
                fontFamily="Lato"
                fontWeight={"600"}
                textAnchor="middle">
                {`Sales: ₹${formatNumber(value)}`}
              </SvgText>
            </G>
          )}
        </G>
      );
    })}
  </>
);

export default Decorator;
