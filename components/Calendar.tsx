import { constants } from '@/constants';
import { useDateStore } from '@/stores/useDateStore';
import { getFormattedLocalDate } from '@/utils/date';
import { Ionicons } from '@expo/vector-icons';
import React from 'react'
import { Modal, TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

interface CustomCalendarProps {
  calendarVisible: boolean;
  setCalendarVisible: (visible: boolean) => void;
}

interface MarkedDateProps {
  marked?: boolean;
  selected?: boolean;
  selectedColor?: string;
  dotColor?: string;
}

type MarkedDates = {
  [date: string]: MarkedDateProps;
};

export default function CustomCalendar({calendarVisible, setCalendarVisible}: CustomCalendarProps) {
  const { selectedDate, setSelectedDate, markedDates } = useDateStore.getState();
  
  const formattedMarkedDates: MarkedDates = markedDates.reduce((acc, date) => {
    acc[date] = { marked: true, dotColor: constants.markedDateDotColor };
    return acc;
  }, {} as MarkedDates);

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
          onDayPress={(day: { dateString: string; }) => {
          setSelectedDate(day.dateString);
          setCalendarVisible(false);
          }}
          markedDates={{
          ...formattedMarkedDates,
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
              setSelectedDate(getFormattedLocalDate(new Date()));
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