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
import { ChevronLeft, Heart, MessageCircle, Share2, MoreHorizontal, Send, Camera, Image as ImageIcon, X, Plus } from "lucide-react-native";
import { useLanguage } from "@/hooks/language-context";
import { useRouter } from "expo-router";
import { Stack } from "expo-router";

const { width } = Dimensions.get('window');

interface Post {
  id: string;
  author: string;
  avatar: string;
  grade: string;
  time: string;
  content: string;
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

const studyPosts: Post[] = [
  {
    id: "1",
    author: "아구몬",
    avatar: "https://i.pravatar.cc/150?img=1",
    grade: "문과",
    time: "14시간 전",
    content: "오운완 ♥",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    likes: 15,
    comments: 148,
    shares: 18,
    liked: false,
    commentsList: [],
  },
  {
    id: "2",
    author: "열혈",
    avatar: "https://i.pravatar.cc/150?img=2",
    grade: "이과",
    time: "24시간 전",
    content: "오늘도 열심히 공부했습니다! 수학 문제집 한 챕터 완료 💪",
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop",
    likes: 148,
    comments: 23,
    shares: 18,
    liked: false,
    commentsList: [],
  },
];

export default function CommunityStudyScreen() {
  const { language } = useLanguage();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>(studyPosts);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showPostDetail, setShowPostDetail] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [newComment, setNewComment] = useState("");

  const handleLikePost = (postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
          : post
      )
    );
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
      time: language === 'ko' ? '방금' : 'Just now',
      content: newPostContent,
      likes: 0,
      comments: 0,
      shares: 0,
      liked: false,
      commentsList: [],
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

  const renderPost = (post: Post) => (
    <TouchableOpacity 
      key={post.id} 
      style={styles.postCard}
      onPress={() => handlePostPress(post)}
    >
      <View style={styles.postHeader}>
        <Image source={{ uri: post.avatar }} style={styles.avatar} />
        <View style={styles.postInfo}>
          <Text style={styles.authorName}>{post.author} | {post.grade} | {language === 'ko' ? '5등급' : 'Grade 5'}</Text>
          <Text style={styles.postTime}>{post.time}</Text>
        </View>
        <TouchableOpacity>
          <MoreHorizontal size={20} color="#8E8E93" />
        </TouchableOpacity>
      </View>
      
      {post.image && (
        <View style={styles.postImageContainer}>
          <Image source={{ uri: post.image }} style={styles.postImage} />
        </View>
      )}
      
      {post.content ? (
        <Text style={styles.postContent}>{post.content}</Text>
      ) : null}
      
      <View style={styles.postActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleLikePost(post.id)}
        >
          <Heart 
            size={20} 
            color={post.liked ? "#FF3B30" : "#8E8E93"} 
            fill={post.liked ? "#FF3B30" : "none"}
          />
          <Text style={[styles.actionText, post.liked && styles.actionTextActive]}>
            {post.likes}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handlePostPress(post)}
        >
          <MessageCircle size={20} color="#8E8E93" />
          <Text style={styles.actionText}>{post.comments}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Share2 size={20} color="#8E8E93" />
          <Text style={styles.actionText}>{post.shares}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: language === 'ko' ? '오늘의 공부 인증' : "Today's Study Verification",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: -8 }}>
              <ChevronLeft size={24} color="#000000" />
            </TouchableOpacity>
          ),
        }} 
      />
      <View style={styles.container}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {posts.map(renderPost)}
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
                {language === 'ko' ? '게시물 상세' : 'Post Details'}
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
                  </View>
                  
                  {selectedPost.image && (
                    <Image source={{ uri: selectedPost.image }} style={styles.postDetailImage} />
                  )}
                  
                  <View style={styles.postDetailActions}>
                    <Text style={styles.actionLabel}>{language === 'ko' ? '조회' : 'Views'} {selectedPost.shares}</Text>
                    <TouchableOpacity style={styles.likeButton}>
                      <Heart size={16} color="#8E8E93" />
                      <Text style={styles.likeButtonText}>{selectedPost.likes}</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.commentsSection}>
                    <Text style={styles.commentsTitle}>{language === 'ko' ? '댓글' : 'Comments'} {selectedPost.comments}</Text>
                    
                    {selectedPost.commentsList?.map((comment) => (
                      <View key={comment.id} style={styles.commentItem}>
                        <Image source={{ uri: comment.avatar }} style={styles.commentAvatar} />
                        <View style={styles.commentContent}>
                          <View style={styles.commentHeader}>
                            <Text style={styles.commentAuthor}>{comment.author}</Text>
                            <Text style={styles.commentTime}>{comment.time}</Text>
                          </View>
                          <Text style={styles.commentText}>{comment.content}</Text>
                          <View style={styles.commentActions}>
                            <TouchableOpacity style={styles.commentAction}>
                              <Heart size={14} color="#8E8E93" />
                              <Text style={styles.commentActionText}>{language === 'ko' ? '좋아요' : 'Like'} {comment.likes}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.commentAction}>
                              <MessageCircle size={14} color="#8E8E93" />
                              <Text style={styles.commentActionText}>{language === 'ko' ? '답글' : 'Reply'}</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                </ScrollView>
                
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

        <TouchableOpacity 
          style={styles.fab}
          onPress={() => setShowCreatePost(true)}
        >
          <Plus size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </>
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
    paddingTop: 16,
    paddingBottom: 80,
  },
  postCard: {
    backgroundColor: "#FFFFFF",
    marginBottom: 8,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
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
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
  },
  postTime: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 2,
  },
  postContent: {
    fontSize: 15,
    color: "#000000",
    lineHeight: 22,
    marginBottom: 12,
  },
  postImageContainer: {
    marginVertical: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  postImage: {
    width: '100%',
    height: 200,
    backgroundColor: "#F0F0F0",
  },
  postActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 13,
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
    fontSize: 17,
    fontWeight: "600",
    color: "#000000",
  },
  modalContent: {
    flex: 1,
  },
  modalScrollContent: {
    flex: 1,
  },
  postDetailHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  postDetailContent: {
    fontSize: 16,
    color: "#000000",
    lineHeight: 24,
  },
  postDetailContentContainer: {
    marginBottom: 16,
  },
  postDetailImage: {
    width: '100%',
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
    fontSize: 13,
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
    fontSize: 13,
    color: "#8E8E93",
  },
  commentsSection: {
    paddingVertical: 16,
  },
  commentsTitle: {
    fontSize: 15,
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
    fontSize: 13,
    fontWeight: "500",
    color: "#000000",
  },
  commentTime: {
    fontSize: 11,
    color: "#8E8E93",
  },
  commentText: {
    fontSize: 14,
    color: "#000000",
    lineHeight: 20,
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
    fontSize: 11,
    color: "#8E8E93",
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
    fontSize: 17,
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
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
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
});