import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Text, Button, FAB, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import { documentAPI } from '../services/api';
import { theme } from '../theme';

export default function DocumentsScreen() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const response = await documentAPI.getList();
      setDocuments(response.data.results || response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (result.type === 'success') {
        const formData = new FormData();
        formData.append('file', {
          uri: result.uri,
          type: result.mimeType,
          name: result.name,
        });
        formData.append('title', result.name);
        formData.append('document_type', 'OTHER');
        formData.append('description', 'Uploaded document');

        await documentAPI.upload(formData);
        Alert.alert('Success', 'Document uploaded successfully');
        loadDocuments();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload document');
    }
  };

  const handleDownload = async (id, title) => {
    try {
      const response = await documentAPI.download(id);
      Alert.alert('Success', `Downloaded ${title}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to download document');
    }
  };

  const handleDelete = async (id) => {
    Alert.alert('Delete Document', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            await documentAPI.delete(id);
            Alert.alert('Success', 'Document deleted');
            loadDocuments();
          } catch (error) {
            Alert.alert('Error', 'Failed to delete document');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {documents.map((doc) => (
          <Card key={doc.id} style={styles.card}>
            <Card.Content>
              <View style={styles.header}>
                <Text style={styles.title}>{doc.title}</Text>
                <Chip style={styles.typeChip}>{doc.document_type}</Chip>
              </View>
              {doc.description && (
                <Text style={styles.description}>{doc.description}</Text>
              )}
              {doc.date_issued && (
                <Text style={styles.date}>
                  Issued: {new Date(doc.date_issued).toLocaleDateString()}
                </Text>
              )}
              <View style={styles.actions}>
                <Button
                  mode="outlined"
                  onPress={() => handleDownload(doc.id, doc.title)}
                  style={styles.actionButton}
                >
                  Download
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => handleDelete(doc.id)}
                  style={styles.actionButton}
                >
                  Delete
                </Button>
              </View>
            </Card.Content>
          </Card>
        ))}

        {documents.length === 0 && (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyText}>No documents found</Text>
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      <FAB icon="upload" style={styles.fab} onPress={handleUpload} />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    flex: 1,
  },
  typeChip: {
    marginLeft: theme.spacing.sm,
  },
  description: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  date: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    marginTop: theme.spacing.sm,
  },
  actionButton: {
    marginRight: theme.spacing.sm,
  },
  emptyCard: {
    margin: theme.spacing.md,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
  },
  fab: {
    position: 'absolute',
    margin: theme.spacing.md,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});
