import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Search, Heart, MessageCircle, Eye, ChevronLeft, MoreHorizontal, Send, Camera, Image as ImageIcon, X, ChevronDown } from "lucide-react-native";
import { useLanguage } from "@/hooks/language-context";

const { width } = Dimensions.get('window');

interface Post {
  id: string;
  author: string;
  avatar: string;
  grade: string;
  level: string;
  time: string;
  title?: string;
  content: string;
  category?: string;
  image?: string;
  likes: number;
  comments: number;
  views: number;
  liked: boolean;
  commentsList?: Comment[];
  type: 'study' | 'discussion' | 'question';
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

const initialPosts: Post[] = [
  {
    id: "1",
    author: "아구몬",
    avatar: "https://i.pravatar.cc/150?img=1",
    grade: "문과",
    level: "5등급",
    time: "14시간 전",
    content: "오운완 ♥",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    likes: 15,
    comments: 148,
    views: 18,
    liked: false,
    commentsList: [],
    type: 'study',
  },
  {
    id: "2",
    author: "열혈",
    avatar: "https://i.pravatar.cc/150?img=2",
    grade: "이과",
    level: "1등급",
    time: "24시간 전",
    content: "",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop",
    likes: 148,
    comments: 148,
    views: 18,
    liked: false,
    commentsList: [],
    type: 'study',
  },
  {
    id: "3",
    author: "아구몬",
    avatar: "https://i.pravatar.cc/150?img=1",
    grade: "문과",
    level: "5등급",
    time: "14시간 전",
    title: "학원다니 실력이 늘까?",
    content: "학원이 너무 많아서 가지 않으면 어떨까 걱정이 되네요?",
    likes: 20,
    comments: 105,
    views: 26,
    liked: false,
    commentsList: [],
    type: 'discussion',
  },
  {
    id: "4",
    author: "베이",
    avatar: "https://i.pravatar.cc/150?img=3",
    grade: "문과",
    level: "4등급",
    time: "24시간 전",
    title: "수능 영어 안녕하다.",
    content: "모든 힘내자!",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop",
    likes: 15,
    comments: 148,
    views: 18,
    liked: false,
    commentsList: [],
    type: 'discussion',
  },
  {
    id: "5",
    author: "아구몬",
    avatar: "https://i.pravatar.cc/150?img=1",
    grade: "문과",
    level: "5등급",
    time: "14시간 전",
    title: "2024년 9월 모평수학 5번 문제 모르겠어요ㅠㅠㅠ",
    content: "계산 4",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop",
    likes: 20,
    comments: 105,
    views: 26,
    liked: false,
    commentsList: [],
    type: 'question',
  },
  {
    id: "6",
    author: "베이",
    avatar: "https://i.pravatar.cc/150?img=3",
    grade: "문과",
    level: "4등급",
    time: "24시간 전",
    title: "2022년 3월 모평 사회문화 16번 도와주세요!!!",
    content: "계산 도와줘",
    image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop",
    likes: 15,
    comments: 148,
    views: 18,
    liked: false,
    commentsList: [],
    type: 'question',
  },
  {
    id: "7",
    author: "민준",
    avatar: "https://i.pravatar.cc/150?img=4",
    grade: "문과",
    level: "2등급",
    time: "24시간 전",
    title: "이번 중간 끝나면 먹고 싶은거 잔뜩...",
    content: "나는 마라탕이 좋고 고기가 좋고 고기가 좋고 음식이 좋고...",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
    likes: 220,
    comments: 225,
    views: 112,
    liked: false,
    commentsList: [],
    type: 'discussion',
  },
  {
    id: "8",
    author: "민준",
    avatar: "https://i.pravatar.cc/150?img=4",
    grade: "문과",
    level: "2등급",
    time: "24시간 전",
    title: "예드라. 수학 28번 계산하지 않았나?",
    content: "수학 성적을 좋아 하자",
    image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&h=300&fit=crop",
    likes: 220,
    comments: 225,
    views: 112,
    liked: false,
    commentsList: [],
    type: 'question',
  },
];



export default function CommunityScreen() {
  const { language } = useLanguage();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState(0);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showPostDetail, setShowPostDetail] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [newComment, setNewComment] = useState("");

  const tabs = [
    language === 'ko' ? '오늘의 공부 인증' : "Today's Study Verification",
    language === 'ko' ? '내 등급 모임' : 'My Grade Group',
    language === 'ko' ? '문제질문하기' : 'Ask Questions'
  ];

  const discussionFilters = [
    language === 'ko' ? '추천순' : 'Recommended',
    language === 'ko' ? '인기' : 'Popular',
    language === 'ko' ? '고민' : 'Concerns'
  ];

  const questionFilters = [
    language === 'ko' ? '추천순' : 'Recommended'
  ];

  const [selectedDiscussionFilter, setSelectedDiscussionFilter] = useState(0);
  const [selectedQuestionFilter, setSelectedQuestionFilter] = useState(0);

  const handleLikePost = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    );
  };

  const getFilteredPosts = () => {
    let filtered = posts;
    
    if (activeTab === 0) {
      // Study verification posts
      filtered = posts.filter(post => post.type === 'study');
    } else if (activeTab === 1) {
      // Grade group discussions
      filtered = posts.filter(post => post.type === 'discussion');
      
      // Apply discussion filters
      if (selectedDiscussionFilter === 0) {
        // Recommended - sort by likes
        filtered = filtered.sort((a, b) => b.likes - a.likes);
      } else if (selectedDiscussionFilter === 1) {
        // Popular - sort by views
        filtered = filtered.sort((a, b) => b.views - a.views);
      } else if (selectedDiscussionFilter === 2) {
        // Concerns - filter posts with question marks
        filtered = filtered.filter(post => post.content.includes('?') || (post.title && post.title.includes('?')));
      }
    } else if (activeTab === 2) {
      // Question posts
      filtered = posts.filter(post => post.type === 'question');
      
      // Apply question filters
      if (selectedQuestionFilter === 0) {
        // Recommended - sort by likes
        filtered = filtered.sort((a, b) => b.likes - a.likes);
      }
    }
    
    return filtered;
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedPost) return;
    
    const comment: Comment = {
      id: `c${Date.now()}`,
      author: language === 'ko' ? '나' : 'Me',
      avatar: 'https://i.pravatar.cc/150?img=10',
      time: language === 'ko' ? '방금' : 'Just now',
      content: newComment,
      likes: 0,
      liked: false,
    };
    
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === selectedPost.id 
          ? { 
              ...post, 
              comments: post.comments + 1,
              commentsList: [...(post.commentsList || []), comment]
            }
          : post
      )
    );
    
    setSelectedPost(prev => prev ? {
      ...prev,
      comments: prev.comments + 1,
      commentsList: [...(prev.commentsList || []), comment]
    } : null);
    
    setNewComment('');
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim()) {
      Alert.alert(
        language === 'ko' ? '알림' : 'Notice',
        language === 'ko' ? '내용을 입력해주세요' : 'Please enter content'
      );
      return;
    }
    
    const newPost: Post = {
      id: `p${Date.now()}`,
      author: language === 'ko' ? '나' : 'Me',
      avatar: 'https://i.pravatar.cc/150?img=10',
      grade: language === 'ko' ? '문과' : 'Liberal Arts',
      level: language === 'ko' ? '5등급' : 'Grade 5',
      time: language === 'ko' ? '방금' : 'Just now',
      content: newPostContent,
      likes: 0,
      comments: 0,
      views: 0,
      liked: false,
      commentsList: [],
      type: 'study',
    };
    
    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setShowCreatePost(false);
  };



  const handlePostPress = (post: Post) => {
    const fullPost = posts.find(p => p.id === post.id) || post;
    setSelectedPost(fullPost);
    setShowPostDetail(true);
  };

  const renderPost = (post: Post) => {
    if (activeTab === 0) {
      // Study verification post layout
      return (
        <TouchableOpacity 
          key={post.id} 
          style={styles.studyPostCard}
          onPress={() => handlePostPress(post)}
        >
          <View style={styles.postHeader}>
            <Image source={{ uri: post.avatar }} style={styles.avatar} />
            <View style={styles.postInfo}>
              <Text style={styles.authorName}>{post.author} | {post.grade} | {post.level}</Text>
              <Text style={styles.postTime}>{post.time}</Text>
            </View>
          </View>
          
          {post.image && (
            <View style={styles.studyImageContainer}>
              <Image source={{ uri: post.image }} style={styles.studyImage} />
            </View>
          )}
          
          {post.content && (
            <Text style={styles.studyContent}>{post.content}</Text>
          )}
          
          <View style={styles.studyActions}>
            <TouchableOpacity 
              style={styles.studyActionButton}
              onPress={() => handleLikePost(post.id)}
            >
              <Heart 
                size={16} 
                color={post.liked ? "#FF3B30" : "#8E8E93"} 
                fill={post.liked ? "#FF3B30" : "none"}
              />
              <Text style={[styles.studyActionText, post.liked && styles.actionTextActive]}>
                {post.likes}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.studyActionButton}
              onPress={() => handlePostPress(post)}
            >
              <MessageCircle size={16} color="#8E8E93" />
              <Text style={styles.studyActionText}>{post.comments}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.studyActionButton}>
              <Eye size={16} color="#8E8E93" />
              <Text style={styles.studyActionText}>{post.views}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      );
    } else {
      // Discussion/Question post layout
      return (
        <TouchableOpacity 
          key={post.id} 
          style={styles.discussionPostCard}
          onPress={() => handlePostPress(post)}
        >
          <View style={styles.discussionHeader}>
            <View style={styles.discussionInfo}>
              {post.title && (
                <Text style={styles.discussionTitle} numberOfLines={2}>
                  {post.title}
                </Text>
              )}
              {post.content && (
                <Text style={styles.discussionContent} numberOfLines={2}>
                  {post.content}
                </Text>
              )}
            </View>
            {post.image && (
              <View style={styles.discussionImageContainer}>
                <Image source={{ uri: post.image }} style={styles.discussionImage} />
              </View>
            )}
          </View>
          
          <View style={styles.discussionFooter}>
            <View style={styles.discussionAuthor}>
              <Image source={{ uri: post.avatar }} style={styles.smallAvatar} />
              <Text style={styles.discussionAuthorName}>{post.author} | {post.grade} | {post.level}</Text>
              <Text style={styles.discussionTime}>{post.time}</Text>
            </View>
            
            <View style={styles.discussionActions}>
              <View style={styles.discussionActionItem}>
                <Heart size={14} color="#8E8E93" />
                <Text style={styles.discussionActionText}>{post.likes}</Text>
              </View>
              <View style={styles.discussionActionItem}>
                <MessageCircle size={14} color="#8E8E93" />
                <Text style={styles.discussionActionText}>{post.comments}</Text>
              </View>
              <View style={styles.discussionActionItem}>
                <Eye size={14} color="#8E8E93" />
                <Text style={styles.discussionActionText}>{post.views}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>{language === 'ko' ? '커뮤니티' : 'Community'}</Text>
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

      {/* Filter buttons for discussion and question tabs */}
      {activeTab === 1 && (
        <View style={styles.filtersContainer}>
          {discussionFilters.map((filter, index) => (
            <TouchableOpacity 
              key={index}
              style={[
                styles.filterButton, 
                selectedDiscussionFilter === index && styles.filterButtonActive
              ]}
              onPress={() => setSelectedDiscussionFilter(index)}
            >
              <Text style={[
                styles.filterText, 
                selectedDiscussionFilter === index && styles.filterTextActive
              ]}>
                {filter}
              </Text>
              <ChevronDown size={12} color={selectedDiscussionFilter === index ? "#FFFFFF" : "#8E8E93"} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {activeTab === 2 && (
        <View style={styles.filtersContainer}>
          {questionFilters.map((filter, index) => (
            <TouchableOpacity 
              key={index}
              style={[
                styles.filterButton, 
                selectedQuestionFilter === index && styles.filterButtonActive
              ]}
              onPress={() => setSelectedQuestionFilter(index)}
            >
              <Text style={[
                styles.filterText, 
                selectedQuestionFilter === index && styles.filterTextActive
              ]}>
                {filter}
              </Text>
              <ChevronDown size={12} color={selectedQuestionFilter === index ? "#FFFFFF" : "#8E8E93"} />
            </TouchableOpacity>
          ))}
        </View>
      )}

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {getFilteredPosts().map(renderPost)}
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
            <KeyboardAvoidingView 
              style={styles.modalContent}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
              <ScrollView style={styles.modalScrollContent} contentContainerStyle={{ paddingHorizontal: 20 }}>
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
                <Text style={styles.actionLabel}>조회 {selectedPost.views}</Text>
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
            
            {/* Comment Input */}
            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder={language === 'ko' ? '댓글을 입력하세요...' : 'Write a comment...'}
                placeholderTextColor="#8E8E93"
                value={newComment}
                onChangeText={setNewComment}
                multiline
              />
              <TouchableOpacity 
                style={styles.sendButton}
                onPress={handleAddComment}
              >
                <Send size={20} color="#007AFF" />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
          )}
        </View>
      </Modal>

      {/* Create Post Modal */}
      <Modal
        visible={showCreatePost}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={[styles.modalContainer, { paddingTop: insets.top }]}>
          <View style={styles.createPostHeader}>
            <TouchableOpacity onPress={() => setShowCreatePost(false)}>
              <X size={24} color="#000000" />
            </TouchableOpacity>
            <Text style={styles.createPostTitle}>
              {language === 'ko' ? '새 게시물' : 'New Post'}
            </Text>
            <TouchableOpacity onPress={handleCreatePost}>
              <Text style={styles.postButton}>
                {language === 'ko' ? '게시' : 'Post'}
              </Text>
            </TouchableOpacity>
          </View>
          
          <KeyboardAvoidingView 
            style={styles.createPostContent}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <View style={styles.createPostAuthor}>
              <Image 
                source={{ uri: 'https://i.pravatar.cc/150?img=10' }} 
                style={styles.avatar} 
              />
              <View>
                <Text style={styles.authorName}>
                  {language === 'ko' ? '나' : 'Me'} | {language === 'ko' ? '문과' : 'Liberal Arts'} | {language === 'ko' ? '5등급' : 'Grade 5'}
                </Text>
              </View>
            </View>
            
            <TextInput
              style={styles.postTextInput}
              placeholder={language === 'ko' ? '오늘의 공부를 공유해주세요...' : 'Share your study today...'}
              placeholderTextColor="#8E8E93"
              value={newPostContent}
              onChangeText={setNewPostContent}
              multiline
              autoFocus
            />
            
            <View style={styles.createPostActions}>
              <TouchableOpacity style={styles.mediaButton}>
                <Camera size={24} color="#007AFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.mediaButton}>
                <ImageIcon size={24} color="#007AFF" />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => setShowCreatePost(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
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
    marginTop: 0,
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
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
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
  studyPostCard: {
    backgroundColor: "#FFFFFF",
    marginBottom: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  discussionPostCard: {
    backgroundColor: "#FFFFFF",
    marginBottom: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
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
  studyContent: {
    fontSize: 16,
    color: "#000000",
    lineHeight: 22,
    marginBottom: 12,
    fontWeight: "500",
  },
  discussionTitle: {
    fontSize: 16,
    color: "#000000",
    lineHeight: 22,
    fontWeight: "600",
    marginBottom: 4,
  },
  discussionContent: {
    fontSize: 14,
    color: "#8E8E93",
    lineHeight: 20,
  },
  postContentWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  studyImageContainer: {
    marginVertical: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  studyImage: {
    width: width - 64,
    height: width - 64,
    backgroundColor: "#F0F0F0",
  },
  discussionImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    marginLeft: 12,
  },
  discussionImage: {
    width: 80,
    height: 80,
    backgroundColor: "#F0F0F0",
  },
  postContentContainer: {
    marginBottom: 12,
  },
  dropdownIcon: {
    marginLeft: 8,
  },
  studyActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  studyActionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
  },
  studyActionText: {
    fontSize: 12,
    color: "#8E8E93",
  },
  actionTextActive: {
    color: "#FF3B30",
  },
  discussionHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  discussionInfo: {
    flex: 1,
  },
  discussionFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  discussionAuthor: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  smallAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  discussionAuthorName: {
    fontSize: 12,
    color: "#000000",
    fontWeight: "500",
    marginRight: 8,
  },
  discussionTime: {
    fontSize: 12,
    color: "#8E8E93",
  },
  discussionActions: {
    flexDirection: "row",
    gap: 16,
  },
  discussionActionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  discussionActionText: {
    fontSize: 12,
    color: "#8E8E93",
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
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 90,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 28,
    color: '#FFFFFF',
    fontWeight: '400',
  },
  modalScrollContent: {
    flex: 1,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
  },
  commentInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F2F2F7',
    borderRadius: 20,
    fontSize: 14,
    color: '#000000',
    marginRight: 8,
  },
  sendButton: {
    padding: 8,
  },
  createPostHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  createPostTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  postButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  createPostContent: {
    flex: 1,
  },
  createPostAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  postTextInput: {
    flex: 1,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#000000',
    textAlignVertical: 'top',
  },
  createPostActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    gap: 20,
  },
  mediaButton: {
    padding: 8,
  },
});