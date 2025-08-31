import { useState, useEffect, useMemo, useCallback } from "react";
import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  subject?: string;
  dueDate?: string;
  estimatedTime?: number;
  priority?: "high" | "medium" | "low";
  description?: string;
}

interface PriorityTask {
  title: string;
  description?: string;
}

interface DDay {
  id: string;
  title: string;
  date: string;
  daysLeft: number;
}

interface StudyData {
  tasks: Task[];
  dDays: DDay[];
  todayStudyTime: number;
  targetStudyTime: number;
  weeklyStudyTime: number;
  monthlyGoal: number;
  subjects: string[];
  subjectGrades: Record<string, number>;
  visibleSubjects: string[];
  priorityTasks: PriorityTask[];
}

const STORAGE_KEY = "focusflow_study_data";

const defaultData: StudyData = {
  tasks: [
    { id: "1", title: "아침 조정하기", completed: false, priority: "high" },
    { id: "2", title: "2025년 6월 모의고사 풀기", completed: false, subject: "수학" },
    { id: "3", title: "학원가기", completed: true },
    { id: "4", title: "자이스토리 325p까지 풀기", completed: false, subject: "영어" },
    { id: "5", title: "ebs 수능특강 강의 듣기", completed: false, subject: "국어" },
    { id: "6", title: "ebs 수능특강 강의 듣기", completed: false, subject: "과학" },
    { id: "7", title: "ebs 수능특강 강의 듣기", completed: false, subject: "사회" },
  ],
  dDays: [
    { id: "1", title: "대학수학능력시험", date: "2025.11.13", daysLeft: 180 },
    { id: "2", title: "9월 모의평가", date: "2025.09.15", daysLeft: 21 },
  ],
  todayStudyTime: 185,
  targetStudyTime: 360,
  weeklyStudyTime: 28,
  monthlyGoal: 150,
  subjects: ["국어", "영어", "수학", "탐구"],
  subjectGrades: {
    "국어": 3,
    "영어": 2,
    "수학": 1,
    "탐구": 2
  },
  visibleSubjects: ["국어", "영어", "수학"],
  priorityTasks: [
    { title: "아침 조정하기" },
    { title: "2025년 6월 모의고사 풀기" },
    { title: "학원가기" }
  ],
};

export const [StudyProvider, useStudyStore] = createContextHook(() => {
  const [data, setData] = useState<StudyData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedData = JSON.parse(stored);
        // Ensure all required properties exist
        const mergedData = {
          ...defaultData,
          ...parsedData,
          priorityTasks: parsedData.priorityTasks || [],
          visibleSubjects: parsedData.visibleSubjects || defaultData.visibleSubjects,
          subjects: parsedData.subjects || defaultData.subjects,
          subjectGrades: parsedData.subjectGrades || defaultData.subjectGrades,
        };
        setData(mergedData);
      }
    } catch (error) {
      console.error("Failed to load study data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveData = async (newData: StudyData) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
      setData(newData);
    } catch (error) {
      console.error("Failed to save study data:", error);
    }
  };

  const toggleTask = useCallback((taskId: string) => {
    const updatedTasks = data.tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    saveData({ ...data, tasks: updatedTasks });
  }, [data]);

  const addTask = useCallback((task: Omit<Task, "id">) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
    };
    saveData({ ...data, tasks: [...data.tasks, newTask] });
  }, [data]);

  const updateStudyTime = useCallback((minutes: number) => {
    saveData({ ...data, todayStudyTime: data.todayStudyTime + minutes });
  }, [data]);

  const addDDay = useCallback((dDay: Omit<DDay, "id">) => {
    const newDDay: DDay = {
      ...dDay,
      id: Date.now().toString(),
    };
    saveData({ ...data, dDays: [...data.dDays, newDDay] });
  }, [data]);

  const toggleSubjectVisibility = useCallback((subject: string) => {
    const currentVisibleSubjects = data.visibleSubjects || [];
    const updatedVisibleSubjects = currentVisibleSubjects.includes(subject)
      ? currentVisibleSubjects.filter(s => s !== subject)
      : [...currentVisibleSubjects, subject];
    saveData({ ...data, visibleSubjects: updatedVisibleSubjects });
  }, [data]);

  const addPriorityTask = useCallback((task: PriorityTask) => {
    const currentPriorityTasks = data.priorityTasks || [];
    if (currentPriorityTasks.length >= 3) return;
    saveData({ ...data, priorityTasks: [...currentPriorityTasks, task] });
  }, [data]);

  const removePriorityTask = useCallback((index: number) => {
    const currentPriorityTasks = data.priorityTasks || [];
    const updatedPriorityTasks = currentPriorityTasks.filter((_, i) => i !== index);
    saveData({ ...data, priorityTasks: updatedPriorityTasks });
  }, [data]);

  return useMemo(() => ({
    ...data,
    isLoading,
    toggleTask,
    addTask,
    updateStudyTime,
    addDDay,
    toggleSubjectVisibility,
    addPriorityTask,
    removePriorityTask,
  }), [data, isLoading, toggleTask, addTask, updateStudyTime, addDDay, toggleSubjectVisibility, addPriorityTask, removePriorityTask]);
});