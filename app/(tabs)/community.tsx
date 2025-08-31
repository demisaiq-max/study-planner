import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react-native";

const posts = [
  {
    id: "1",
    author: "김수학",
    avatar: "https://i.pravatar.cc/150?img=1",
    time: "2 hours ago",
    content: "오늘 수능 모의고사 봤는데 수학 1등급 나왔어요! 꾸준히 하니까 되네요 💪",
    likes: 45,
    comments: 12,
    liked: true,
  },
  {
    id: "2",
    author: "이영어",
    avatar: "https://i.pravatar.cc/150?img=2",
    time: "5 hours ago",
    content: "영어 단어 외우는 꿀팁 공유합니다!\n1. 매일 30개씩 꾸준히\n2. 예문과 함께 외우기\n3. 3일 주기로 복습하기",
    likes: 89,
    comments: 23,
    liked: false,
  },
  {
    id: "3",
    author: "박과학",
    avatar: "https://i.pravatar.cc/150?img=3",
    time: "1 day ago",
    content: "물리학 공부하다가 막히는 부분이 있는데 도와주실 분 계신가요? 역학 부분이에요 ㅠㅠ",
    likes: 12,
    comments: 8,
    liked: false,
  },
];

export default function CommunityScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Study Community</Text>
        <TouchableOpacity style={styles.createButton}>
          <Text style={styles.createButtonText}>+ Post</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.tabsContainer}>
          <TouchableOpacity style={[styles.tab, styles.tabActive]}>
            <Text style={[styles.tabText, styles.tabTextActive]}>Following</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Popular</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab}>
            <Text style={styles.tabText}>Recent</Text>
          </TouchableOpacity>
        </View>

        {posts.map((post) => (
          <View key={post.id} style={styles.postCard}>
            <View style={styles.postHeader}>
              <Image source={{ uri: post.avatar }} style={styles.avatar} />
              <View style={styles.postInfo}>
                <Text style={styles.authorName}>{post.author}</Text>
                <Text style={styles.postTime}>{post.time}</Text>
              </View>
              <TouchableOpacity>
                <Bookmark size={20} color="#8E8E93" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.postContent}>{post.content}</Text>
            
            <View style={styles.postActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Heart 
                  size={20} 
                  color={post.liked ? "#FF3B30" : "#8E8E93"} 
                  fill={post.liked ? "#FF3B30" : "none"}
                />
                <Text style={[styles.actionText, post.liked && styles.actionTextActive]}>
                  {post.likes}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <MessageCircle size={20} color="#8E8E93" />
                <Text style={styles.actionText}>{post.comments}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <Share2 size={20} color="#8E8E93" />
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={styles.studyGroupsSection}>
          <Text style={styles.sectionTitle}>Study Groups</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.groupsScroll}
          >
            {[
              { name: "수능 수학", members: 234, color: "#007AFF" },
              { name: "영어 스터디", members: 189, color: "#34C759" },
              { name: "과학탐구", members: 156, color: "#FF9500" },
              { name: "국어 문학", members: 142, color: "#AF52DE" },
            ].map((group, index) => (
              <TouchableOpacity key={index} style={styles.groupCard}>
                <View style={[styles.groupIcon, { backgroundColor: group.color }]}>
                  <Text style={styles.groupInitial}>{group.name[0]}</Text>
                </View>
                <Text style={styles.groupName}>{group.name}</Text>
                <Text style={styles.groupMembers}>{group.members} members</Text>
                <TouchableOpacity style={styles.joinButton}>
                  <Text style={styles.joinButtonText}>Join</Text>
                </TouchableOpacity>
              </TouchableOpacity>
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
  createButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#007AFF",
    borderRadius: 20,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  tab: {
    marginRight: 24,
    paddingBottom: 4,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#007AFF",
  },
  tabText: {
    fontSize: 16,
    color: "#8E8E93",
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#007AFF",
  },
  postCard: {
    backgroundColor: "#FFFFFF",
    marginTop: 12,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 2,
  },
  postTime: {
    fontSize: 12,
    color: "#8E8E93",
  },
  postContent: {
    fontSize: 15,
    color: "#000000",
    lineHeight: 22,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 24,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    color: "#8E8E93",
  },
  actionTextActive: {
    color: "#FF3B30",
  },
  studyGroupsSection: {
    marginTop: 24,
    paddingLeft: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 16,
  },
  groupsScroll: {
    paddingRight: 20,
  },
  groupCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: 140,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  groupIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  groupInitial: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  groupName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  groupMembers: {
    fontSize: 12,
    color: "#8E8E93",
    marginBottom: 12,
  },
  joinButton: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    backgroundColor: "#007AFF",
    borderRadius: 14,
  },
  joinButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});