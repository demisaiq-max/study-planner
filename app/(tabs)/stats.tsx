import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TrendingUp, Award, Target, Clock } from "lucide-react-native";
import { useStudyStore } from "@/hooks/study-store";

const { width } = Dimensions.get("window");

export default function StatsScreen() {
  const { todayStudyTime, weeklyStudyTime, monthlyGoal } = useStudyStore();
  
  const weekData = [
    { day: "Mon", hours: 3.5 },
    { day: "Tue", hours: 4.2 },
    { day: "Wed", hours: 2.8 },
    { day: "Thu", hours: 5.1 },
    { day: "Fri", hours: 4.7 },
    { day: "Sat", hours: 6.2 },
    { day: "Sun", hours: todayStudyTime / 60 },
  ];

  const maxHours = Math.max(...weekData.map(d => d.hours));

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Study Statistics</Text>
          <Text style={styles.subtitle}>Track your progress</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, styles.statCardPrimary]}>
            <Clock size={24} color="#FFFFFF" />
            <Text style={styles.statValueLight}>{Math.floor(todayStudyTime / 60)}h {todayStudyTime % 60}m</Text>
            <Text style={styles.statLabelLight}>Today's Study</Text>
          </View>
          
          <View style={styles.statCard}>
            <TrendingUp size={24} color="#34C759" />
            <Text style={styles.statValue}>{weeklyStudyTime}h</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
          
          <View style={styles.statCard}>
            <Target size={24} color="#FF9500" />
            <Text style={styles.statValue}>{monthlyGoal}h</Text>
            <Text style={styles.statLabel}>Monthly Goal</Text>
          </View>
          
          <View style={styles.statCard}>
            <Award size={24} color="#AF52DE" />
            <Text style={styles.statValue}>15</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Weekly Overview</Text>
          <View style={styles.chart}>
            {weekData.map((data, index) => (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barWrapper}>
                  <View 
                    style={[
                      styles.bar, 
                      { 
                        height: `${(data.hours / maxHours) * 100}%`,
                        backgroundColor: index === 6 ? "#007AFF" : "#E5E5EA",
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.barLabel}>{data.day}</Text>
                <Text style={styles.barValue}>{data.hours.toFixed(1)}h</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.subjectsContainer}>
          <Text style={styles.sectionTitle}>Subject Distribution</Text>
          <View style={styles.subjectsList}>
            {[
              { name: "Mathematics", percentage: 35, color: "#007AFF" },
              { name: "Korean", percentage: 25, color: "#34C759" },
              { name: "English", percentage: 20, color: "#FF9500" },
              { name: "Science", percentage: 20, color: "#AF52DE" },
            ].map((subject, index) => (
              <View key={index} style={styles.subjectItem}>
                <View style={styles.subjectInfo}>
                  <View style={[styles.subjectDot, { backgroundColor: subject.color }]} />
                  <Text style={styles.subjectName}>{subject.name}</Text>
                  <Text style={styles.subjectPercentage}>{subject.percentage}%</Text>
                </View>
                <View style={styles.subjectBar}>
                  <View 
                    style={[
                      styles.subjectProgress, 
                      { width: `${subject.percentage}%`, backgroundColor: subject.color }
                    ]} 
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.achievementsContainer}>
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.achievementsScroll}
          >
            {[
              { icon: "🔥", title: "7 Day Streak", date: "2 days ago" },
              { icon: "⭐", title: "100 Tasks Done", date: "1 week ago" },
              { icon: "🎯", title: "Goal Achieved", date: "2 weeks ago" },
              { icon: "📚", title: "50 Hours Studied", date: "3 weeks ago" },
            ].map((achievement, index) => (
              <View key={index} style={styles.achievementCard}>
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDate}>{achievement.date}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#8E8E93",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: (width - 52) / 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statCardPrimary: {
    backgroundColor: "#007AFF",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    marginTop: 8,
  },
  statValueLight: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 4,
  },
  statLabelLight: {
    fontSize: 12,
    color: "#FFFFFF",
    marginTop: 4,
    opacity: 0.9,
  },
  chartContainer: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 20,
  },
  chart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 150,
  },
  barContainer: {
    flex: 1,
    alignItems: "center",
  },
  barWrapper: {
    height: 120,
    width: "60%",
    justifyContent: "flex-end",
  },
  bar: {
    width: "100%",
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 10,
    color: "#8E8E93",
    marginTop: 8,
  },
  barValue: {
    fontSize: 10,
    color: "#000000",
    fontWeight: "600",
    marginTop: 2,
  },
  subjectsContainer: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 16,
  },
  subjectsList: {
    gap: 16,
  },
  subjectItem: {
    gap: 8,
  },
  subjectInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  subjectDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  subjectName: {
    flex: 1,
    fontSize: 14,
    color: "#000000",
  },
  subjectPercentage: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
  },
  subjectBar: {
    height: 6,
    backgroundColor: "#F2F2F7",
    borderRadius: 3,
    overflow: "hidden",
  },
  subjectProgress: {
    height: "100%",
    borderRadius: 3,
  },
  achievementsContainer: {
    marginTop: 20,
    paddingLeft: 20,
  },
  achievementsScroll: {
    paddingRight: 20,
  },
  achievementCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginRight: 12,
    width: 140,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
    textAlign: "center",
    marginBottom: 4,
  },
  achievementDate: {
    fontSize: 11,
    color: "#8E8E93",
  },
});