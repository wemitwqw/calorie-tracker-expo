import { Ionicons } from '@expo/vector-icons';
import React from 'react'
import { Modal, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

export default function CustomCalendar({
  calendarVisible, 
  setCalendarVisible, 
  selectedDate, 
  setSelectedDate,
  markedDates,
}) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={calendarVisible}
      onRequestClose={() => setCalendarVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.calendarContainer}>
        <View style={styles.calendarHeader}>
          <Text style={styles.calendarTitle}>Select Date</Text>
          <TouchableOpacity onPress={() => setCalendarVisible(false)}>
          <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>
        
        <Calendar
          onDayPress={(day) => {
          setSelectedDate(day.dateString);
          setCalendarVisible(false);
          }}
          markedDates={{
          ...markedDates,
          [selectedDate]: { selected: true, selectedColor: '#4CAF50' }
          }}
          theme={{
          todayTextColor: '#4CAF50',
          selectedDayBackgroundColor: '#4CAF50',
          dotColor: '#4CAF50',
          }}
        />
        
        <View style={styles.calendarFooter}>
          <TouchableOpacity 
            style={styles.todayButton} 
            onPress={() => {
              const today = new Date().toISOString().split('T')[0];
              setSelectedDate(today);
              setCalendarVisible(false);
            }}
          >
            <Text style={styles.todayButtonText}>Today</Text>
          </TouchableOpacity>
        </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  calendarContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  calendarFooter: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  todayButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  todayButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});