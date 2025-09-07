import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Search, Heart, MessageCircle, Repeat2, ChevronLeft, MoreHorizontal } from "lucide-react-native";
import { useLanguage } from "@/hooks/language-context";

const { width } = Dimensions.get('window');

interface Post {
  id: string;
  author: string;
  avatar: string;
  grade: string;
  time: string;
  title?: string;
  content: string;
  category?: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  liked: boolean;
  commentsList?: Comment[];
}

interface Comment {
  id: string;
  author: string;
  avatar: string;
  time: string;
  content: string;
  likes: number;
  liked: boolean;
}

const studyVerificationPosts: Post[] = [
  {
    id: "1",
    author: "아구몬",
    avatar: "https://i.pravatar.cc/150?img=1",
    grade: "문과 | 5등급",
    time: "14시간 전",
    content: "오운완 ♥",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    likes: 15,
    comments: 148,
    shares: 18,
    liked: false,
    commentsList: [
      {
        id: "c1",
        author: "아구몬",
        avatar: "https://i.pravatar.cc/150?img=1",
        time: "1일전",
        content: "나 지신 기특해 ㅎ",
        likes: 2,
        liked: false,
      },
      {
        id: "c2",
        author: "메미",
        avatar: "https://i.pravatar.cc/150?img=4",
        time: "1일전",
        content: "오 나도 지금 시작!",
        likes: 0,
        liked: false,
      },
    ],
  },
  {
    id: "2",
    author: "열혈",
    avatar: "https://i.pravatar.cc/150?img=2",
    grade: "이과 | 1등급",
    time: "24시간 전",
    content: "",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop",
    likes: 148,
    comments: 148,
    shares: 18,
    liked: false,
  },
];

const gradeGroupPosts: Post[] = [
  {
    id: "4",
    author: "아구몬",
    avatar: "https://i.pravatar.cc/150?img=1",
    grade: "문과 | 5등급",
    time: "14시간 전",
    content: "오운완 ♥",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    likes: 15,
    comments: 148,
    shares: 18,
    liked: false,
  },
  {
    id: "5",
    author: "열혈",
    avatar: "https://i.pravatar.cc/150?img=2",
    grade: "이과 | 1등급",
    time: "24시간 전",
    content: "",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop",
    likes: 148,
    comments: 148,
    shares: 18,
    liked: false,
  },
];

const questionHelpPosts: Post[] = [
  {
    id: "7",
    author: "아구몬",
    avatar: "https://i.pravatar.cc/150?img=1",
    grade: "문과 | 5등급",
    time: "14시간 전",
    content: "오운완 ♥",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    likes: 15,
    comments: 148,
    shares: 18,
    liked: false,
  },
  {
    id: "8",
    author: "열혈",
    avatar: "https://i.pravatar.cc/150?img=2",
    grade: "이과 | 1등급",
    time: "24시간 전",
    content: "",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop",
    likes: 148,
    comments: 148,
    shares: 18,
    liked: false,
  },
];

export default function CommunityScreen() {
  const { t, translateText, language } = useLanguage();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState(0);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(studyVerificationPosts);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showPostDetail, setShowPostDetail] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationCache, setTranslationCache] = useState<Record<string, Post[]>>({});

  const tabs = [
    '오늘의 공부 인증',
    '내 등급 모임',
    '문제질문하기'
  ];

  const getCurrentPosts = useCallback(() => {
    switch (activeTab) {
      case 0:
        return studyVerificationPosts;
      case 1:
        return gradeGroupPosts;
      case 2:
        return questionHelpPosts;
      default:
        return studyVerificationPosts;
    }
  }, [activeTab]);

  const translatePosts = useCallback(async () => {
    const currentPosts = getCurrentPosts();
    const cacheKey = `${activeTab}-${language}`;
    
    if (language === 'ko') {
      setFilteredPosts(currentPosts);
      return;
    }

    // Check if we have cached translations for this tab and language
    if (translationCache[cacheKey]) {
      setFilteredPosts(translationCache[cacheKey]);
      return;
    }

    setIsTranslating(true);
    try {
      const translatedPosts = await Promise.all(
        currentPosts.map(async (post) => {
          const [translatedTitle, translatedContent, translatedAuthor, translatedGrade, translatedCategory] = await Promise.all([
            translateText(post.title || '', 'en'),
            translateText(post.content, 'en'),
            translateText(post.author, 'en'),
            translateText(post.grade, 'en'),
            post.category ? translateText(post.category, 'en') : Promise.resolve('')
          ]);
          
          return {
            ...post,
            title: translatedTitle,
            content: translatedContent,
            author: translatedAuthor,
            grade: translatedGrade,
            category: translatedCategory,
          };
        })
      );
      
      // Cache the translated posts
      setTranslationCache(prev => ({
        ...prev,
        [cacheKey]: translatedPosts
      }));
      
      setFilteredPosts(translatedPosts);
    } catch (error) {
      console.error('Translation failed:', error);
      setFilteredPosts(currentPosts);
    } finally {
      setIsTranslating(false);
    }
  }, [language, translateText, activeTab, getCurrentPosts, translationCache]);

  useEffect(() => {
    translatePosts();
  }, [translatePosts]);

  const handlePostPress = (post: Post) => {
    setSelectedPost(post);
    setShowPostDetail(true);
  };



  const renderPost = (post: Post) => (
    <TouchableOpacity 
      key={post.id} 
      style={styles.postCard}
      onPress={() => handlePostPress(post)}
    >
      <View style={styles.postHeader}>
        <Image source={{ uri: post.avatar }} style={styles.avatar} />
        <View style={styles.postInfo}>
          <Text style={styles.authorName}>{post.author} | {post.grade}</Text>
          <Text style={styles.postTime}>{post.time}</Text>
        </View>
      </View>
      
      {post.image && (
        <Image source={{ uri: post.image }} style={styles.postImage} />
      )}
      
      {post.content ? (
        <View style={styles.postContentWrapper}>
          <Text style={styles.postContent}>{post.content}</Text>
          <MoreHorizontal size={16} color="#000000" />
        </View>
      ) : null}
      
      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Heart 
            size={18} 
            color={post.liked ? "#FF3B30" : "#8E8E93"} 
            fill={post.liked ? "#FF3B30" : "none"}
          />
          <Text style={[styles.actionText, post.liked && styles.actionTextActive]}>
            {post.likes}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <MessageCircle size={18} color="#8E8E93" />
          <Text style={styles.actionText}>{post.comments}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Repeat2 size={18} color="#8E8E93" />
          <Text style={styles.actionText}>{post.shares}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>커뮤니티</Text>
        <TouchableOpacity>
          <Search size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        {tabs.map((tab, index) => (
          <TouchableOpacity 
            key={index}
            style={[styles.tab, activeTab === index && styles.tabActive]}
            onPress={() => setActiveTab(index)}
          >
            <Text style={[styles.tabText, activeTab === index && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isTranslating ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>{t('loading')}</Text>
          </View>
        ) : (
          <>
            {filteredPosts.map(renderPost)}
          </>
        )}
      </ScrollView>

      <Modal
        visible={showPostDetail}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={() => setShowPostDetail(false)}
              style={styles.backButton}
            >
              <ChevronLeft size={24} color="#000000" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              커뮤니티(공부인증)
            </Text>
          </View>
          
          {selectedPost && (
            <ScrollView style={styles.modalContent}>
              <View style={styles.postDetailHeader}>
                <Image source={{ uri: selectedPost.avatar }} style={styles.avatar} />
                <View style={styles.postInfo}>
                  <Text style={styles.authorName}>{selectedPost.author} | {selectedPost.grade}</Text>
                  <Text style={styles.postTime}>{selectedPost.time}</Text>
                </View>
              </View>
              
              <View style={styles.postDetailContentContainer}>
                <Text style={styles.postDetailContent}>{selectedPost.content}</Text>
                <MoreHorizontal size={16} color="#000000" style={styles.dropdownIcon} />
              </View>
              
              {selectedPost.image && (
                <Image source={{ uri: selectedPost.image }} style={styles.postDetailImage} />
              )}
              
              <View style={styles.postDetailActions}>
                <Text style={styles.actionLabel}>조회 {selectedPost.shares}</Text>
                <TouchableOpacity style={styles.likeButton}>
                  <Heart size={16} color="#8E8E93" />
                  <Text style={styles.likeButtonText}>{selectedPost.likes}</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.commentsSection}>
                <Text style={styles.commentsTitle}>댓글 {selectedPost.comments}</Text>
                
                {selectedPost.commentsList?.map((comment) => (
                  <View key={comment.id} style={styles.commentItem}>
                    <Image source={{ uri: comment.avatar }} style={styles.commentAvatar} />
                    <View style={styles.commentContent}>
                      <View style={styles.commentHeader}>
                        <Text style={styles.commentAuthor}>{comment.author} | 문과 | 5등급</Text>
                        <Text style={styles.commentTime}>{comment.time}</Text>
                      </View>
                      <Text style={styles.commentText}>{comment.content}</Text>
                      <View style={styles.commentActions}>
                        <TouchableOpacity style={styles.commentAction}>
                          <Heart size={14} color="#8E8E93" />
                          <Text style={styles.commentActionText}>좋아요 {comment.likes}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.commentAction}>
                          <MessageCircle size={14} color="#8E8E93" />
                          <Text style={styles.commentActionText}>답글쓰기</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
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
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
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
    paddingBottom: 8,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: "#000000",
  },
  tabText: {
    fontSize: 14,
    color: "#8E8E93",
    fontWeight: "400",
  },
  tabTextActive: {
    color: "#000000",
    fontWeight: "500",
  },
  filtersContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    gap: 8,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#F0F0F0",
    borderRadius: 16,
    gap: 4,
  },
  filterButtonActive: {
    backgroundColor: "#8E8E93",
  },
  filterText: {
    fontSize: 12,
    color: "#8E8E93",
    fontWeight: "400",
  },
  filterTextActive: {
    color: "#FFFFFF",
  },
  postCard: {
    backgroundColor: "#FFFFFF",
    marginBottom: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
    lineHeight: 22,
  },
  postCategory: {
    fontSize: 12,
    color: "#8E8E93",
    marginBottom: 12,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  postInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 13,
    fontWeight: "500",
    color: "#000000",
  },
  postTime: {
    fontSize: 11,
    color: "#8E8E93",
    marginTop: 2,
  },
  postContent: {
    fontSize: 14,
    color: "#000000",
    lineHeight: 20,
    flex: 1,
  },
  postContentWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  postImage: {
    width: width - 40,
    height: width - 40,
    borderRadius: 12,
    backgroundColor: "#8E8E93",
    marginVertical: 12,
  },
  postContentContainer: {
    marginBottom: 12,
  },
  dropdownIcon: {
    marginLeft: 8,
  },
  postActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    marginTop: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 12,
    color: "#8E8E93",
  },
  actionTextActive: {
    color: "#FF3B30",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  backButton: {
    marginRight: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  postDetailHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  postDetailTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
  },
  postDetailContent: {
    fontSize: 16,
    color: "#000000",
    fontWeight: "600",
    lineHeight: 20,
  },
  postDetailContentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  postDetailImage: {
    width: width - 40,
    height: 250,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#F0F0F0",
  },
  postDetailActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  actionLabel: {
    fontSize: 12,
    color: "#8E8E93",
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#F0F0F0",
    borderRadius: 16,
    gap: 4,
  },
  likeButtonText: {
    fontSize: 12,
    color: "#8E8E93",
  },
  commentsSection: {
    paddingVertical: 16,
  },
  commentsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 16,
  },
  commentItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  commentAuthor: {
    fontSize: 12,
    fontWeight: "500",
    color: "#000000",
  },
  commentTime: {
    fontSize: 10,
    color: "#8E8E93",
  },
  commentText: {
    fontSize: 14,
    color: "#000000",
    lineHeight: 18,
    marginBottom: 8,
  },
  commentActions: {
    flexDirection: "row",
    gap: 16,
  },
  commentAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  commentActionText: {
    fontSize: 10,
    color: "#8E8E93",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#8E8E93',
  },
});