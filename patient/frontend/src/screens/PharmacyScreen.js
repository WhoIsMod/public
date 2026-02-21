import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Text, Button, Chip, Searchbar, SegmentedButtons } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { pharmacyAPI } from '../services/api';
import { theme } from '../theme';

export default function PharmacyScreen() {
  const [medications, setMedications] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('medications');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [medsRes, presRes, ordersRes] = await Promise.all([
        pharmacyAPI.getMedications(),
        pharmacyAPI.getPrescriptions(),
        pharmacyAPI.getOrders(),
      ]);
      setMedications(medsRes.data.results || medsRes.data);
      setPrescriptions(presRes.data.results || presRes.data);
      setOrders(ordersRes.data.results || ordersRes.data);
    } catch (error) {
      console.error('Error loading pharmacy data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = async (medication) => {
    Alert.alert('Order Medication', `Order ${medication.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Order',
        onPress: async () => {
          try {
            await pharmacyAPI.createOrder({
              items: [{ medication: medication.id, quantity: 1 }],
              total_amount: medication.price.toString(),
              shipping_address: 'Patient Address',
            });
            Alert.alert('Success', 'Order placed successfully');
            loadData();
          } catch (error) {
            Alert.alert('Error', 'Failed to place order');
          }
        },
      },
    ]);
  };

  const filteredMedications = medications.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.generic_name && m.generic_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <SafeAreaView style={styles.container}>
      <SegmentedButtons
        value={activeTab}
        onValueChange={setActiveTab}
        buttons={[
          { value: 'medications', label: 'Medications' },
          { value: 'prescriptions', label: 'Prescriptions' },
          { value: 'orders', label: 'Orders' },
        ]}
        style={styles.segmented}
      />

      {activeTab === 'medications' && (
        <>
          <Searchbar
            placeholder="Search medications"
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchbar}
          />
          <ScrollView style={styles.scrollView}>
            {filteredMedications.map((med) => (
              <Card key={med.id} style={styles.card}>
                <Card.Content>
                  <Text style={styles.name}>{med.name}</Text>
                  {med.generic_name && (
                    <Text style={styles.generic}>{med.generic_name}</Text>
                  )}
                  <Text style={styles.description}>{med.description}</Text>
                  <Text style={styles.dosage}>Dosage: {med.dosage}</Text>
                  <View style={styles.footer}>
                    <Text style={styles.price}>P{med.price}</Text>
                    {med.requires_prescription && (
                      <Chip style={styles.prescriptionChip}>Prescription Required</Chip>
                    )}
                    <Button
                      mode="contained"
                      onPress={() => handleOrder(med)}
                      style={styles.orderButton}
                    >
                      Order
                    </Button>
                  </View>
                </Card.Content>
              </Card>
            ))}
          </ScrollView>
        </>
      )}

      {activeTab === 'prescriptions' && (
        <ScrollView style={styles.scrollView}>
          {prescriptions.map((pres) => (
            <Card key={pres.id} style={styles.card}>
              <Card.Content>
                <Text style={styles.name}>{pres.medication_details?.name}</Text>
                <Text style={styles.quantity}>Quantity: {pres.quantity}</Text>
                <Text style={styles.instructions}>{pres.instructions}</Text>
                <Text style={styles.prescribedBy}>Prescribed by: {pres.prescribed_by}</Text>
                <Chip style={styles.statusChip}>{pres.status}</Chip>
              </Card.Content>
            </Card>
          ))}
        </ScrollView>
      )}

      {activeTab === 'orders' && (
        <ScrollView style={styles.scrollView}>
          {orders.map((order) => (
            <Card key={order.id} style={styles.card}>
              <Card.Content>
                <Text style={styles.orderNumber}>Order #{order.order_number}</Text>
                <Text style={styles.total}>Total: P{order.total_amount}</Text>
                <Text style={styles.address}>{order.shipping_address}</Text>
                <Chip style={styles.statusChip}>{order.status}</Chip>
                <Text style={styles.date}>
                  {new Date(order.created_at).toLocaleDateString()}
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
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  generic: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  description: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
  dosage: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  prescriptionChip: {
    backgroundColor: theme.colors.warning,
  },
  orderButton: {
    marginLeft: theme.spacing.sm,
  },
  quantity: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  instructions: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
  prescribedBy: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  statusChip: {
    marginTop: theme.spacing.sm,
    alignSelf: 'flex-start',
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  total: {
    fontSize: 16,
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
  },
  address: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  date: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
});
