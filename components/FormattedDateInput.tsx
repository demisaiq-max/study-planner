import React, { useState, useRef, useEffect } from "react";
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  Platform,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Calendar } from "lucide-react-native";

interface FormattedDateInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  placeholderTextColor?: string;
  style?: any;
}

export default function FormattedDateInput({
  value,
  onChangeText,
  placeholder = "YYYY-MM-DD",
  placeholderTextColor = "#8E8E93",
  style,
}: FormattedDateInputProps) {
  const [displayValue, setDisplayValue] = useState(value || "");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return new Date(value);
    }
    return new Date();
  });
  const inputRef = useRef<TextInput>(null);
  const webDateInputRef = useRef<HTMLInputElement>(null);

  const formatDate = (text: string) => {
    // Remove all non-numeric characters
    const numbers = text.replace(/[^\d]/g, "");
    
    let formatted = "";
    
    // Format as YYYY-MM-DD
    if (numbers.length > 0) {
      // Year
      formatted = numbers.slice(0, 4);
      
      if (numbers.length > 4) {
        // Month
        formatted += "-" + numbers.slice(4, 6);
        
        if (numbers.length > 6) {
          // Day
          formatted += "-" + numbers.slice(6, 8);
        }
      }
    }
    
    return formatted;
  };

  const handleChangeText = (text: string) => {
    // If user is deleting, allow it
    if (text.length < displayValue.length) {
      // Check if user deleted a separator
      if (displayValue[text.length] === "-") {
        // Remove the number before the separator too
        text = text.slice(0, -1);
      }
      setDisplayValue(text);
      onChangeText(text);
      return;
    }

    // Format the input
    const formatted = formatDate(text);
    setDisplayValue(formatted);
    onChangeText(formatted);
  };

  const isValidDate = (dateString: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return false;
    }
    
    const date = new Date(dateString);
    const [year, month, day] = dateString.split("-").map(Number);
    
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  };

  const getPlaceholderDisplay = () => {
    if (!displayValue) return placeholder;
    
    const parts = displayValue.split("-");
    let placeholderParts = ["YYYY", "MM", "DD"];
    
    // Replace filled parts with actual values
    parts.forEach((part, index) => {
      if (part) {
        placeholderParts[index] = part.padEnd(placeholderParts[index].length, "_");
      }
    });
    
    // Show remaining placeholder
    if (parts.length === 1 && parts[0].length < 4) {
      return displayValue + "YYYY".slice(parts[0].length) + "-MM-DD";
    } else if (parts.length === 2 && parts[1].length < 2) {
      return displayValue + "MM".slice(parts[1].length) + "-DD";
    } else if (parts.length === 3 && parts[2].length < 2) {
      return displayValue + "DD".slice(parts[2].length);
    }
    
    return "";
  };

  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      
      setSelectedDate(date);
      setDisplayValue(formattedDate);
      onChangeText(formattedDate);
    }
  };

  const handleCalendarPress = () => {
    if (Platform.OS === 'web') {
      // For web, trigger the native date input
      webDateInputRef.current?.showPicker?.();
    } else {
      setShowDatePicker(true);
    }
  };

  useEffect(() => {
    // Update selectedDate when value changes
    if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      setSelectedDate(new Date(value));
      setDisplayValue(value);
    }
  }, [value]);

  const isComplete = displayValue.length === 10;
  const isValid = isComplete && isValidDate(displayValue);

  return (
    <View style={[styles.container, style]}>
      <View style={styles.inputWrapper}>
        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            !isComplete && styles.inputIncomplete,
            isComplete && !isValid && styles.inputInvalid,
            isComplete && isValid && styles.inputValid,
          ]}
          value={displayValue}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          keyboardType="numeric"
          maxLength={10}
        />
        {displayValue && !isComplete && (
          <Text style={styles.placeholderOverlay}>
            {getPlaceholderDisplay()}
          </Text>
        )}
        <TouchableOpacity 
          style={styles.iconContainer}
          onPress={handleCalendarPress}
          activeOpacity={0.7}
        >
          <Calendar size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>
      {displayValue && !isComplete && (
        <Text style={styles.helperText}>
          Enter date in format: YYYY-MM-DD
        </Text>
      )}
      {isComplete && !isValid && (
        <Text style={styles.errorText}>
          Please enter a valid date
        </Text>
      )}
      
      {Platform.OS === 'ios' && showDatePicker && (() => {
        const DateTimePicker = require('@react-native-community/datetimepicker').default;
        return (
          <Modal
            visible={showDatePicker}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowDatePicker(false)}
          >
            <TouchableOpacity 
              style={styles.modalOverlay}
              activeOpacity={1}
              onPress={() => setShowDatePicker(false)}
            >
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                    <Text style={styles.modalCancel}>Cancel</Text>
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>Select Date</Text>
                  <TouchableOpacity onPress={() => {
                    handleDateChange(null, selectedDate);
                    setShowDatePicker(false);
                  }}>
                    <Text style={styles.modalDone}>Done</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.datePickerContainer}>
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="spinner"
                    onChange={handleDateChange}
                    style={styles.datePicker}
                    textColor="#000000"
                    themeVariant="light"
                  />
                </View>
              </View>
            </TouchableOpacity>
          </Modal>
        );
      })()}
      
      {Platform.OS === 'android' && showDatePicker && (() => {
        const DateTimePicker = require('@react-native-community/datetimepicker').default;
        return (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        );
      })()}
      
      {Platform.OS === 'web' && (
        <input
          type="date"
          ref={webDateInputRef}
          value={displayValue}
          onChange={(e) => {
            const newValue = e.target.value;
            setDisplayValue(newValue);
            onChangeText(newValue);
          }}
          style={{
            position: 'absolute',
            opacity: 0,
            pointerEvents: 'auto',
            width: 1,
            height: 1,
            left: -9999,
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  inputWrapper: {
    position: "relative",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    paddingRight: 48,
    fontSize: 16,
    color: "#000000",
    borderWidth: 1,
    borderColor: "#E5E5EA",
    fontVariant: ["tabular-nums"],
  },
  inputIncomplete: {
    borderColor: "#E5E5EA",
  },
  inputInvalid: {
    borderColor: "#FF3B30",
    backgroundColor: "#FFF4F4",
  },
  inputValid: {
    borderColor: "#34C759",
  },
  placeholderOverlay: {
    position: "absolute",
    left: 16,
    top: Platform.OS === "ios" ? 17 : 16,
    fontSize: 16,
    color: "#C7C7CC",
    pointerEvents: "none",
  },
  iconContainer: {
    position: "absolute",
    right: 16,
    top: "50%",
    transform: [{ translateY: -10 }],
    padding: 4,
  },
  helperText: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 4,
    marginLeft: 4,
  },
  errorText: {
    fontSize: 12,
    color: "#FF3B30",
    marginTop: 4,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#F8F8F8',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalCancel: {
    fontSize: 17,
    color: '#8E8E93',
    fontWeight: '400',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    letterSpacing: 0.3,
  },
  modalDone: {
    fontSize: 17,
    fontWeight: '600',
    color: '#007AFF',
  },
  datePicker: {
    backgroundColor: '#F8F8F8',
    height: 220,
    color: '#000000',
  },
  datePickerContainer: {
    backgroundColor: '#F8F8F8',
    paddingVertical: 10,
  },
});