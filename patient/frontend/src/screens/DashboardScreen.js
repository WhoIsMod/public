import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, Text, Button, Avatar, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AuthContext } from '../context/AuthContext';
import { medicalAPI, appointmentAPI, paymentAPI } from '../services/api';
import { theme } from '../theme';

export default function DashboardScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    medicalRecords: 0,
    appointments: 0,
    pendingBills: 0,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [recordsRes, appointmentsRes, billsRes] = await Promise.all([
        medicalAPI.getRecords(),
        appointmentAPI.getList(),
        paymentAPI.getBills(),
      ]);

      setStats({
        medicalRecords: recordsRes.data.results?.length || recordsRes.data.length || 0,
        appointments: appointmentsRes.data.results?.length || appointmentsRes.data.length || 0,
        pendingBills: billsRes.data.results?.filter(b => b.status === 'PENDING').length || 
                     billsRes.data.filter(b => b.status === 'PENDING').length || 0,
      });

      const appointments = appointmentsRes.data.results || appointmentsRes.data || [];
      const upcoming = appointments
        .filter(apt => apt.status === 'CONFIRMED' || apt.status === 'PENDING')
        .slice(0, 3);
      setUpcomingAppointments(upcoming);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <Avatar.Text size={64} label={`${user?.first_name?.[0] || ''}${user?.last_name?.[0] || ''}`} />
          <View style={styles.headerText}>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.name}>{user?.first_name} {user?.last_name}</Text>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content>
              <Icon name="medical-services" size={32} color={theme.colors.primary} />
              <Text style={styles.statNumber}>{stats.medicalRecords}</Text>
              <Text style={styles.statLabel}>Medical Records</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content>
              <Icon name="event" size={32} color={theme.colors.secondary} />
              <Text style={styles.statNumber}>{stats.appointments}</Text>
              <Text style={styles.statLabel}>Appointments</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content>
              <Icon name="payment" size={32} color={theme.colors.warning} />
              <Text style={styles.statNumber}>{stats.pendingBills}</Text>
              <Text style={styles.statLabel}>Pending Bills</Text>
            </Card.Content>
          </Card>
        </View>

        <Card style={styles.sectionCard}>
          <Card.Title title="Quick Actions" />
          <Card.Content>
            <Button
              mode="contained"
              icon="plus"
              onPress={() => navigation.navigate('Medical')}
              style={styles.actionButton}
            >
              Add Medical Record
            </Button>
            <Button
              mode="outlined"
              icon="event"
              onPress={() => navigation.navigate('Appointments')}
              style={styles.actionButton}
            >
              Book Appointment
            </Button>
            <Button
              mode="outlined"
              icon="description"
              onPress={() => navigation.navigate('Documents')}
              style={styles.actionButton}
            >
              Upload Document
            </Button>
          </Card.Content>
        </Card>

        {upcomingAppointments.length > 0 && (
          <Card style={styles.sectionCard}>
            <Card.Title title="Upcoming Appointments" />
            <Card.Content>
              {upcomingAppointments.map((apt) => (
                <View key={apt.id} style={styles.appointmentItem}>
                  <View style={styles.appointmentInfo}>
                    <Text style={styles.appointmentDate}>
                      {new Date(apt.appointment_date).toLocaleDateString()}
                    </Text>
                    <Text style={styles.appointmentTime}>
                      {new Date(apt.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                    <Text style={styles.appointmentStaff}>{apt.staff_details?.name}</Text>
                  </View>
                  <Chip>{apt.status}</Chip>
                </View>
              ))}
            </Card.Content>
          </Card>
        )}
      </ScrollView>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  headerText: {
    marginLeft: theme.spacing.md,
  },
  greeting: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  sectionCard: {
    margin: theme.spacing.md,
    elevation: 2,
  },
  actionButton: {
    marginBottom: theme.spacing.sm,
  },
  appointmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  appointmentTime: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  appointmentStaff: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
});
