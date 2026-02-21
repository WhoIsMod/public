import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Button, Text, FAB, Dialog, Portal, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { appointmentAPI, staffAPI } from '../services/api';
import { theme } from '../theme';

export default function AppointmentsScreen() {
  const [appointments, setAppointments] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState({
    staff: '',
    appointment_date: new Date(),
    duration_minutes: '30',
    reason: '',
  });

  useEffect(() => {
    loadAppointments();
    loadStaff();
  }, []);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const response = await appointmentAPI.getList();
      setAppointments(response.data.results || response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const loadStaff = async () => {
    try {
      const response = await staffAPI.getList();
      setStaffList(response.data.results || response.data);
    } catch (error) {
      console.error('Error loading staff:', error);
    }
  };

  const handleSubmit = async () => {
    if (!formData.staff || !formData.reason) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await appointmentAPI.create({
        staff: formData.staff,
        appointment_date: formData.appointment_date.toISOString(),
        duration_minutes: parseInt(formData.duration_minutes),
        reason: formData.reason,
      });
      Alert.alert('Success', 'Appointment booked successfully');
      setDialogVisible(false);
      resetForm();
      loadAppointments();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    Alert.alert('Cancel Appointment', 'Are you sure you want to cancel this appointment?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            await appointmentAPI.cancel(id);
            loadAppointments();
          } catch (error) {
            Alert.alert('Error', 'Failed to cancel appointment');
          }
        },
      },
    ]);
  };

  const resetForm = () => {
    setFormData({
      staff: '',
      appointment_date: new Date(),
      duration_minutes: '30',
      reason: '',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {appointments.map((apt) => (
          <Card key={apt.id} style={styles.card}>
            <Card.Content>
              <Text style={styles.date}>
                {new Date(apt.appointment_date).toLocaleDateString()} at{' '}
                {new Date(apt.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
              <Text style={styles.staff}>{apt.staff_details?.name}</Text>
              <Text style={styles.specialty}>{apt.staff_details?.specialty}</Text>
              <Text style={styles.reason}>{apt.reason}</Text>
              <View style={styles.statusContainer}>
                <Text style={[styles.status, { color: apt.status === 'CONFIRMED' ? theme.colors.success : theme.colors.warning }]}>
                  {apt.status}
                </Text>
                {apt.status !== 'CANCELLED' && apt.status !== 'COMPLETED' && (
                  <Button mode="outlined" onPress={() => handleCancel(apt.id)}>
                    Cancel
                  </Button>
                )}
              </View>
            </Card.Content>
          </Card>
        ))}

        {appointments.length === 0 && (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyText}>No appointments found</Text>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Book Appointment</Dialog.Title>
          <Dialog.Content>
            <ScrollView>
              <TextInput
                label="Select Staff"
                value={formData.staff}
                onChangeText={(value) => setFormData({ ...formData, staff: value })}
                mode="outlined"
                style={styles.input}
                placeholder="Enter staff ID"
              />
              <Button
                mode="outlined"
                onPress={() => setShowDatePicker(true)}
                style={styles.input}
              >
                {formData.appointment_date.toLocaleString()}
              </Button>
              {showDatePicker && (
                <DateTimePicker
                  value={formData.appointment_date}
                  mode="datetime"
                  onChange={(event, date) => {
                    setShowDatePicker(false);
                    if (date) setFormData({ ...formData, appointment_date: date });
                  }}
                />
              )}
              <TextInput
                label="Duration (minutes)"
                value={formData.duration_minutes}
                onChangeText={(value) => setFormData({ ...formData, duration_minutes: value })}
                mode="outlined"
                keyboardType="numeric"
                style={styles.input}
              />
              <TextInput
                label="Reason"
                value={formData.reason}
                onChangeText={(value) => setFormData({ ...formData, reason: value })}
                mode="outlined"
                multiline
                numberOfLines={4}
                style={styles.input}
              />
            </ScrollView>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleSubmit} loading={loading}>Book</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <FAB icon="plus" style={styles.fab} onPress={() => setDialogVisible(true)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: theme.spacing.md,
    elevation: 2,
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  staff: {
    fontSize: 16,
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
  },
  specialty: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  reason: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyCard: {
    margin: theme.spacing.md,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
  },
  input: {
    marginBottom: theme.spacing.sm,
  },
  fab: {
    position: 'absolute',
    margin: theme.spacing.md,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});
