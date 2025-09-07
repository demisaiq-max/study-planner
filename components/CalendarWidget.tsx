import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location?: string;
  description?: string;
  color: string;
}

interface CalendarWidgetProps {
  currentDate: Date;
}

export default function CalendarWidget({ currentDate }: CalendarWidgetProps) {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const date = currentDate.getDate();
  const day = currentDate.getDay();
  
  const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  // Load events when component mounts and when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadEvents();
    }, [])
  );
  
  const loadEvents = async () => {
    try {
      const stored = await AsyncStorage.getItem('calendar_events');
      if (stored) {
        setEvents(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };
  
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  

  
  const getEventsForDate = (checkDate: Date) => {
    const dateStr = formatDate(checkDate);
    return events.filter(event => event.date === dateStr);
  };
  
  const getWeekDates = () => {
    const weekDates = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(date - day + 1); // Start from Monday
    
    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(startOfWeek);
      weekDate.setDate(startOfWeek.getDate() + i);
      const dayEvents = getEventsForDate(weekDate);
      weekDates.push({
        date: weekDate.getDate(),
        day: dayNames[(i + 1) % 7], // Adjust for Monday start
        isToday: weekDate.getDate() === date && weekDate.getMonth() === month,
        hasEvents: dayEvents.length > 0,
        eventColors: dayEvents.slice(0, 3).map(e => e.color),
      });
    }
    return weekDates;
  };
  
  const weekDates = getWeekDates();
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => router.push('/calendar')}
      activeOpacity={0.8}
    >
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
            {item.hasEvents && (
              <View style={styles.eventIndicators}>
                {item.eventColors.map((color, i) => (
                  <View
                    key={i}
                    style={[styles.eventDot, { backgroundColor: color }]}
                  />
                ))}
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </TouchableOpacity>
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
  eventIndicators: {
    flexDirection: "row",
    marginTop: 4,
    justifyContent: "center",
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 1,
  },
});