import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function App() {
  const [trips, setTrips] = useState([]); // Stores our list of trips
  const [destination, setDestination] = useState(''); // Input for destination
  const [startDate, setStartDate] = useState(new Date()); // Input for start date
  const [endDate, setEndDate] = useState(new Date()); // Input for end date
  const [editingTripId, setEditingTripId] = useState(null); // ID of trip being edited

  // For showing the date pickers
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // Helper to format dates for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // --- C R E A T E / U P D A T E ---
  const handleAddOrUpdateTrip = () => {
    if (destination.trim() === '') {
      Alert.alert('Error', 'Destination cannot be empty!');
      return;
    }
    if (startDate > endDate) {
      Alert.alert('Error', 'End date cannot be before start date!');
      return;
    }

    if (editingTripId) {
      // Logic for UPDATING an existing trip
      setTrips(
        trips.map((trip) =>
          trip.id === editingTripId
            ? { ...trip, destination, startDate: startDate.toISOString(), endDate: endDate.toISOString() }
            : trip
        )
      );
      Alert.alert('Success', 'Trip updated!');
    } else {
      // Logic for CREATING a new trip
      const newTrip = {
        id: Date.now().toString(), // Simple unique ID using timestamp
        destination,
        startDate: startDate.toISOString(), // Store as ISO string for consistency
        endDate: endDate.toISOString(),
      };
      setTrips([...trips, newTrip]);
      Alert.alert('Success', 'Trip added!');
    }

    // Clear form fields after add/update
    setDestination('');
    setStartDate(new Date());
    setEndDate(new Date());
    setEditingTripId(null);
  };

  // --- R E A D --- (Implicit in the FlatList rendering)

  // --- U P D A T E (for editing purposes) ---
  const handleEditTrip = (trip) => {
    setDestination(trip.destination);
    setStartDate(new Date(trip.startDate)); // Convert ISO string back to Date object
    setEndDate(new Date(trip.endDate));     // Convert ISO string back to Date object
    setEditingTripId(trip.id);
  };

  // --- D E L E T E ---
  const handleDeleteTrip = (id) => {
    Alert.alert(
      'Delete Trip',
      'Are you sure you want to delete this trip?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => {
            setTrips(trips.filter((trip) => trip.id !== id));
            Alert.alert('Success', 'Trip deleted!');
            // If deleting the trip currently being edited, clear the form
            if (editingTripId === id) {
              setDestination('');
              setStartDate(new Date());
              setEndDate(new Date());
              setEditingTripId(null);
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  // DatePicker handlers
  const onChangeStartDate = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStartDatePicker(Platform.OS === 'ios');
    setStartDate(currentDate);
  };

  const onChangeEndDate = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEndDatePicker(Platform.OS === 'ios');
    setEndDate(currentDate);
  };

  // Render function for each trip item in the FlatList
  const renderTripItem = ({ item }) => (
    <View style={styles.tripItem}>
      <View style={styles.tripDetails}>
        <Text style={styles.tripDestination}>{item.destination}</Text>
        <Text style={styles.tripDates}>
          {formatDate(new Date(item.startDate))} -{' '}
          {formatDate(new Date(item.endDate))}
        </Text>
      </View>
      <View style={styles.tripButtons}>
        <TouchableOpacity
          onPress={() => handleEditTrip(item)}
          style={[styles.button, styles.editButton]}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDeleteTrip(item.id)}
          style={[styles.button, styles.deleteButton]}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 20}
    >
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.title}> Xyross Travel Planner</Text>

        {/* Trip Form */}
        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Destination (e.g., Paris)"
            value={destination}
            onChangeText={setDestination}
          />

          <View style={styles.datePickerRow}>
            <TouchableOpacity onPress={() => setShowStartDatePicker(true)} style={styles.dateButton}>
              <Text style={styles.dateButtonText}>Start Date: {formatDate(startDate)}</Text>
            </TouchableOpacity>
            {showStartDatePicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={onChangeStartDate}
              />
            )}

            <TouchableOpacity onPress={() => setShowEndDatePicker(true)} style={styles.dateButton}>
              <Text style={styles.dateButtonText}>End Date: {formatDate(endDate)}</Text>
            </TouchableOpacity>
            {showEndDatePicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display="default"
                onChange={onChangeEndDate}
              />
            )}
          </View>

          <TouchableOpacity
            onPress={handleAddOrUpdateTrip}
            style={styles.addButton}
          >
            <Text style={styles.addButtonText}>
              {editingTripId ? 'Update Trip' : 'Add Trip'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Trip List */}
        <Text style={styles.listHeader}>My Trips</Text>
        <FlatList
          data={trips}
          renderItem={renderTripItem}
          keyExtractor={(item) => item.id}
          style={styles.tripList}
          ListEmptyComponent={
            <Text style={styles.emptyListText}>No trips planned yet! Add one above.</Text>
          }
          // Important for FlatList inside ScrollView: disable its own scrolling
          scrollEnabled={false}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa', // Light background
  },
  scrollViewContent: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30, // Add some padding at the bottom
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 30,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  datePickerRow: {
    flexDirection: 'column', // Changed to column for better spacing
    marginBottom: 15,
  },
  dateButton: {
    backgroundColor: '#e9ecef', // Lighter grey for date buttons
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    alignItems: 'center',
    marginBottom: 10, // Space between date buttons
  },
  dateButtonText: {
    fontSize: 16,
    color: '#34495e',
    fontWeight: '500',
  },
  addButton: {
    backgroundColor: '#28a745', // Green for add/update
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  listHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    textAlign: 'center',
  },
  tripList: {
    flexGrow: 0, // Ensure FlatList doesn't try to take all available space within ScrollView
  },
  tripItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tripDetails: {
    flex: 1,
    marginRight: 10,
  },
  tripDestination: {
    fontSize: 19,
    fontWeight: '600',
    color: '#34495e',
    marginBottom: 5,
  },
  tripDates: {
    fontSize: 15,
    color: '#7f8c8d',
  },
  tripButtons: {
    flexDirection: 'row',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  editButton: {
    backgroundColor: '#ffc107', // Amber/Yellow
  },
  deleteButton: {
    backgroundColor: '#dc3545', // Red
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#888',
  },
});