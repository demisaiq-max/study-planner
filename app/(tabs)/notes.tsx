import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plus, Search, Calendar, Clock, CheckCircle } from "lucide-react-native";
import { useStudyStore } from "@/hooks/study-store";

export default function NotesScreen() {
  const { tasks, subjects, addTask, toggleTask } = useStudyStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = !selectedSubject || task.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Study Notes</Text>
        <TouchableOpacity style={styles.addButton}>
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#8E8E93" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search tasks..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#8E8E93"
        />
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{totalCount}</Text>
          <Text style={styles.statLabel}>Total Tasks</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{completedCount}</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{completionRate}%</Text>
          <Text style={styles.statLabel}>Progress</Text>
        </View>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.subjectFilter}
        contentContainerStyle={styles.subjectFilterContent}
      >
        <TouchableOpacity
          style={[styles.subjectChip, !selectedSubject && styles.subjectChipActive]}
          onPress={() => setSelectedSubject(null)}
        >
          <Text style={[styles.subjectChipText, !selectedSubject && styles.subjectChipTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        {subjects.map((subject) => (
          <TouchableOpacity
            key={subject}
            style={[styles.subjectChip, selectedSubject === subject && styles.subjectChipActive]}
            onPress={() => setSelectedSubject(subject)}
          >
            <Text style={[styles.subjectChipText, selectedSubject === subject && styles.subjectChipTextActive]}>
              {subject}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView 
        style={styles.tasksList}
        contentContainerStyle={styles.tasksContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredTasks.map((task) => (
          <TouchableOpacity
            key={task.id}
            style={styles.taskCard}
            onPress={() => toggleTask(task.id)}
          >
            <View style={styles.taskHeader}>
              <View style={styles.taskInfo}>
                <Text style={[styles.taskTitle, task.completed && styles.taskCompleted]}>
                  {task.title}
                </Text>
                <View style={styles.taskMeta}>
                  <View style={styles.taskMetaItem}>
                    <Calendar size={12} color="#8E8E93" />
                    <Text style={styles.taskMetaText}>{task.dueDate || "No due date"}</Text>
                  </View>
                  <View style={styles.taskMetaItem}>
                    <Clock size={12} color="#8E8E93" />
                    <Text style={styles.taskMetaText}>{task.estimatedTime || "0"} min</Text>
                  </View>
                </View>
              </View>
              <View style={[styles.taskCheckbox, task.completed && styles.taskCheckboxChecked]}>
                {task.completed && <CheckCircle size={20} color="#34C759" />}
              </View>
            </View>
            {task.subject && (
              <View style={styles.taskSubject}>
                <Text style={styles.taskSubjectText}>{task.subject}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 44,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000000",
  },
  statsCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 12,
    padding: 20,
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#8E8E93",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#E5E5EA",
  },
  subjectFilter: {
    marginTop: 15,
    paddingLeft: 20,
    maxHeight: 40,
  },
  subjectFilterContent: {
    paddingRight: 20,
  },
  subjectChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  subjectChipActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  subjectChipText: {
    fontSize: 14,
    color: "#8E8E93",
    fontWeight: "500",
  },
  subjectChipTextActive: {
    color: "#FFFFFF",
  },
  tasksList: {
    flex: 1,
    marginTop: 15,
  },
  tasksContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  taskCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  taskInfo: {
    flex: 1,
    marginRight: 12,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
  },
  taskCompleted: {
    textDecorationLine: "line-through",
    color: "#8E8E93",
  },
  taskMeta: {
    flexDirection: "row",
    gap: 16,
  },
  taskMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  taskMetaText: {
    fontSize: 12,
    color: "#8E8E93",
  },
  taskCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#C7C7CC",
    justifyContent: "center",
    alignItems: "center",
  },
  taskCheckboxChecked: {
    borderColor: "#34C759",
    backgroundColor: "#34C75910",
  },
  taskSubject: {
    marginTop: 8,
  },
  taskSubjectText: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "500",
  },
});