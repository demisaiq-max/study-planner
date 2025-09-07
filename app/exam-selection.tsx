import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronDown, Info } from "lucide-react-native";
import { router } from "expo-router";
import { Stack } from "expo-router";

const { width } = Dimensions.get("window");

interface ExamType {
  id: string;
  name: string;
  selected: boolean;
}

interface DateOption {
  year: string;
  date: string;
}

interface Subject {
  id: string;
  name: string;
  selected: boolean;
}

export default function ExamSelectionScreen() {
  // Exam type selection
  const [examTypes, setExamTypes] = useState<ExamType[]>([
    { id: "1", name: "고3 평가원", selected: true },
    { id: "2", name: "실전", selected: false },
  ]);

  // Date selection
  const [selectedYear, setSelectedYear] = useState("2025년");
  const [selectedDate, setSelectedDate] = useState("3.28 학력평가");
  const [showYearModal, setShowYearModal] = useState(false);
  const [showDateModal, setShowDateModal] = useState(false);

  // Country selection
  const [countries] = useState([
    { id: "1", name: "학력과 작문", selected: true },
    { id: "2", name: "언어와매체", selected: false },
  ]);

  // Math selection
  const [mathTypes] = useState([
    { id: "1", name: "학물과통계", selected: false },
    { id: "2", name: "미적분", selected: true },
    { id: "3", name: "기하", selected: false },
  ]);

  // English selection
  const [englishSelected] = useState(true);

  // Korean History selection
  const [koreanHistorySelected] = useState(true);

  // Exploration subjects
  const [explorationSubjects, setExplorationSubjects] = useState<Subject[]>([
    { id: "1", name: "생활과윤리", selected: true },
    { id: "2", name: "윤리와사상", selected: false },
    { id: "3", name: "한국지리", selected: false },
    { id: "4", name: "세계지리", selected: false },
    { id: "5", name: "동아시아사", selected: false },
    { id: "6", name: "세계사", selected: true },
    { id: "7", name: "경제", selected: false },
    { id: "8", name: "정치와법", selected: false },
    { id: "9", name: "사회문화", selected: false },
    { id: "10", name: "물리학 I", selected: false },
    { id: "11", name: "화학 I", selected: false },
    { id: "12", name: "생명과학", selected: false },
    { id: "13", name: "지구과학 I", selected: false },
    { id: "14", name: "물리학 II", selected: false },
    { id: "15", name: "화학 II", selected: false },
    { id: "16", name: "생명과학 II", selected: false },
    { id: "17", name: "지구과학 II", selected: false },
  ]);

  const yearOptions = ["2025년", "2024년", "2023년", "2022년"];
  const dateOptions = [
    "3.28 학력평가",
    "4.10 학력평가",
    "6.4 평가원",
    "7.11 학력평가",
    "9.4 평가원",
    "10.15 학력평가",
    "11.14 수능",
  ];

  const toggleExplorationSubject = (id: string) => {
    setExplorationSubjects(prev =>
      prev.map(subject =>
        subject.id === id
          ? { ...subject, selected: !subject.selected }
          : subject
      )
    );
  };

  const handleSubmit = () => {
    // Handle form submission
    console.log("Form submitted");
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "과목선택",
          headerStyle: {
            backgroundColor: "#FFFFFF",
          },
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "600",
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>취소</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity style={styles.infoButton}>
              <Info size={24} color="#007AFF" />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Exam Type Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>시험 유형</Text>
          <View style={styles.optionRow}>
            <TouchableOpacity
              style={[styles.dropdown, styles.dropdownHalf]}
              onPress={() => {}}
            >
              <Text style={styles.dropdownText}>고3 평가원</Text>
              <ChevronDown size={16} color="#666666" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.dropdown, styles.dropdownHalf]}
              onPress={() => {}}
            >
              <Text style={styles.dropdownText}>실전</Text>
              <ChevronDown size={16} color="#666666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Date Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>��험명</Text>
          <View style={styles.optionRow}>
            <TouchableOpacity
              style={[styles.dropdown, styles.dropdownHalf]}
              onPress={() => setShowYearModal(true)}
            >
              <Text style={styles.dropdownText}>{selectedYear}</Text>
              <ChevronDown size={16} color="#666666" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.dropdown, styles.dropdownHalf]}
              onPress={() => setShowDateModal(true)}
            >
              <Text style={styles.dropdownText}>{selectedDate}</Text>
              <ChevronDown size={16} color="#666666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Country Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>국어</Text>
          <View style={styles.optionRow}>
            {countries.map((country) => (
              <TouchableOpacity
                key={country.id}
                style={[
                  styles.optionButton,
                  country.selected && styles.optionButtonSelected,
                ]}
                onPress={() => {}}
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    country.selected && styles.optionButtonTextSelected,
                  ]}
                >
                  {country.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Math Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>수학</Text>
          <View style={styles.optionRow}>
            {mathTypes.map((math) => (
              <TouchableOpacity
                key={math.id}
                style={[
                  styles.optionButton,
                  styles.optionButtonThird,
                  math.selected && styles.optionButtonSelected,
                ]}
                onPress={() => {}}
              >
                <Text
                  style={[
                    styles.optionButtonText,
                    math.selected && styles.optionButtonTextSelected,
                  ]}
                >
                  {math.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* English Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>영어</Text>
          <View style={styles.optionRow}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                styles.optionButtonFull,
                englishSelected && styles.optionButtonSelected,
              ]}
              onPress={() => {}}
            >
              <Text
                style={[
                  styles.optionButtonText,
                  englishSelected && styles.optionButtonTextSelected,
                ]}
              >
                영어
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Korean History Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>한국사</Text>
          <View style={styles.optionRow}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                styles.optionButtonFull,
                koreanHistorySelected && styles.optionButtonSelected,
              ]}
              onPress={() => {}}
            >
              <Text
                style={[
                  styles.optionButtonText,
                  koreanHistorySelected && styles.optionButtonTextSelected,
                ]}
              >
                한국사
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Exploration Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>탐구</Text>
          <View style={styles.explorationGrid}>
            {explorationSubjects.map((subject) => (
              <TouchableOpacity
                key={subject.id}
                style={[
                  styles.explorationButton,
                  subject.selected && styles.explorationButtonSelected,
                ]}
                onPress={() => toggleExplorationSubject(subject.id)}
              >
                <Text
                  style={[
                    styles.explorationButtonText,
                    subject.selected && styles.explorationButtonTextSelected,
                  ]}
                >
                  {subject.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>답 안 입 력 하 기</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Year Selection Modal */}
      <Modal
        visible={showYearModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowYearModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowYearModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>연도 선택</Text>
              <TouchableOpacity onPress={() => setShowYearModal(false)}>
                <Text style={styles.modalCloseText}>완료</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={yearOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalOption}
                  onPress={() => {
                    setSelectedYear(item);
                    setShowYearModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      selectedYear === item && styles.modalOptionTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Date Selection Modal */}
      <Modal
        visible={showDateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDateModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDateModal(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>시험 선택</Text>
              <TouchableOpacity onPress={() => setShowDateModal(false)}>
                <Text style={styles.modalCloseText}>완료</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll}>
              {dateOptions.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.modalOption}
                  onPress={() => {
                    setSelectedDate(item);
                    setShowDateModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      selectedDate === item && styles.modalOptionTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  headerButton: {
    paddingHorizontal: 16,
  },
  headerButtonText: {
    fontSize: 16,
    color: "#007AFF",
  },
  infoButton: {
    paddingHorizontal: 16,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 12,
  },
  optionRow: {
    flexDirection: "row",
    gap: 12,
  },
  dropdown: {
    backgroundColor: "#F2F2F7",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownHalf: {
    flex: 1,
  },
  dropdownText: {
    fontSize: 14,
    color: "#000000",
  },
  optionButton: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  optionButtonThird: {
    flex: 0,
    minWidth: (width - 40 - 24) / 3,
  },
  optionButtonFull: {
    flex: 0,
    minWidth: (width - 40) / 3,
  },
  optionButtonSelected: {
    backgroundColor: "#C8E6C9",
    borderColor: "#4CAF50",
  },
  optionButtonText: {
    fontSize: 14,
    color: "#000000",
    fontWeight: "500",
  },
  optionButtonTextSelected: {
    color: "#000000",
    fontWeight: "600",
  },
  explorationGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  explorationButton: {
    width: (width - 40 - 16) / 3,
    backgroundColor: "#F2F2F7",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  explorationButtonSelected: {
    backgroundColor: "#C8E6C9",
    borderColor: "#4CAF50",
  },
  explorationButtonText: {
    fontSize: 13,
    color: "#000000",
    fontWeight: "500",
    textAlign: "center",
  },
  explorationButtonTextSelected: {
    color: "#000000",
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 32,
    borderWidth: 2,
    borderColor: "#E5E5EA",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666666",
    letterSpacing: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "50%",
    paddingBottom: 34,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  modalCloseText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
  },
  modalScroll: {
    maxHeight: 300,
  },
  modalOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  modalOptionText: {
    fontSize: 16,
    color: "#000000",
  },
  modalOptionTextSelected: {
    color: "#007AFF",
    fontWeight: "600",
  },
});