import React, { useState, useContext } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Card, Snackbar } from 'react-native-paper';
import { AuthContext } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { theme } from '../theme';

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
    omang: '',
    cellphone: '',
    medical_aid: '',
    medical_aid_number: '',
    next_of_kin_name: '',
    next_of_kin_contact: '',
    location: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useContext(AuthContext);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleRegister = async () => {
    if (!formData.omang || !formData.password || !formData.first_name || !formData.last_name) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.password2) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { password2, ...registerData } = formData;
      await authAPI.register(registerData);
      const loginResponse = await authAPI.login({ omang: formData.omang, password: formData.password });
      await signIn(loginResponse.data.access, loginResponse.data.patient);
    } catch (err) {
      setError(err.response?.data?.error || Object.values(err.response?.data || {})[0]?.[0] || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>Register</Text>

            <TextInput
              label="First Name *"
              value={formData.first_name}
              onChangeText={(value) => handleChange('first_name', value)}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Last Name *"
              value={formData.last_name}
              onChangeText={(value) => handleChange('last_name', value)}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="OMANG *"
              value={formData.omang}
              onChangeText={(value) => handleChange('omang', value)}
              mode="outlined"
              keyboardType="numeric"
              style={styles.input}
            />

            <TextInput
              label="Cellphone *"
              value={formData.cellphone}
              onChangeText={(value) => handleChange('cellphone', value)}
              mode="outlined"
              keyboardType="phone-pad"
              style={styles.input}
            />

            <TextInput
              label="Email"
              value={formData.email}
              onChangeText={(value) => handleChange('email', value)}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />

            <TextInput
              label="Username"
              value={formData.username}
              onChangeText={(value) => handleChange('username', value)}
              mode="outlined"
              autoCapitalize="none"
              style={styles.input}
            />

            <TextInput
              label="Medical Aid"
              value={formData.medical_aid}
              onChangeText={(value) => handleChange('medical_aid', value)}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Medical Aid Number"
              value={formData.medical_aid_number}
              onChangeText={(value) => handleChange('medical_aid_number', value)}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Next of Kin Name *"
              value={formData.next_of_kin_name}
              onChangeText={(value) => handleChange('next_of_kin_name', value)}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Next of Kin Contact *"
              value={formData.next_of_kin_contact}
              onChangeText={(value) => handleChange('next_of_kin_contact', value)}
              mode="outlined"
              keyboardType="phone-pad"
              style={styles.input}
            />

            <TextInput
              label="Location *"
              value={formData.location}
              onChangeText={(value) => handleChange('location', value)}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Address *"
              value={formData.address}
              onChangeText={(value) => handleChange('address', value)}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.input}
            />

            <TextInput
              label="Password *"
              value={formData.password}
              onChangeText={(value) => handleChange('password', value)}
              mode="outlined"
              secureTextEntry
              style={styles.input}
            />

            <TextInput
              label="Confirm Password *"
              value={formData.password2}
              onChangeText={(value) => handleChange('password2', value)}
              mode="outlined"
              secureTextEntry
              style={styles.input}
            />

            <Button
              mode="contained"
              onPress={handleRegister}
              loading={loading}
              style={styles.button}
            >
              Register
            </Button>

            <Button
              mode="text"
              onPress={() => navigation.navigate('Login')}
              style={styles.linkButton}
            >
              Already have an account? Login
            </Button>
          </Card.Content>
        </Card>

        <Snackbar
          visible={!!error}
          onDismiss={() => setError('')}
          duration={3000}
        >
          {error}
        </Snackbar>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.md,
  },
  card: {
    elevation: 4,
    borderRadius: theme.borderRadius.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: theme.colors.primary,
    marginBottom: theme.spacing.lg,
  },
  input: {
    marginBottom: theme.spacing.sm,
  },
  button: {
    marginTop: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  linkButton: {
    marginTop: theme.spacing.sm,
  },
});
