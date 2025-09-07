import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  Animated,
} from "react-native";

import { Play, Pause, RotateCcw, Coffee } from "lucide-react-native";
import CircularProgress from "@/components/CircularProgress";
import { useStudyStore } from "@/hooks/study-store";
import { useLanguage } from "@/hooks/language-context";

const { width } = Dimensions.get("window");

const POMODORO_TIME = 25 * 60; // 25 minutes
const SHORT_BREAK = 5 * 60; // 5 minutes
const LONG_BREAK = 15 * 60; // 15 minutes

export default function TimerScreen() {
  const { updateStudyTime } = useStudyStore();
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState(POMODORO_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [timerMode, setTimerMode] = useState<"pomodoro" | "shortBreak" | "longBreak">("pomodoro");
  const [pomodoroCount, setPomodoroCount] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const switchMode = useCallback((mode: "pomodoro" | "shortBreak" | "longBreak") => {
    setTimerMode(mode);
    setIsRunning(false);
    
    switch (mode) {
      case "pomodoro":
        setTimeLeft(POMODORO_TIME);
        break;
      case "shortBreak":
        setTimeLeft(SHORT_BREAK);
        break;
      case "longBreak":
        setTimeLeft(LONG_BREAK);
        break;
    }
    
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim]);

  const handleTimerComplete = useCallback(() => {
    if (timerMode === "pomodoro") {
      setPomodoroCount((prev) => {
        const newCount = prev + 1;
        // Auto switch to break
        if (newCount % 4 === 0) {
          switchMode("longBreak");
        } else {
          switchMode("shortBreak");
        }
        return newCount;
      });
      updateStudyTime(POMODORO_TIME / 60);
    } else {
      switchMode("pomodoro");
    }
  }, [timerMode, switchMode, updateStudyTime]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, handleTimerComplete]);

  const toggleTimer = useCallback(() => {
    setIsRunning(!isRunning);
  }, [isRunning]);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    switchMode(timerMode);
  }, [timerMode, switchMode]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);

  const getProgress = useCallback(() => {
    const total = timerMode === "pomodoro" 
      ? POMODORO_TIME 
      : timerMode === "shortBreak" 
      ? SHORT_BREAK 
      : LONG_BREAK;
    return ((total - timeLeft) / total) * 100;
  }, [timerMode, timeLeft]);

  const getModeColor = useCallback(() => {
    switch (timerMode) {
      case "pomodoro":
        return "#007AFF";
      case "shortBreak":
        return "#34C759";
      case "longBreak":
        return "#AF52DE";
    }
  }, [timerMode]);

  return (
    <View style={[styles.container, { backgroundColor: getModeColor() + "10" }]}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('focusTimer') || "FocusFlow Timer"}</Text>
        <Text style={styles.subtitle}>{t('stayFocused') || "Stay focused, stay productive"}</Text>
      </View>

      <View style={styles.modeSelector}>
        <TouchableOpacity
          style={[styles.modeButton, timerMode === "pomodoro" && styles.modeButtonActive]}
          onPress={() => switchMode("pomodoro")}
        >
          <Text style={[styles.modeText, timerMode === "pomodoro" && styles.modeTextActive]}>
            {t('pomodoro') || "Pomodoro"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, timerMode === "shortBreak" && styles.modeButtonActive]}
          onPress={() => switchMode("shortBreak")}
        >
          <Text style={[styles.modeText, timerMode === "shortBreak" && styles.modeTextActive]}>
            {t('shortBreak') || "Short Break"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, timerMode === "longBreak" && styles.modeButtonActive]}
          onPress={() => switchMode("longBreak")}
        >
          <Text style={[styles.modeText, timerMode === "longBreak" && styles.modeTextActive]}>
            {t('longBreak') || "Long Break"}
          </Text>
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.timerContainer, { opacity: fadeAnim }]}>
        <View style={styles.progressWrapper}>
          <CircularProgress
            percentage={getProgress()}
            size={width * 0.7}
            strokeWidth={20}
            color={getModeColor()}
          />
          <View style={styles.timerDisplay}>
            <Text style={[styles.timeText, { color: getModeColor() }]}>
              {formatTime(timeLeft)}
            </Text>
            <Text style={styles.sessionText}>
              {timerMode === "pomodoro" ? (t('focusTime') || "Focus Time") : (t('breakTime') || "Break Time")}
            </Text>
          </View>
        </View>
      </Animated.View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={resetTimer}
        >
          <RotateCcw size={24} color="#8E8E93" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.playButton, { backgroundColor: getModeColor() }]}
          onPress={toggleTimer}
        >
          {isRunning ? (
            <Pause size={32} color="#FFFFFF" />
          ) : (
            <Play size={32} color="#FFFFFF" />
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => switchMode("shortBreak")}
        >
          <Coffee size={24} color="#8E8E93" />
        </TouchableOpacity>
      </View>

      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{pomodoroCount}</Text>
          <Text style={styles.statLabel}>{t('pomodoros') || "Pomodoros"}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {Math.floor((pomodoroCount * 25) / 60)}{t('hours') || "h"} {(pomodoroCount * 25) % 60}{t('minutes') || "m"}
          </Text>
          <Text style={styles.statLabel}>{t('totalFocus') || "Total Focus"}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    paddingTop: 15,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#8E8E93",
  },
  modeSelector: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 4,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modeButtonActive: {
    backgroundColor: "#007AFF",
  },
  modeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8E8E93",
  },
  modeTextActive: {
    color: "#FFFFFF",
  },
  timerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  progressWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  timerDisplay: {
    position: "absolute",
    alignItems: "center",
  },
  timeText: {
    fontSize: 48,
    fontWeight: "bold",
  },
  sessionText: {
    fontSize: 16,
    color: "#8E8E93",
    marginTop: 8,
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
    gap: 30,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  playButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 40,
    paddingBottom: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
  },
  statLabel: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 4,
  },
});