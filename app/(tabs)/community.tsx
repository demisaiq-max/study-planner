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
import { Search, Heart, MessageCircle, Share2, ArrowLeft, ChevronDown } from "lucide-react-native";
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

const koreanPosts: Post[] = [
  {
    id: "1",
    author: "민준",
    avatar: "https://i.pravatar.cc/150?img=3",
    grade: "문과 | 2등급",
    time: "24시간 전",
    title: "이번 중간 끝나면 먹고 싶은건 많해...",
    content: "나는 마라탕! 부추 양꼬치 볶음 고기(주기) 5일 볶아주구",
    image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop",
    likes: 220,
    comments: 225,
    shares: 112,
    liked: false,
  },
  {
    id: "2",
    author: "민준",
    avatar: "https://i.pravatar.cc/150?img=3",
    grade: "문과 | 2등급",
    time: "24시간 전",
    title: "애드라, 수학 28번 개어려지 않았나?",
    content: "수학 잘하는 놈이 직접",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop",
    likes: 220,
    comments: 225,
    shares: 112,
    liked: false,
  },
  {
    id: "3",
    author: "아구몬",
    avatar: "https://i.pravatar.cc/150?img=1",
    grade: "문과 | 5등급",
    time: "14시간 전",
    title: "학원다니기 싫다ㅠㅠㅠㅠ",
    content: "학원이 너무 멀어서 가기 실은데 어떻게 엄마를 설득할 수 있을까?",
    likes: 20,
    comments: 105,
    shares: 26,
    liked: false,
  },
];

export default function CommunityScreen() {
  const { t, translateText, language } = useLanguage();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState('추천순');
  const [posts, setPosts] = useState<Post[]>(koreanPosts);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>(koreanPosts);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showPostDetail, setShowPostDetail] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  const tabs = [
    t('studyVerification') || '오늘의 공부 인증',
    t('gradeGroups') || '내 등급 모임',
    t('questionHelp') || '문제질문하기'
  ];

  const filters = ['추천순', '인기', '공민'];

  const translatePosts = useCallback(async () => {
    if (language === 'ko') {
      setPosts(koreanPosts);
      setFilteredPosts(koreanPosts);
      return;
    }

    setIsTranslating(true);
    try {
      const translatedPosts = await Promise.all(
        koreanPosts.map(async (post) => {
          const [translatedTitle, translatedContent, translatedAuthor, translatedGrade] = await Promise.all([
            translateText(post.title || '', 'en'),
            translateText(post.content, 'en'),
            translateText(post.author, 'en'),
            translateText(post.grade, 'en')
          ]);
          
          return {
            ...post,
            title: translatedTitle,
            content: translatedContent,
            author: translatedAuthor,
            grade: translatedGrade,
          };
        })
      );
      
      setPosts(translatedPosts);
      setFilteredPosts(translatedPosts);
    } catch (error) {
      console.error('Translation failed:', error);
      setPosts(koreanPosts);
      setFilteredPosts(koreanPosts);
    } finally {
      setIsTranslating(false);
    }
  }, [language, translateText]);

  useEffect(() => {
    translatePosts();
  }, [translatePosts]);

  const handlePostPress = (post: Post) => {
    setSelectedPost(post);
    setShowPostDetail(true);
  };

  const handleFilterChange = useCallback((filter: string) => {
    setSelectedFilter(filter);
    
    let filtered = [...posts];
    
    switch (filter) {
      case '추천순':
        // Sort by likes (most liked first)
        filtered = filtered.sort((a, b) => b.likes - a.likes);
        break;
      case '인기':
        // Sort by comments (most commented first)
        filtered = filtered.sort((a, b) => b.comments - a.comments);
        break;
      case '공민':
        // Sort by shares (most shared first)
        filtered = filtered.sort((a, b) => b.shares - a.shares);
        break;
      default:
        break;
    }
    
    setFilteredPosts(filtered);
  }, [posts]);

  React.useEffect(() => {
    handleFilterChange(selectedFilter);
  }, [selectedFilter, handleFilterChange]);

  const renderPost = (post: Post) => (
    <TouchableOpacity 
      key={post.id} 
      style={styles.postCard}
      onPress={() => handlePostPress(post)}
    >
      {post.title && (
        <Text style={styles.postTitle}>{post.title}</Text>
      )}
      
      <Text style={styles.postContent}>{post.content}</Text>
      
      <View style={styles.postHeader}>
        <Image source={{ uri: post.avatar }} style={styles.avatar} />
        <View style={styles.postInfo}>
          <Text style={styles.authorName}>{post.author} | {post.grade}</Text>
        </View>
        {post.image && (
          <Image source={{ uri: post.image }} style={styles.postImageSmall} />
        )}
      </View>
      
      <Text style={styles.postTime}>{post.time}</Text>
      
      <View style={styles.postActions}>
        <View style={styles.actionButton}>
          <Heart 
            size={16} 
            color={post.liked ? "#FF3B30" : "#8E8E93"} 
            fill={post.liked ? "#FF3B30" : "none"}
          />
          <Text style={[styles.actionText, post.liked && styles.actionTextActive]}>
            {post.likes}
          </Text>
        </View>
        
        <View style={styles.actionButton}>
          <MessageCircle size={16} color="#8E8E93" />
          <Text style={styles.actionText}>{post.comments}</Text>
        </View>
        
        <View style={styles.actionButton}>
          <Share2 size={16} color="#8E8E93" />
          <Text style={styles.actionText}>{post.shares}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('community') || '커뮤니티'}</Text>
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

      {activeTab === 0 && (
        <View style={styles.filtersContainer}>
          {filters.map((filter) => (
            <TouchableOpacity 
              key={filter}
              style={[
                styles.filterButton, 
                selectedFilter === filter && styles.filterButtonActive
              ]}
              onPress={() => handleFilterChange(filter)}
            >
              <Text style={[
                styles.filterText,
                selectedFilter === filter && styles.filterTextActive
              ]}>
                {filter}
              </Text>
              {filter === '추천순' && (
                <ChevronDown size={16} color={selectedFilter === filter ? "#FFFFFF" : "#8E8E93"} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

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
          filteredPosts.map(renderPost)
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
              <ArrowLeft size={24} color="#000000" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {t('community') || '커뮤니티'}({t('publicPost') || '공부인증'})
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
              
              {selectedPost.title && (
                <Text style={styles.postDetailTitle}>{selectedPost.title}</Text>
              )}
              
              <Text style={styles.postDetailContent}>{selectedPost.content}</Text>
              
              {selectedPost.image && (
                <Image source={{ uri: selectedPost.image }} style={styles.postDetailImage} />
              )}
              
              <View style={styles.postDetailActions}>
                <Text style={styles.actionLabel}>조회 {selectedPost.likes}</Text>
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
    backgroundColor: "#F8F8F8",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
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
    marginTop: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  postTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
  },
  postCategory: {
    fontSize: 12,
    color: "#8E8E93",
    marginBottom: 8,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    marginTop: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  postInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 12,
    fontWeight: "500",
    color: "#000000",
    marginBottom: 2,
  },
  postTime: {
    fontSize: 12,
    color: "#8E8E93",
    marginBottom: 8,
  },
  postContent: {
    fontSize: 14,
    color: "#8E8E93",
    lineHeight: 20,
    marginBottom: 8,
  },
  postImageSmall: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#F0F0F0",
    marginLeft: "auto",
  },
  postActions: {
    flexDirection: "row",
    gap: 16,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
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
    fontSize: 14,
    color: "#000000",
    lineHeight: 20,
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