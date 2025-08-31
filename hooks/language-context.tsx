import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'ko' | 'en';

export interface Translation {
  [key: string]: string;
}

const translations: Record<Language, Translation> = {
  ko: {
    // Header
    examType: '대학수학능력시험',
    userName: '학구몬',
    
    // Timer Card
    timerTitle: '실시간 모의고사 채점하기',
    currentGrade: '아구몬님의\n현재 성적',
    averageGrade: '평균 등급',
    
    // Subjects
    subjectsTitle: '과목별 성적',
    editButton: '편집',
    korean: '국어',
    english: '영어',
    math: '수학',
    science: '탐구',
    expectedGrade: '예상등급',
    gradeUnit: '등급',
    undetermined: '미정',
    
    // Priority Tasks
    priorityTasksTitle: '우선 순위 3가지',
    emptyPriorityText: '우선순위 일정을 추가해보세요',
    
    // Goals
    goalsTitle: '모든 생각 쏟아내기',
    morningAdjustment: '아침 조정하기',
    
    // Modals
    addExamTitle: '새 시험 추가',
    addTaskTitle: '일정 등록',
    save: '저장',
    examName: '시험명',
    examDate: '시험 날짜',
    examDescription: '시험 설명 (선택사항)',
    importance: '중요도',
    high: '높음',
    medium: '보통',
    low: '낮음',
    taskTitle: '일정 제목',
    description: '설명 (선택사항)',
    setPriority: '우선순위로 설정',
    
    // Placeholders
    examNamePlaceholder: '예: 중간고사, 모의고사 등',
    examDatePlaceholder: 'YYYY.MM.DD 형식으로 입력',
    examDescPlaceholder: '시험에 대한 추가 정보를 입력하세요',
    taskTitlePlaceholder: '일정 제목을 입력하세요',
    taskDescPlaceholder: '일정에 대한 추가 설명을 입력하세요',
    
    // Alerts
    error: '오류',
    notification: '알림',
    examFormError: '시험명과 날짜를 모두 입력해주세요.',
    futureDateError: '미래 날짜를 입력해주세요.',
    taskTitleError: '일정 제목을 입력해주세요.',
    priorityLimitError: '우선순위는 최대 3개까지만 설정할 수 있습니다.',
    
    // Settings
    settings: '설정',
    profile: '프로필',
    name: '이름',
    profilePicture: '프로필 사진',
    language: '언어',
    korean_lang: '한국어',
    english_lang: 'English',
    loading: '로딩 중...',
    
    // Tab Navigation
    home: '홈',
    timer: '타이머',
    notes: '목록',
    stats: '성적관리',
    community: '커뮤니티',
  },
  en: {
    // Header
    examType: 'College Scholastic Ability Test',
    userName: 'Study Mon',
    
    // Timer Card
    timerTitle: 'Real-time Mock Test Scoring',
    currentGrade: 'Your Current\nGrade',
    averageGrade: 'Average Grade',
    
    // Subjects
    subjectsTitle: 'Subject Grades',
    editButton: 'Edit',
    korean: 'Korean',
    english: 'English',
    math: 'Math',
    science: 'Science',
    expectedGrade: 'Expected',
    gradeUnit: 'Grade',
    undetermined: 'TBD',
    
    // Priority Tasks
    priorityTasksTitle: 'Top 3 Priorities',
    emptyPriorityText: 'Add priority tasks',
    
    // Goals
    goalsTitle: 'Brain Dump',
    morningAdjustment: 'Morning Adjustment',
    
    // Modals
    addExamTitle: 'Add New Exam',
    addTaskTitle: 'Add Task',
    save: 'Save',
    examName: 'Exam Name',
    examDate: 'Exam Date',
    examDescription: 'Exam Description (Optional)',
    importance: 'Importance',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    taskTitle: 'Task Title',
    description: 'Description (Optional)',
    setPriority: 'Set as Priority',
    
    // Placeholders
    examNamePlaceholder: 'e.g., Midterm, Mock Test',
    examDatePlaceholder: 'Enter in YYYY.MM.DD format',
    examDescPlaceholder: 'Enter additional exam information',
    taskTitlePlaceholder: 'Enter task title',
    taskDescPlaceholder: 'Enter additional task description',
    
    // Alerts
    error: 'Error',
    notification: 'Notice',
    examFormError: 'Please enter both exam name and date.',
    futureDateError: 'Please enter a future date.',
    taskTitleError: 'Please enter a task title.',
    priorityLimitError: 'You can set up to 3 priority tasks only.',
    
    // Settings
    settings: 'Settings',
    profile: 'Profile',
    name: 'Name',
    profilePicture: 'Profile Picture',
    language: 'Language',
    korean_lang: '한국어',
    english_lang: 'English',
    loading: 'Loading...',
    
    // Tab Navigation
    home: 'Home',
    timer: 'Timer',
    notes: 'Notes',
    stats: 'Stats',
    community: 'Community',
  },
};

export const [LanguageProvider, useLanguage] = createContextHook(() => {
  const [language, setLanguage] = useState<Language>('ko');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('language');
      if (savedLanguage && (savedLanguage === 'ko' || savedLanguage === 'en')) {
        setLanguage(savedLanguage as Language);
      }
    } catch (error) {
      console.error('Failed to load language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const changeLanguage = useCallback(async (newLanguage: Language) => {
    try {
      setLanguage(newLanguage);
      await AsyncStorage.setItem('language', newLanguage);
    } catch (error) {
      console.error('Failed to save language:', error);
    }
  }, []);

  const t = useCallback((key: string): string => {
    return translations[language][key] || key;
  }, [language]);

  const translateText = useCallback(async (text: string, targetLanguage?: Language): Promise<string> => {
    try {
      const target = targetLanguage || (language === 'ko' ? 'en' : 'ko');
      
      const response = await fetch('https://toolkit.rork.com/text/llm/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: `You are a professional translator. Translate the given text to ${target === 'ko' ? 'Korean' : 'English'}. Only return the translated text, nothing else.`
            },
            {
              role: 'user',
              content: text
            }
          ]
        })
      });

      const data = await response.json();
      return data.completion || text;
    } catch (error) {
      console.error('Translation failed:', error);
      return text;
    }
  }, [language]);

  return useMemo(() => ({
    language,
    changeLanguage,
    t,
    translateText,
    isLoading,
  }), [language, changeLanguage, t, translateText, isLoading]);
});