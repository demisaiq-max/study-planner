import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from "react-native";
import { ChevronLeft, Users, BookOpen, Trophy, MessageSquare } from "lucide-react-native";
import { useLanguage } from "@/hooks/language-context";
import { useRouter, Stack } from "expo-router";

interface GradeGroup {
  id: string;
  title: string;
  description: string;
  members: number;
  posts: number;
  icon: string;
  lastActivity: string;
}

const gradeGroups: GradeGroup[] = [
  {
    id: "1",
    title: "문과 5등급 스터디",
    description: "함께 공부하며 성적을 올려요!",
    members: 234,
    posts: 89,
    icon: "📚",
    lastActivity: "방금 전",
  },
  {
    id: "2",
    title: "이과 5등급 모임",
    description: "수학/과학 문제 풀이 공유",
    members: 189,
    posts: 67,
    icon: "🔬",
    lastActivity: "5분 전",
  },
  {
    id: "3",
    title: "예체능 5등급",
    description: "예체능 입시 정보 공유",
    members: 156,
    posts: 45,
    icon: "🎨",
    lastActivity: "1시간 전",
  },
];

export default function CommunityGradeScreen() {
  const { language } = useLanguage();
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<GradeGroup | null>(null);

  const handleGroupPress = (group: GradeGroup) => {
    setSelectedGroup(group);
    Alert.alert(
      language === 'ko' ? '그룹 참여' : 'Join Group',
      language === 'ko' 
        ? `${group.title}에 참여하시겠습니까?` 
        : `Would you like to join ${group.title}?`,
      [
        {
          text: language === 'ko' ? '취소' : 'Cancel',
          style: 'cancel',
        },
        {
          text: language === 'ko' ? '참여' : 'Join',
          onPress: () => {
            Alert.alert(
              language === 'ko' ? '성공' : 'Success',
              language === 'ko' ? '그룹에 참여했습니다!' : 'You have joined the group!'
            );
          },
        },
      ]
    );
  };

  const filteredGroups = gradeGroups.filter(group =>
    group.title.toLowerCase().includes(searchText.toLowerCase()) ||
    group.description.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: language === 'ko' ? '내 등급 모임' : 'My Grade Group',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: -8 }}>
              <ChevronLeft size={24} color="#000000" />
            </TouchableOpacity>
          ),
        }} 
      />
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder={language === 'ko' ? '그룹 검색...' : 'Search groups...'}
            placeholderTextColor="#8E8E93"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Users size={20} color="#007AFF" />
            <Text style={styles.statNumber}>579</Text>
            <Text style={styles.statLabel}>
              {language === 'ko' ? '전체 멤버' : 'Total Members'}
            </Text>
          </View>
          <View style={styles.statCard}>
            <BookOpen size={20} color="#34C759" />
            <Text style={styles.statNumber}>201</Text>
            <Text style={styles.statLabel}>
              {language === 'ko' ? '오늘의 게시물' : "Today's Posts"}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Trophy size={20} color="#FF9500" />
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>
              {language === 'ko' ? '이번주 랭킹' : 'Weekly Rank'}
            </Text>
          </View>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>
            {language === 'ko' ? '추천 그룹' : 'Recommended Groups'}
          </Text>
          
          {filteredGroups.map((group) => (
            <TouchableOpacity
              key={group.id}
              style={styles.groupCard}
              onPress={() => handleGroupPress(group)}
              activeOpacity={0.7}
            >
              <View style={styles.groupHeader}>
                <View style={styles.groupIcon}>
                  <Text style={styles.groupIconText}>{group.icon}</Text>
                </View>
                <View style={styles.groupInfo}>
                  <Text style={styles.groupTitle}>{group.title}</Text>
                  <Text style={styles.groupDescription}>{group.description}</Text>
                </View>
              </View>
              
              <View style={styles.groupStats}>
                <View style={styles.groupStat}>
                  <Users size={14} color="#8E8E93" />
                  <Text style={styles.groupStatText}>{group.members}</Text>
                </View>
                <View style={styles.groupStat}>
                  <MessageSquare size={14} color="#8E8E93" />
                  <Text style={styles.groupStatText}>{group.posts}</Text>
                </View>
                <Text style={styles.lastActivity}>{group.lastActivity}</Text>
              </View>
            </TouchableOpacity>
          ))}

          <View style={styles.createGroupContainer}>
            <Text style={styles.createGroupTitle}>
              {language === 'ko' ? '원하는 그룹이 없나요?' : "Can't find your group?"}
            </Text>
            <TouchableOpacity style={styles.createGroupButton}>
              <Text style={styles.createGroupButtonText}>
                {language === 'ko' ? '새 그룹 만들기' : 'Create New Group'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  searchInput: {
    height: 36,
    backgroundColor: "#F2F2F7",
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: "#000000",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000000",
    marginTop: 8,
  },
  statLabel: {
    fontSize: 11,
    color: "#8E8E93",
    marginTop: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  groupCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  groupHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  groupIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  groupIconText: {
    fontSize: 24,
  },
  groupInfo: {
    flex: 1,
  },
  groupTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  groupDescription: {
    fontSize: 13,
    color: "#8E8E93",
    lineHeight: 18,
  },
  groupStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  groupStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  groupStatText: {
    fontSize: 12,
    color: "#8E8E93",
  },
  lastActivity: {
    fontSize: 12,
    color: "#8E8E93",
    marginLeft: "auto",
  },
  createGroupContainer: {
    marginHorizontal: 16,
    marginTop: 24,
    padding: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    alignItems: "center",
  },
  createGroupTitle: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 12,
  },
  createGroupButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#007AFF",
    borderRadius: 8,
  },
  createGroupButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});