import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

interface DayCardProps {
  title: string;
  daysLeft: number;
  date: string;
}

export default function DayCard({ title, daysLeft, date }: DayCardProps) {
  const isUrgent = daysLeft <= 30;
  
  return (
    <TouchableOpacity style={[styles.card, isUrgent && styles.cardUrgent]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.date}>{date}</Text>
      <Text style={[styles.daysLeft, isUrgent && styles.daysLeftUrgent]}>
        D-{daysLeft}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: width * 0.4,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardUrgent: {
    backgroundColor: "#FFF4F4",
    borderWidth: 1,
    borderColor: "#FF3B30",
  },
  title: {
    fontSize: 12,
    color: "#8E8E93",
    marginBottom: 4,
  },
  date: {
    fontSize: 11,
    color: "#C7C7CC",
    marginBottom: 8,
  },
  daysLeft: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
  },
  daysLeftUrgent: {
    color: "#FF3B30",
  },
});