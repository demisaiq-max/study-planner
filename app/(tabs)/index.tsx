import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Plus, User, X, Calendar, ChevronDown, Check } from "lucide-react-native";
import CircularProgress from "@/components/CircularProgress";
import DayCard from "@/components/DayCard";
import CalendarWidget from "@/components/CalendarWidget";
import TaskItem from "@/components/TaskItem";
import { useStudyStore } from "@/hooks/study-store";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const { 
    tasks, 
    dDays, 
    todayStudyTime, 
    targetStudyTime,
    toggleTask,
    updateStudyTime,
    addDDay,
    addTask,
    subjects,
    subjectGrades,
    visibleSubjects,
    toggleSubjectVisibility,
    priorityTasks,
    addPriorityTask,
    removePriorityTask,
    isLoading
  } = useStudyStore();
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAddExamModal, setShowAddExamModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newExamTitle, setNewExamTitle] = useState("");
  const [newExamDate, setNewExamDate] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [isPriority, setIsPriority] = useState(false);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const progressPercentage = (todayStudyTime / targetStudyTime) * 100;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>로딩 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleAddExam = () => {
    if (!newExamTitle.trim() || !newExamDate.trim()) {
      Alert.alert("오류", "시험명과 날짜를 모두 입력해주세요.");
      return;
    }

    const examDate = new Date(newExamDate);
    const today = new Date();
    const timeDiff = examDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysLeft < 0) {
      Alert.alert("오류", "미래 날짜를 입력해주세요.");
      return;
    }

    addDDay({
      title: newExamTitle,
      date: newExamDate,
      daysLeft: daysLeft
    });

    setNewExamTitle("");
    setNewExamDate("");
    setShowAddExamModal(false);
  };

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) {
      Alert.alert("오류", "일정 제목을 입력해주세요.");
      return;
    }

    if (isPriority && (priorityTasks?.length || 0) >= 3) {
      Alert.alert("오류", "우선순위는 최대 3개까지만 설정할 수 있습니다.");
      return;
    }

    const newTask = {
      title: newTaskTitle,
      completed: false,
      description: newTaskDescription,
      priority: isPriority ? "high" as const : undefined
    };

    addTask(newTask);
    
    if (isPriority) {
      addPriorityTask({
        title: newTaskTitle,
        description: newTaskDescription
      });
    }

    setNewTaskTitle("");
    setNewTaskDescription("");
    setIsPriority(false);
    setShowAddTaskModal(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              <User size={24} color="#8E8E93" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.examType}>대학수학능력시험</Text>
              <Text style={styles.userName}>학구몬</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.addButton}>
            <Plus size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>


        
        {/* Study Progress Card */}
        <View style={styles.timerCard}>
          <Text style={styles.timerTitle}>실시간 모의고사 채점하기</Text>
          
          <View style={styles.progressSection}>
            <View style={styles.progressContainer}>
              <CircularProgress 
                percentage={progressPercentage}
                size={140}
                strokeWidth={8}
                showMultipleRings={true}
                centerText="2"
              />
              <View style={styles.progressInfo}>
                <Text style={styles.progressLabel}>아구몬님의</Text>
                <Text style={styles.progressLabel}>현재 성적</Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.averageButton}>
              <Text style={styles.averageLabel}>아구</Text>
              <Text style={styles.averageValue}>평균 등급</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Subject Grades Section */}
        <View style={styles.subjectsCard}>
          <View style={styles.subjectsHeader}>
            <Text style={styles.subjectsTitle}>과목별 성적</Text>
            <TouchableOpacity>
              <Text style={styles.editButton}>편집</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.subjectsScroll}>
            {subjects?.map((subject) => {
              const isVisible = visibleSubjects?.includes(subject) ?? true;
              const grade = subjectGrades?.[subject] || "미정";
              
              return (
                <TouchableOpacity 
                  key={subject}
                  style={[styles.subjectCard, !isVisible && styles.subjectCardHidden]}
                  onPress={() => toggleSubjectVisibility(subject)}
                >
                  <Text style={[styles.subjectName, !isVisible && styles.subjectNameHidden]}>
                    {subject}
                  </Text>
                  <Text style={[styles.subjectGrade, !isVisible && styles.subjectGradeHidden]}>
                    {grade}등급
                  </Text>
                  {isVisible && (
                    <View style={styles.subjectIndicator} />
                  )}
                </TouchableOpacity>
              );
            })}
            
            <TouchableOpacity style={styles.expectedGradeCard}>
              <Text style={styles.expectedGradeText}>예상등급</Text>
              <Text style={styles.expectedGradeValue}>2등급</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* D-Day Cards */}
        <View style={styles.dDaySection}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dDayScroll}
          >
            {dDays?.map((dDay) => (
              <DayCard key={dDay.id} {...dDay} />
            ))}
            <TouchableOpacity 
              style={styles.addDDayCard}
              onPress={() => setShowAddExamModal(true)}
            >
              <Plus size={32} color="#8E8E93" />
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Calendar */}
        <CalendarWidget currentDate={currentTime} />

        {/* Priority Tasks */}
        <View style={styles.tasksSection}>
          <View style={styles.taskHeader}>
            <Text style={styles.taskTitle}>우선 순위 3가지</Text>
            <TouchableOpacity onPress={() => setShowAddTaskModal(true)}>
              <Plus size={20} color="#8E8E93" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.tasksList}>
            {priorityTasks?.map((task: { title: string; description?: string }, index: number) => (
              <View key={index} style={styles.priorityTaskItem}>
                <View style={styles.priorityTaskContent}>
                  <TouchableOpacity 
                    style={styles.priorityCheckbox}
                    onPress={() => removePriorityTask(index)}
                  >
                    <View style={styles.priorityDot} />
                  </TouchableOpacity>
                  <View style={styles.priorityTaskText}>
                    <Text style={styles.priorityTaskTitle}>{task.title}</Text>
                    {task.description && (
                      <Text style={styles.priorityTaskDescription}>{task.description}</Text>
                    )}
                  </View>
                </View>
              </View>
            ))}
            
            {(!priorityTasks || priorityTasks.length === 0) && (
              <View style={styles.emptyPriorityTasks}>
                <Text style={styles.emptyPriorityText}>우선순위 일정을 추가해보세요</Text>
              </View>
            )}
          </View>
        </View>

        {/* Study Goals */}
        <View style={styles.goalsSection}>
          <Text style={styles.goalsTitle}>모든 생각 쏟아내기</Text>
          
          <View style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalLabel}>아침 조정하기</Text>
              <Text style={styles.goalBadge}>V</Text>
            </View>
          </View>

          {tasks?.slice(3).map((task) => (
            <TouchableOpacity 
              key={task.id}
              style={styles.goalItem}
              onPress={() => toggleTask(task.id)}
            >
              <Text style={styles.goalText}>{task.title}</Text>
              <View style={[styles.checkbox, task.completed && styles.checkboxChecked]} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Add Exam Modal */}
      <Modal
        visible={showAddExamModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddExamModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddExamModal(false)}>
              <X size={24} color="#8E8E93" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>새 시험 추가</Text>
            <TouchableOpacity onPress={handleAddExam}>
              <Text style={styles.saveButton}>저장</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.modalScrollView}
            contentContainerStyle={styles.modalScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.modalContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>시험명</Text>
                <TextInput
                  style={styles.textInput}
                  value={newExamTitle}
                  onChangeText={setNewExamTitle}
                  placeholder="예: 중간고사, 모의고사 등"
                  placeholderTextColor="#8E8E93"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>시험 날짜</Text>
                <TextInput
                  style={styles.textInput}
                  value={newExamDate}
                  onChangeText={setNewExamDate}
                  placeholder="YYYY.MM.DD 형식으로 입력"
                  placeholderTextColor="#8E8E93"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>시험 설명 (선택사항)</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  placeholder="시험에 대한 추가 정보를 입력하세요"
                  placeholderTextColor="#8E8E93"
                  multiline
                  numberOfLines={4}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>중요도</Text>
                <View style={styles.priorityButtons}>
                  <TouchableOpacity style={[styles.priorityButton, styles.priorityHigh]}>
                    <Text style={styles.priorityButtonText}>높음</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.priorityButton, styles.priorityMedium]}>
                    <Text style={styles.priorityButtonText}>보통</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.priorityButton, styles.priorityLow]}>
                    <Text style={styles.priorityButtonText}>낮음</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* Add Task Modal */}
      <Modal
        visible={showAddTaskModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddTaskModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddTaskModal(false)}>
              <X size={24} color="#8E8E93" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>일정 등록</Text>
            <TouchableOpacity onPress={handleAddTask}>
              <Text style={styles.saveButton}>저장</Text>
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.modalScrollView}
            contentContainerStyle={styles.modalScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.modalContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>일정 제목</Text>
                <TextInput
                  style={styles.textInput}
                  value={newTaskTitle}
                  onChangeText={setNewTaskTitle}
                  placeholder="일정 제목을 입력하세요"
                  placeholderTextColor="#8E8E93"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>설명 (선택사항)</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={newTaskDescription}
                  onChangeText={setNewTaskDescription}
                  placeholder="일정에 대한 추가 설명을 입력하세요"
                  placeholderTextColor="#8E8E93"
                  multiline
                  numberOfLines={3}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <TouchableOpacity 
                  style={styles.priorityCheckboxContainer}
                  onPress={() => {
                    if ((priorityTasks?.length || 0) >= 3 && !isPriority) {
                      Alert.alert("알림", "우선순위는 최대 3개까지만 설정할 수 있습니다.");
                      return;
                    }
                    setIsPriority(!isPriority);
                  }}
                >
                  <View style={[styles.checkbox, isPriority && styles.checkboxChecked]}>
                    {isPriority && <Check size={14} color="#FFFFFF" />}
                  </View>
                  <Text style={styles.priorityCheckboxLabel}>
                    우선순위로 설정 ({priorityTasks?.length || 0}/3)
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  profileInfo: {
    justifyContent: "center",
  },
  examType: {
    fontSize: 12,
    color: "#8E8E93",
    marginBottom: 2,
  },
  userName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E8F3FF",
    justifyContent: "center",
    alignItems: "center",
  },

  timerCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  timerTitle: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 20,
    textAlign: "center",
  },
  progressSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressInfo: {
    marginLeft: 20,
  },
  progressLabel: {
    fontSize: 14,
    color: "#000000",
    marginBottom: 2,
  },
  averageButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
  },
  averageLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 4,
  },
  averageValue: {
    fontSize: 12,
    color: "#8E8E93",
  },
  dDaySection: {
    marginTop: 20,
    paddingLeft: 20,
  },
  dDayScroll: {
    paddingRight: 20,
  },
  addDDayCard: {
    width: width * 0.4,
    height: 90,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderStyle: "dashed",
  },
  tasksSection: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
  },
  tasksList: {
    gap: 12,
  },
  goalsSection: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  goalsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 16,
  },
  goalCard: {
    backgroundColor: "#8E8E93",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  goalLabel: {
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
  },
  goalBadge: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  goalItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  goalText: {
    fontSize: 14,
    color: "#000000",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#C7C7CC",
  },
  checkboxChecked: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  saveButton: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
  modalScrollView: {
    flex: 1,
  },
  modalScrollContent: {
    paddingBottom: 40,
  },
  modalContent: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#000000",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  priorityButtons: {
    flexDirection: "row",
    gap: 12,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  priorityHigh: {
    backgroundColor: "#FF3B30",
  },
  priorityMedium: {
    backgroundColor: "#FF9500",
  },
  priorityLow: {
    backgroundColor: "#34C759",
  },
  priorityButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  subjectsCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  subjectsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  subjectsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  editButton: {
    fontSize: 14,
    color: "#007AFF",
  },
  subjectsScroll: {
    flexDirection: "row",
  },
  subjectCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    padding: 12,
    marginRight: 12,
    minWidth: 60,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  subjectCardHidden: {
    backgroundColor: "#F2F2F7",
    borderColor: "#E5E5EA",
  },
  subjectName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
    marginBottom: 4,
  },
  subjectNameHidden: {
    color: "#8E8E93",
  },
  subjectGrade: {
    fontSize: 12,
    color: "#007AFF",
  },
  subjectGradeHidden: {
    color: "#8E8E93",
  },
  subjectIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#007AFF",
    marginTop: 4,
  },
  expectedGradeCard: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    padding: 12,
    minWidth: 60,
    alignItems: "center",
  },
  expectedGradeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  expectedGradeValue: {
    fontSize: 12,
    color: "#FFFFFF",
  },
  priorityTaskItem: {
    backgroundColor: "#F8F9FA",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  priorityTaskContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  priorityCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#E5E5EA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FF3B30",
  },
  priorityTaskText: {
    flex: 1,
  },
  priorityTaskTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000000",
    marginBottom: 2,
  },
  priorityTaskDescription: {
    fontSize: 12,
    color: "#8E8E93",
  },
  emptyPriorityTasks: {
    padding: 20,
    alignItems: "center",
  },
  emptyPriorityText: {
    fontSize: 14,
    color: "#8E8E93",
  },
  priorityCheckboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  priorityCheckboxLabel: {
    fontSize: 16,
    color: "#000000",
    marginLeft: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#8E8E93",
  },
});