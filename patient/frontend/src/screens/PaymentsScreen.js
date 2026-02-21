import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Text, Button, Chip, SegmentedButtons } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { paymentAPI } from '../services/api';
import { theme } from '../theme';

export default function PaymentsScreen() {
  const [bills, setBills] = useState([]);
  const [payments, setPayments] = useState([]);
  const [activeTab, setActiveTab] = useState('bills');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [billsRes, paymentsRes] = await Promise.all([
        paymentAPI.getBills(),
        paymentAPI.getPayments(),
      ]);
      setBills(billsRes.data.results || billsRes.data);
      setPayments(paymentsRes.data.results || paymentsRes.data);
    } catch (error) {
      console.error('Error loading payment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (bill) => {
    Alert.alert('Process Payment', `Pay P${bill.total_amount}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Pay',
        onPress: async () => {
          try {
            await paymentAPI.processPayment(bill.id, {
              payment_method: 'CARD',
              transaction_id: `TXN-${Date.now()}`,
            });
            Alert.alert('Success', 'Payment processed successfully');
            loadData();
          } catch (error) {
            Alert.alert('Error', 'Failed to process payment');
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <SegmentedButtons
        value={activeTab}
        onValueChange={setActiveTab}
        buttons={[
          { value: 'bills', label: 'Bills' },
          { value: 'payments', label: 'Payments' },
        ]}
        style={styles.segmented}
      />

      {activeTab === 'bills' && (
        <ScrollView style={styles.scrollView}>
          {bills.map((bill) => (
            <Card key={bill.id} style={styles.card}>
              <Card.Content>
                <View style={styles.header}>
                  <Text style={styles.billNumber}>Bill #{bill.bill_number}</Text>
                  <Chip
                    style={[
                      styles.statusChip,
                      bill.status === 'PAID' && { backgroundColor: theme.colors.success },
                      bill.status === 'OVERDUE' && { backgroundColor: theme.colors.error },
                    ]}
                  >
                    {bill.status}
                  </Chip>
                </View>
                <Text style={styles.type}>{bill.bill_type}</Text>
                <Text style={styles.description}>{bill.description}</Text>
                <View style={styles.amountContainer}>
                  <Text style={styles.amount}>P{bill.total_amount}</Text>
                  {bill.status === 'PENDING' && (
                    <Button
                      mode="contained"
                      onPress={() => handlePayment(bill)}
                      style={styles.payButton}
                    >
                      Pay Now
                    </Button>
                  )}
                </View>
                <Text style={styles.dueDate}>
                  Due: {new Date(bill.due_date).toLocaleDateString()}
                </Text>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      )}

      {activeTab === 'payments' && (
        <ScrollView style={styles.scrollView}>
          {payments.map((payment) => (
            <Card key={payment.id} style={styles.card}>
              <Card.Content>
                <Text style={styles.paymentNumber}>Payment #{payment.payment_number}</Text>
                <Text style={styles.billNumber}>
                  Bill: {payment.bill_details?.bill_number}
                </Text>
                <Text style={styles.amount}>P{payment.amount}</Text>
                <Text style={styles.method}>Method: {payment.payment_method}</Text>
                <Chip
                  style={[
                    styles.statusChip,
                    payment.status === 'COMPLETED' && { backgroundColor: theme.colors.success },
                  ]}
                >
                  {payment.status}
                </Chip>
                <Text style={styles.date}>
                  {new Date(payment.payment_date).toLocaleDateString()}
                </Text>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  segmented: {
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
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  billNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  paymentNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  type: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  description: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  payButton: {
    marginLeft: theme.spacing.sm,
  },
  dueDate: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  method: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  statusChip: {
    marginTop: theme.spacing.sm,
    alignSelf: 'flex-start',
  },
  date: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
});
