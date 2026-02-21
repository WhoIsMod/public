import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Text, Button, Chip, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { aiAPI, documentAPI } from '../services/api';
import { theme } from '../theme';

export default function AIInterpreterScreen() {
  const [documents, setDocuments] = useState([]);
  const [interpretations, setInterpretations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [interpreting, setInterpreting] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [docsRes, interpRes] = await Promise.all([
        documentAPI.getList(),
        aiAPI.getInterpretations(),
      ]);
      setDocuments(docsRes.data.results || docsRes.data);
      setInterpretations(interpRes.data.results || interpRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInterpret = async (documentId) => {
    setInterpreting(documentId);
    try {
      await aiAPI.interpret(documentId);
      Alert.alert('Success', 'Document interpretation completed');
      loadData();
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to interpret document');
    } finally {
      setInterpreting(null);
    }
  };

  const getInterpretationForDocument = (docId) => {
    return interpretations.find((i) => i.document === docId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Card style={styles.sectionCard}>
          <Card.Title title="Available Documents" />
          <Card.Content>
            {documents.map((doc) => {
              const interpretation = getInterpretationForDocument(doc.id);
              return (
                <Card key={doc.id} style={styles.documentCard}>
                  <Card.Content>
                    <Text style={styles.documentTitle}>{doc.title}</Text>
                    <Text style={styles.documentType}>{doc.document_type}</Text>
                    {interpretation ? (
                      <View style={styles.interpretationContainer}>
                        <Chip style={styles.interpretedChip}>Interpreted</Chip>
                        <Text style={styles.summary}>{interpretation.summary}</Text>
                        {interpretation.key_findings && interpretation.key_findings.length > 0 && (
                          <View style={styles.findingsContainer}>
                            <Text style={styles.findingsTitle}>Key Findings:</Text>
                            {interpretation.key_findings.map((finding, idx) => (
                              <Text key={idx} style={styles.finding}>• {finding}</Text>
                            ))}
                          </View>
                        )}
                        {interpretation.recommendations && interpretation.recommendations.length > 0 && (
                          <View style={styles.recommendationsContainer}>
                            <Text style={styles.recommendationsTitle}>Recommendations:</Text>
                            {interpretation.recommendations.map((rec, idx) => (
                              <Text key={idx} style={styles.recommendation}>• {rec}</Text>
                            ))}
                          </View>
                        )}
                        {interpretation.confidence_score && (
                          <Text style={styles.confidence}>
                            Confidence: {(interpretation.confidence_score * 100).toFixed(1)}%
                          </Text>
                        )}
                      </View>
                    ) : (
                      <Button
                        mode="contained"
                        onPress={() => handleInterpret(doc.id)}
                        loading={interpreting === doc.id}
                        style={styles.interpretButton}
                      >
                        Interpret with AI
                      </Button>
                    )}
                  </Card.Content>
                </Card>
              );
            })}
          </Card.Content>
        </Card>

        {documents.length === 0 && (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyText}>No documents available for interpretation</Text>
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
  sectionCard: {
    margin: theme.spacing.md,
    elevation: 2,
  },
  documentCard: {
    marginBottom: theme.spacing.md,
    elevation: 1,
  },
  documentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  documentType: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  interpretationContainer: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
  },
  interpretedChip: {
    backgroundColor: theme.colors.success,
    marginBottom: theme.spacing.sm,
    alignSelf: 'flex-start',
  },
  summary: {
    fontSize: 14,
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
    lineHeight: 20,
  },
  findingsContainer: {
    marginTop: theme.spacing.md,
  },
  findingsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  finding: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  recommendationsContainer: {
    marginTop: theme.spacing.md,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  recommendation: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  confidence: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
    fontStyle: 'italic',
  },
  interpretButton: {
    marginTop: theme.spacing.md,
  },
  emptyCard: {
    margin: theme.spacing.md,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
  },
});
