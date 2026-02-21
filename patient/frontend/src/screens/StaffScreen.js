import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Chip, Searchbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { staffAPI } from '../services/api';
import { theme } from '../theme';

export default function StaffScreen() {
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStaff();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = staff.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStaff(filtered);
    } else {
      setFilteredStaff(staff);
    }
  }, [searchQuery, staff]);

  const loadStaff = async () => {
    setLoading(true);
    try {
      const response = await staffAPI.getList();
      const staffList = response.data.results || response.data;
      setStaff(staffList);
      setFilteredStaff(staffList);
    } catch (error) {
      console.error('Error loading staff:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Searchbar
        placeholder="Search staff by name, specialty, or department"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />
      <ScrollView style={styles.scrollView}>
        {filteredStaff.map((member) => (
          <Card key={member.id} style={styles.card}>
            <Card.Content>
              <View style={styles.header}>
                <View style={styles.info}>
                  <Text style={styles.name}>{member.name}</Text>
                  <Chip style={styles.chip}>{member.specialty}</Chip>
                </View>
                {member.is_available && (
                  <Chip style={styles.availableChip}>Available</Chip>
                )}
              </View>
              <Text style={styles.department}>{member.department}</Text>
              <Text style={styles.qualification}>{member.qualification}</Text>
              {member.bio && <Text style={styles.bio}>{member.bio}</Text>}
              <View style={styles.contact}>
                <Text style={styles.contactText}>Email: {member.email}</Text>
                <Text style={styles.contactText}>Phone: {member.phone}</Text>
              </View>
            </Card.Content>
          </Card>
        ))}

        {filteredStaff.length === 0 && (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyText}>No staff members found</Text>
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
  searchbar: {
    margin: theme.spacing.md,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: theme.spacing.md,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  chip: {
    alignSelf: 'flex-start',
    marginTop: theme.spacing.xs,
  },
  availableChip: {
    backgroundColor: theme.colors.success,
  },
  department: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  qualification: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  bio: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
    fontStyle: 'italic',
  },
  contact: {
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.background,
  },
  contactText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  emptyCard: {
    margin: theme.spacing.md,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
  },
});
