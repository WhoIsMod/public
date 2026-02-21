import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, TextInput, Button, Text, Chip, FAB, Dialog, Portal } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { medicalAPI } from '../services/api';
import { theme } from '../theme';

export default function MedicalDataScreen() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [formData, setFormData] = useState({
    record_id: '',
    heart_rate: '',
    underlying_condition: '',
    chronic_illness: '',
    features: '',
    race: '',
    sex: '',
    blood_pressure_systolic: '',
    blood_pressure_diastolic: '',
    temperature: '',
    weight: '',
    height: '',
    notes: '',
  });

  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    setLoading(true);
    try {
      const response = await medicalAPI.getRecords();
      setRecords(response.data.results || response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load medical records');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.record_id) {
      Alert.alert('Error', 'Record ID is required');
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        heart_rate: formData.heart_rate ? parseInt(formData.heart_rate) : null,
        blood_pressure_systolic: formData.blood_pressure_systolic ? parseInt(formData.blood_pressure_systolic) : null,
        blood_pressure_diastolic: formData.blood_pressure_diastolic ? parseInt(formData.blood_pressure_diastolic) : null,
        temperature: formData.temperature ? parseFloat(formData.temperature) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        height: formData.height ? parseFloat(formData.height) : null,
      };

      await medicalAPI.createRecord(submitData);
      Alert.alert('Success', 'Medical record created successfully');
      setDialogVisible(false);
      resetForm();
      loadRecords();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to create record');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      record_id: '',
      heart_rate: '',
      underlying_condition: '',
      chronic_illness: '',
      features: '',
      race: '',
      sex: '',
      blood_pressure_systolic: '',
      blood_pressure_diastolic: '',
      temperature: '',
      weight: '',
      height: '',
      notes: '',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {records.map((record) => (
          <Card key={record.id} style={styles.card}>
            <Card.Content>
              <View style={styles.cardHeader}>
                <Text style={styles.patientId}>ID: {record.record_id}</Text>
                <Chip>{record.status || 'Active'}</Chip>
              </View>
              {record.heart_rate && (
                <Text style={styles.info}>Heart Rate: {record.heart_rate} bpm</Text>
              )}
              {record.chronic_illness && (
                <Text style={styles.info}>Chronic Illness: {record.chronic_illness}</Text>
              )}
              {record.race && (
                <Text style={styles.info}>Race: {record.race}</Text>
              )}
              {record.sex && (
                <Text style={styles.info}>Sex: {record.sex}</Text>
              )}
              {record.underlying_condition && (
                <Text style={styles.info}>Condition: {record.underlying_condition}</Text>
              )}
              <Text style={styles.date}>
                {new Date(record.created_at).toLocaleDateString()}
              </Text>
            </Card.Content>
          </Card>
        ))}

        {records.length === 0 && (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyText}>No medical records found</Text>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Add Medical Record</Dialog.Title>
          <Dialog.Content>
            <ScrollView>
              <TextInput
                label="Record ID *"
                value={formData.record_id}
                onChangeText={(value) => setFormData({ ...formData, record_id: value })}
                mode="outlined"
                style={styles.input}
              />
              <TextInput
                label="Heart Rate"
                value={formData.heart_rate}
                onChangeText={(value) => setFormData({ ...formData, heart_rate: value })}
                mode="outlined"
                keyboardType="numeric"
                style={styles.input}
              />
              <TextInput
                label="Chronic Illness"
                value={formData.chronic_illness}
                onChangeText={(value) => setFormData({ ...formData, chronic_illness: value })}
                mode="outlined"
                style={styles.input}
              />
              <TextInput
                label="Underlying Condition"
                value={formData.underlying_condition}
                onChangeText={(value) => setFormData({ ...formData, underlying_condition: value })}
                mode="outlined"
                multiline
                style={styles.input}
              />
              <TextInput
                label="Features"
                value={formData.features}
                onChangeText={(value) => setFormData({ ...formData, features: value })}
                mode="outlined"
                multiline
                style={styles.input}
              />
              <View style={styles.buttonRow}>
                <Button mode={formData.race === 'AFRICAN' ? 'contained' : 'outlined'} onPress={() => setFormData({ ...formData, race: 'AFRICAN' })} style={styles.raceButton}>African</Button>
                <Button mode={formData.race === 'CAUCASIAN' ? 'contained' : 'outlined'} onPress={() => setFormData({ ...formData, race: 'CAUCASIAN' })} style={styles.raceButton}>Caucasian</Button>
                <Button mode={formData.race === 'ASIAN' ? 'contained' : 'outlined'} onPress={() => setFormData({ ...formData, race: 'ASIAN' })} style={styles.raceButton}>Asian</Button>
              </View>
              <View style={styles.buttonRow}>
                <Button mode={formData.race === 'MIXED' ? 'contained' : 'outlined'} onPress={() => setFormData({ ...formData, race: 'MIXED' })} style={styles.raceButton}>Mixed</Button>
                <Button mode={formData.race === 'OTHER' ? 'contained' : 'outlined'} onPress={() => setFormData({ ...formData, race: 'OTHER' })} style={styles.raceButton}>Other</Button>
              </View>
              <View style={styles.buttonRow}>
                <Button mode={formData.sex === 'M' ? 'contained' : 'outlined'} onPress={() => setFormData({ ...formData, sex: 'M' })} style={styles.sexButton}>Male</Button>
                <Button mode={formData.sex === 'F' ? 'contained' : 'outlined'} onPress={() => setFormData({ ...formData, sex: 'F' })} style={styles.sexButton}>Female</Button>
                <Button mode={formData.sex === 'O' ? 'contained' : 'outlined'} onPress={() => setFormData({ ...formData, sex: 'O' })} style={styles.sexButton}>Other</Button>
              </View>
              <TextInput
                label="Blood Pressure (Systolic)"
                value={formData.blood_pressure_systolic}
                onChangeText={(value) => setFormData({ ...formData, blood_pressure_systolic: value })}
                mode="outlined"
                keyboardType="numeric"
                style={styles.input}
              />
              <TextInput
                label="Blood Pressure (Diastolic)"
                value={formData.blood_pressure_diastolic}
                onChangeText={(value) => setFormData({ ...formData, blood_pressure_diastolic: value })}
                mode="outlined"
                keyboardType="numeric"
                style={styles.input}
              />
              <TextInput
                label="Temperature"
                value={formData.temperature}
                onChangeText={(value) => setFormData({ ...formData, temperature: value })}
                mode="outlined"
                keyboardType="decimal-pad"
                style={styles.input}
              />
              <TextInput
                label="Weight (kg)"
                value={formData.weight}
                onChangeText={(value) => setFormData({ ...formData, weight: value })}
                mode="outlined"
                keyboardType="decimal-pad"
                style={styles.input}
              />
              <TextInput
                label="Height (cm)"
                value={formData.height}
                onChangeText={(value) => setFormData({ ...formData, height: value })}
                mode="outlined"
                keyboardType="decimal-pad"
                style={styles.input}
              />
              <TextInput
                label="Notes"
                value={formData.notes}
                onChangeText={(value) => setFormData({ ...formData, notes: value })}
                mode="outlined"
                multiline
                numberOfLines={3}
                style={styles.input}
              />
            </ScrollView>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
            <Button onPress={handleSubmit} loading={loading}>Submit</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setDialogVisible(true)}
      />
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  patientId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  info: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  date: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
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
  buttonRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
    justifyContent: 'space-between',
  },
  raceButton: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  sexButton: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  fab: {
    position: 'absolute',
    margin: theme.spacing.md,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});
