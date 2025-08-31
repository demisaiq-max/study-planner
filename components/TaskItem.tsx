import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Check } from "lucide-react-native";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority?: "high" | "medium" | "low";
}

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
}

export default function TaskItem({ task, onToggle }: TaskItemProps) {
  const getPriorityColor = () => {
    switch (task.priority) {
      case "high":
        return "#FF3B30";
      case "medium":
        return "#FF9500";
      case "low":
        return "#34C759";
      default:
        return "#007AFF";
    }
  };
  
  return (
    <TouchableOpacity style={styles.container} onPress={onToggle}>
      <View style={styles.leftSection}>
        <View 
          style={[
            styles.checkbox, 
            task.completed && styles.checkboxCompleted,
            { borderColor: task.completed ? "#34C759" : "#C7C7CC" }
          ]}
        >
          {task.completed && <Check size={14} color="#FFFFFF" />}
        </View>
        <Text style={[styles.title, task.completed && styles.titleCompleted]}>
          {task.title}
        </Text>
      </View>
      {task.priority && (
        <View style={[styles.priorityDot, { backgroundColor: getPriorityColor() }]} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxCompleted: {
    backgroundColor: "#34C759",
    borderColor: "#34C759",
  },
  title: {
    fontSize: 15,
    color: "#000000",
    flex: 1,
  },
  titleCompleted: {
    textDecorationLine: "line-through",
    color: "#8E8E93",
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
});