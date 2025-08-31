import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface CalendarWidgetProps {
  currentDate: Date;
}

export default function CalendarWidget({ currentDate }: CalendarWidgetProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const date = currentDate.getDate();
  const day = currentDate.getDay();
  
  const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  const getWeekDates = () => {
    const weekDates = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(date - day + 1); // Start from Monday
    
    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(startOfWeek);
      weekDate.setDate(startOfWeek.getDate() + i);
      weekDates.push({
        date: weekDate.getDate(),
        day: dayNames[(i + 1) % 7], // Adjust for Monday start
        isToday: weekDate.getDate() === date && weekDate.getMonth() === month,
      });
    }
    return weekDates;
  };
  
  const weekDates = getWeekDates();
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.monthYear}>{year}년 {monthNames[month]}</Text>
      </View>
      
      <View style={styles.weekContainer}>
        {weekDates.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={[styles.dayItem, item.isToday && styles.todayItem]}
          >
            <Text style={[styles.dayNumber, item.isToday && styles.todayText]}>
              {item.date}
            </Text>
            <Text style={[styles.dayName, item.isToday && styles.todayText]}>
              {item.day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    marginBottom: 16,
  },
  monthYear: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  weekContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayItem: {
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
    minWidth: 40,
  },
  todayItem: {
    backgroundColor: "#007AFF",
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  dayName: {
    fontSize: 11,
    color: "#8E8E93",
  },
  todayText: {
    color: "#FFFFFF",
  },
});