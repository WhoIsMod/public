import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Text, Button, Avatar, TextInput, Dialog, Portal } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { theme } from '../theme';

export default function ProfileScreen() {
  const { user, signOut } = useContext(AuthContext);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    cellphone: user?.cellphone || '',
    medical_aid: user?.medical_aid || '',
    medical_aid_number: user?.medical_aid_number || '',
    next_of_kin_name: user?.next_of_kin_name || '',
    next_of_kin_contact: user?.next_of_kin_contact || '',
    location: user?.location || '',
    address: user?.address || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await authAPI.updateProfile(formData);
      Alert.alert('Success', 'Profile updated successfully');
      setEditMode(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', onPress: signOut },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Card style={styles.profileCard}>
          <Card.Content style={styles.profileContent}>
            <Avatar.Text
              size={80}
              label={`${user?.first_name?.[0] || ''}${user?.last_name?.[0] || ''}`}
              style={styles.avatar}
            />
            <Text style={styles.name}>
              {user?.first_name} {user?.last_name}
            </Text>
            <Text style={styles.omang}>OMANG: {user?.omang}</Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Personal Information" />
          <Card.Content>
            {editMode ? (
              <>
                <TextInput
                  label="First Name"
                  value={formData.first_name}
                  onChangeText={(value) => setFormData({ ...formData, first_name: value })}
                  mode="outlined"
                  style={styles.input}
                />
                <TextInput
                  label="Last Name"
                  value={formData.last_name}
                  onChangeText={(value) => setFormData({ ...formData, last_name: value })}
                  mode="outlined"
                  style={styles.input}
                />
                <TextInput
                  label="Email"
                  value={formData.email}
                  onChangeText={(value) => setFormData({ ...formData, email: value })}
                  mode="outlined"
                  keyboardType="email-address"
                  style={styles.input}
                />
                <TextInput
                  label="Cellphone"
                  value={formData.cellphone}
                  onChangeText={(value) => setFormData({ ...formData, cellphone: value })}
                  mode="outlined"
                  keyboardType="phone-pad"
                  style={styles.input}
                />
                <TextInput
                  label="Medical Aid"
                  value={formData.medical_aid}
                  onChangeText={(value) => setFormData({ ...formData, medical_aid: value })}
                  mode="outlined"
                  style={styles.input}
                />
                <TextInput
                  label="Medical Aid Number"
                  value={formData.medical_aid_number}
                  onChangeText={(value) => setFormData({ ...formData, medical_aid_number: value })}
                  mode="outlined"
                  style={styles.input}
                />
                <TextInput
                  label="Next of Kin Name"
                  value={formData.next_of_kin_name}
                  onChangeText={(value) => setFormData({ ...formData, next_of_kin_name: value })}
                  mode="outlined"
                  style={styles.input}
                />
                <TextInput
                  label="Next of Kin Contact"
                  value={formData.next_of_kin_contact}
                  onChangeText={(value) => setFormData({ ...formData, next_of_kin_contact: value })}
                  mode="outlined"
                  keyboardType="phone-pad"
                  style={styles.input}
                />
                <TextInput
                  label="Location"
                  value={formData.location}
                  onChangeText={(value) => setFormData({ ...formData, location: value })}
                  mode="outlined"
                  style={styles.input}
                />
                <TextInput
                  label="Address"
                  value={formData.address}
                  onChangeText={(value) => setFormData({ ...formData, address: value })}
                  mode="outlined"
                  multiline
                  numberOfLines={3}
                  style={styles.input}
                />
                <Button
                  mode="contained"
                  onPress={handleSave}
                  loading={loading}
                  style={styles.saveButton}
                >
                  Save
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => setEditMode(false)}
                  style={styles.cancelButton}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Email:</Text>
                  <Text style={styles.value}>{user?.email || 'N/A'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Cellphone:</Text>
                  <Text style={styles.value}>{user?.cellphone || 'N/A'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Medical Aid:</Text>
                  <Text style={styles.value}>{user?.medical_aid || 'N/A'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Next of Kin:</Text>
                  <Text style={styles.value}>{user?.next_of_kin_name || 'N/A'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Location:</Text>
                  <Text style={styles.value}>{user?.location || 'N/A'}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Address:</Text>
                  <Text style={styles.value}>{user?.address || 'N/A'}</Text>
                </View>
                <Button
                  mode="contained"
                  onPress={() => setEditMode(true)}
                  style={styles.editButton}
                >
                  Edit Profile
                </Button>
              </>
            )}
          </Card.Content>
        </Card>

        <Button
          mode="outlined"
          onPress={handleLogout}
          style={styles.logoutButton}
          textColor={theme.colors.error}
        >
          Logout
        </Button>
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
  profileCard: {
    margin: theme.spacing.md,
    elevation: 2,
  },
  profileContent: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  avatar: {
    marginBottom: theme.spacing.md,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
  },
  omang: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  card: {
    margin: theme.spacing.md,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  value: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    flex: 1,
    textAlign: 'right',
  },
  input: {
    marginBottom: theme.spacing.sm,
  },
  editButton: {
    marginTop: theme.spacing.md,
  },
  saveButton: {
    marginTop: theme.spacing.md,
  },
  cancelButton: {
    marginTop: theme.spacing.sm,
  },
  logoutButton: {
    margin: theme.spacing.md,
    borderColor: theme.colors.error,
  },
});
