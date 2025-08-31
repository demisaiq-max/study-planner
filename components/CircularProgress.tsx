import React from "react";
import { View, StyleSheet, Text } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface CircularProgressProps {
  percentage: number;
  size: number;
  strokeWidth: number;
  color?: string;
  showMultipleRings?: boolean;
  centerText?: string;
}

export default function CircularProgress({ 
  percentage, 
  size, 
  strokeWidth,
  color = "#007AFF",
  showMultipleRings = false,
  centerText
}: CircularProgressProps) {
  if (showMultipleRings) {
    const ringSpacing = strokeWidth + 8;
    const rings = [
      { radius: (size - strokeWidth) / 2, percentage: 75, color: "#34C759" },
      { radius: (size - strokeWidth) / 2 - ringSpacing, percentage: 60, color: "#FF9500" },
      { radius: (size - strokeWidth) / 2 - ringSpacing * 2, percentage: 45, color: "#FF3B30" }
    ];

    return (
      <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
        <Svg width={size} height={size} style={StyleSheet.absoluteFillObject}>
          {rings.map((ring, index) => {
            const circumference = 2 * Math.PI * ring.radius;
            const strokeDashoffset = circumference - (ring.percentage / 100) * circumference;
            
            return (
              <React.Fragment key={index}>
                <Circle
                  cx={size / 2}
                  cy={size / 2}
                  r={ring.radius}
                  stroke="#E5E5EA"
                  strokeWidth={strokeWidth - 2}
                  fill="none"
                />
                <Circle
                  cx={size / 2}
                  cy={size / 2}
                  r={ring.radius}
                  stroke={ring.color}
                  strokeWidth={strokeWidth - 2}
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  transform={`rotate(-90 ${size / 2} ${size / 2})`}
                />
              </React.Fragment>
            );
          })}
        </Svg>
        {centerText && (
          <Text style={styles.centerText}>{centerText}</Text>
        )}
      </View>
    );
  }

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFillObject}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E5EA"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  centerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
});