import React, { useState, useEffect, useCallback } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { CheckCircle, AlertCircle, X, ChevronLeft } from 'lucide-react-native';
import { appColors } from '../../../utils/appColors';
import { useAppSelector } from '../../../redux/hooks';
import screenNames from '../../../routes/routes';
import type { RootNavigationProp } from '../../../utils/types';
import {
  fetchSoldVehicles,
  fetchPendingVehicles,
  markVehicleAsSold,
} from './lib/api';
import { calculateStats } from './lib/utils';
import { generateInvoiceHTMLForView } from './lib/invoiceDownload';
import type { Vehicle, BuyerInfo } from './lib/types';
import StatsCards from './components/StatsCards';
import InvoiceList from './components/InvoiceList';
import MarkSoldModal from './components/MarkSoldModal';
import InvoiceViewModal from './components/InvoiceViewModal';
import { styles } from './styles';

export default function AdminInvoices() {
  const navigation = useNavigation<RootNavigationProp>();
  const currentUser = useAppSelector(state => state.profile.user);
  const [soldVehicles, setSoldVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [showSoldModal, setShowSoldModal] = useState(false);
  const [vehicleToMarkSold, setVehicleToMarkSold] = useState<Vehicle | null>(null);
  const [buyerInfo, setBuyerInfo] = useState<BuyerInfo>({
    winnerName: '',
    winnerEmail: '',
    winnerPhone: '',
  });
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceHTML, setInvoiceHTML] = useState('');

  const loadSoldVehicles = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const vehicles = await fetchSoldVehicles();
      setSoldVehicles(vehicles);
    } catch (err: any) {
      console.error('Failed to fetch sold vehicles:', err);
      setError('Failed to load invoices');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (currentUser && [0, 1, 2].includes(currentUser.role as number)) {
        loadSoldVehicles();
      } else {
        navigation.navigate(screenNames.authentication);
      }
    }, [currentUser, loadSoldVehicles, navigation]),
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadSoldVehicles();
  }, [loadSoldVehicles]);

  const handleMarkAsSoldClick = async () => {
    try {
      const pendingVehicles = await fetchPendingVehicles();
      if (pendingVehicles.length > 0) {
        setVehicleToMarkSold(pendingVehicles[0]);
        setBuyerInfo({
          winnerName: '',
          winnerEmail: '',
          winnerPhone: '',
        });
        setShowSoldModal(true);
      } else {
        setError('No pending vehicles available to mark as sold');
      }
    } catch (err) {
      console.error('Failed to fetch pending vehicles:', err);
      setError('Failed to load pending vehicles');
    }
  };

  const handleMarkAsSold = async () => {
    if (!vehicleToMarkSold) return;

    try {
      await markVehicleAsSold(vehicleToMarkSold._id, buyerInfo);
      setShowSoldModal(false);
      setVehicleToMarkSold(null);
      setBuyerInfo({
        winnerName: '',
        winnerEmail: '',
        winnerPhone: '',
      });
      await loadSoldVehicles();
    } catch (err: any) {
      console.error('Failed to mark vehicle as sold:', err);
      Alert.alert('Error', 'Failed to mark vehicle as sold');
    }
  };

  const handleDownloadInvoice = (vehicle: Vehicle) => {
    const html = generateInvoiceHTMLForView(vehicle);
    setInvoiceHTML(html);
    setShowInvoiceModal(true);
  };

  const stats = calculateStats(soldVehicles);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <ChevronLeft size={24} color={appColors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerLabel}>Invoices</Text>
            <Text style={styles.headerTitle}>Vehicle Invoices</Text>
            <Text style={styles.headerSubtitle}>
              Manage and download invoices for all sold vehicles
            </Text>
          </View>
          <TouchableOpacity
            style={styles.markSoldButton}
            onPress={handleMarkAsSoldClick}
            activeOpacity={0.7}
          >
            <CheckCircle size={16} color={appColors.green} />
            <Text style={[styles.markSoldButtonText, { marginLeft: 8 }]}>Mark as Sold</Text>
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <AlertCircle size={20} color={appColors.red} />
            <View style={styles.errorContent}>
              <Text style={styles.errorTitle}>Error</Text>
              <Text style={styles.errorText}>{error}</Text>
            </View>
            <TouchableOpacity onPress={() => setError('')}>
              <X size={20} color={appColors.red} />
            </TouchableOpacity>
          </View>
        )}

        <StatsCards stats={stats} />

        <View style={styles.invoicesSection}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Invoice Records</Text>
              <Text style={styles.sectionSubtitle}>
                Download professional invoices for sold vehicles
              </Text>
            </View>
            <View style={styles.invoiceCount}>
              <Text style={styles.invoiceCountText}>{soldVehicles.length} Invoices</Text>
            </View>
          </View>

          <InvoiceList
            vehicles={soldVehicles}
            loading={loading}
            onDownload={handleDownloadInvoice}
          />
        </View>
      </ScrollView>

      <MarkSoldModal
        visible={showSoldModal}
        vehicle={vehicleToMarkSold}
        buyerInfo={buyerInfo}
        onClose={() => {
          setShowSoldModal(false);
          setVehicleToMarkSold(null);
        }}
        onConfirm={handleMarkAsSold}
        onBuyerInfoChange={setBuyerInfo}
      />

      <InvoiceViewModal
        visible={showInvoiceModal}
        htmlContent={invoiceHTML}
        onClose={() => setShowInvoiceModal(false)}
      />
    </SafeAreaView>
  );
}
