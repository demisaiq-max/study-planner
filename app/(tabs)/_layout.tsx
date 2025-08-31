import { Tabs } from "expo-router";
import { Home, Clock, BookOpen, BarChart3, Users } from "lucide-react-native";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#8E8E93",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#E5E5EA",
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "홈",
          tabBarIcon: ({ color, size }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="timer"
        options={{
          title: "타이머",
          tabBarIcon: ({ color, size }) => <Clock size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          title: "목록",
          tabBarIcon: ({ color, size }) => <BookOpen size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: "성적관리",
          tabBarIcon: ({ color, size }) => <BarChart3 size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: "커뮤니티",
          tabBarIcon: ({ color, size }) => <Users size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}