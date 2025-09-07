import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';

import { Stack, useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight, Plus, X, Edit2, Trash2, Clock, MapPin } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location?: string;
  description?: string;
  color: string;
}

const COLORS = ['#007AFF', '#34C759', '#FF3B30', '#FF9500', '#AF52DE', '#5856D6'];

export default function CalendarScreen() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    time: '',
    location: '',
    description: '',
    color: COLORS[0],
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const stored = await AsyncStorage.getItem('calendar_events');
      if (stored) {
        setEvents(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  const saveEvents = async (newEvents: Event[]) => {
    try {
      await AsyncStorage.setItem('calendar_events', JSON.stringify(newEvents));
      setEvents(newEvents);
    } catch (error) {
      console.error('Error saving events:', error);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getEventsForDate = (date: Date) => {
    const dateStr = formatDate(date);
    return events.filter(event => event.date === dateStr);
  };

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDatePress = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddEvent = () => {
    if (!selectedDate) {
      Alert.alert('Select a Date', 'Please select a date first');
      return;
    }
    setEditingEvent(null);
    setEventForm({
      title: '',
      time: '',
      location: '',
      description: '',
      color: COLORS[0],
    });
    setShowEventModal(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      time: event.time,
      location: event.location || '',
      description: event.description || '',
      color: event.color,
    });
    setShowEventModal(true);
  };

  const handleDeleteEvent = (eventId: string) => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const newEvents = events.filter(e => e.id !== eventId);
            saveEvents(newEvents);
          },
        },
      ]
    );
  };

  const handleSaveEvent = () => {
    if (!eventForm.title || !eventForm.time) {
      Alert.alert('Required Fields', 'Please enter title and time');
      return;
    }

    if (!selectedDate) return;

    const newEvent: Event = {
      id: editingEvent?.id || Date.now().toString(),
      title: eventForm.title,
      date: formatDate(selectedDate),
      time: eventForm.time,
      location: eventForm.location,
      description: eventForm.description,
      color: eventForm.color,
    };

    let newEvents;
    if (editingEvent) {
      newEvents = events.map(e => e.id === editingEvent.id ? newEvent : e);
    } else {
      newEvents = [...events, newEvent];
    }

    saveEvents(newEvents);
    setShowEventModal(false);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          headerShown: true,
          title: 'Calendar',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeft size={24} color="#007AFF" />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Month Navigation */}
        <View style={styles.monthHeader}>
          <TouchableOpacity onPress={handlePreviousMonth} style={styles.navButton}>
            <ChevronLeft size={24} color="#007AFF" />
          </TouchableOpacity>
          
          <Text style={styles.monthTitle}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </Text>
          
          <TouchableOpacity onPress={handleNextMonth} style={styles.navButton}>
            <ChevronRight size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendarContainer}>
          {/* Week Days Header */}
          <View style={styles.weekDaysRow}>
            {weekDays.map((day, index) => (
              <View key={index} style={styles.weekDayCell}>
                <Text style={styles.weekDayText}>{day}</Text>
              </View>
            ))}
          </View>

          {/* Calendar Days */}
          <View style={styles.daysGrid}>
            {getDaysInMonth(currentDate).map((date, index) => {
              if (!date) {
                return <View key={index} style={styles.dayCell} />;
              }

              const dayEvents = getEventsForDate(date);
              const hasEvents = dayEvents.length > 0;

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayCell,
                    isToday(date) && styles.todayCell,
                    isSelected(date) && styles.selectedCell,
                  ]}
                  onPress={() => handleDatePress(date)}
                >
                  <Text style={[
                    styles.dayText,
                    isToday(date) && styles.todayText,
                    isSelected(date) && styles.selectedText,
                  ]}>
                    {date.getDate()}
                  </Text>
                  {hasEvents && (
                    <View style={styles.eventIndicators}>
                      {dayEvents.slice(0, 3).map((event, i) => (
                        <View
                          key={i}
                          style={[styles.eventDot, { backgroundColor: event.color }]}
                        />
                      ))}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Selected Date Events */}
        {selectedDate && (
          <View style={styles.selectedDateContainer}>
            <View style={styles.selectedDateHeader}>
              <Text style={styles.selectedDateTitle}>
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={handleAddEvent}
              >
                <Plus size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.eventsList}>
              {getEventsForDate(selectedDate).length === 0 ? (
                <Text style={styles.noEventsText}>No events for this day</Text>
              ) : (
                getEventsForDate(selectedDate).map(event => (
                  <View key={event.id} style={styles.eventCard}>
                    <View style={[styles.eventColorBar, { backgroundColor: event.color }]} />
                    <View style={styles.eventContent}>
                      <Text style={styles.eventTitle}>{event.title}</Text>
                      <View style={styles.eventDetails}>
                        <View style={styles.eventDetailRow}>
                          <Clock size={14} color="#8E8E93" />
                          <Text style={styles.eventDetailText}>{event.time}</Text>
                        </View>
                        {event.location && (
                          <View style={styles.eventDetailRow}>
                            <MapPin size={14} color="#8E8E93" />
                            <Text style={styles.eventDetailText}>{event.location}</Text>
                          </View>
                        )}
                      </View>
                      {event.description && (
                        <Text style={styles.eventDescription}>{event.description}</Text>
                      )}
                    </View>
                    <View style={styles.eventActions}>
                      <TouchableOpacity 
                        style={styles.eventActionButton}
                        onPress={() => handleEditEvent(event)}
                      >
                        <Edit2 size={18} color="#007AFF" />
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={styles.eventActionButton}
                        onPress={() => handleDeleteEvent(event.id)}
                      >
                        <Trash2 size={18} color="#FF3B30" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Add/Edit Event Modal */}
      <Modal
        visible={showEventModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEventModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingEvent ? 'Edit Event' : 'Add Event'}
              </Text>
              <TouchableOpacity onPress={() => setShowEventModal(false)}>
                <X size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>Title *</Text>
              <TextInput
                style={styles.input}
                value={eventForm.title}
                onChangeText={(text) => setEventForm({...eventForm, title: text})}
                placeholder="Event title"
              />

              <Text style={styles.inputLabel}>Time *</Text>
              <TextInput
                style={styles.input}
                value={eventForm.time}
                onChangeText={(text) => setEventForm({...eventForm, time: text})}
                placeholder="e.g., 10:00 AM"
              />

              <Text style={styles.inputLabel}>Location</Text>
              <TextInput
                style={styles.input}
                value={eventForm.location}
                onChangeText={(text) => setEventForm({...eventForm, location: text})}
                placeholder="Event location"
              />

              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={eventForm.description}
                onChangeText={(text) => setEventForm({...eventForm, description: text})}
                placeholder="Event description"
                multiline
                numberOfLines={3}
              />

              <Text style={styles.inputLabel}>Color</Text>
              <View style={styles.colorPicker}>
                {COLORS.map(color => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      eventForm.color === color && styles.selectedColor,
                    ]}
                    onPress={() => setEventForm({...eventForm, color})}
                  />
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowEventModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSaveEvent}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  navButton: {
    padding: 8,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  todayCell: {
    backgroundColor: '#E5F3FF',
    borderRadius: 8,
  },
  selectedCell: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  dayText: {
    fontSize: 16,
    color: '#000',
  },
  todayText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  selectedText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  eventIndicators: {
    flexDirection: 'row',
    marginTop: 2,
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 1,
  },
  selectedDateContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
  selectedDateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  selectedDateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventsList: {
    gap: 12,
  },
  noEventsText: {
    textAlign: 'center',
    color: '#8E8E93',
    fontSize: 14,
    paddingVertical: 20,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  eventColorBar: {
    width: 4,
  },
  eventContent: {
    flex: 1,
    padding: 12,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  eventDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 4,
  },
  eventDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  eventDetailText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  eventDescription: {
    fontSize: 14,
    color: '#3C3C43',
    marginTop: 4,
  },
  eventActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 8,
  },
  eventActionButton: {
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  modalBody: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3C3C43',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  colorPicker: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selectedColor: {
    borderColor: '#000',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F2F2F7',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});