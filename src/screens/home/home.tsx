import React from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './styles';
import { appColors } from '../../utils/appColors';
import type { RootNavigationProp } from '../../utils/types';
import screenNames from '../../routes/routes';
import { Header } from '../../components';

const featuredAuctions = [
  {
    id: '1',
    title: 'Vintage Rolex Submariner',
    currentBid: '$5,200',
    endsIn: '2h 14m',
  },
  {
    id: '2',
    title: 'Tesla Model 3 Performance',
    currentBid: '$38,900',
    endsIn: '5h 03m',
  },
  {
    id: '3',
    title: 'MacBook Pro 16" M3 Max',
    currentBid: '$2,450',
    endsIn: '1d 3h',
  },
];

export default function Home() {
  const navigation = useNavigation<RootNavigationProp>();

  const handleGoToProfile = () => {
    navigation.navigate(screenNames.profile);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header titleKey="home.title" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header row inside content */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>Bidder</Text>
          </View>
          <TouchableOpacity
            style={styles.avatar}
            activeOpacity={0.8}
            onPress={handleGoToProfile}
          >
            <Text style={styles.avatarText}>B</Text>
          </TouchableOpacity>
        </View>

        {/* Balance / summary */}
        <View style={styles.summaryCard}>
          <View>
            <Text style={styles.summaryLabel}>Available balance</Text>
            <Text style={styles.summaryValue}>$12,350.00</Text>
          </View>
          <View style={styles.summaryRight}>
            <Text style={styles.summaryLabel}>Active bids</Text>
            <Text style={styles.summaryValue}>3</Text>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Categories</Text>
        </View>
        <View style={styles.chipRow}>
          <View style={[styles.chip, styles.chipActive]}>
            <Text style={[styles.chipText, styles.chipTextActive]}>All</Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipText}>Cars</Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipText}>Watches</Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipText}>Electronics</Text>
          </View>
        </View>

        {/* Featured auctions */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Featured auctions</Text>
          <Text style={styles.sectionLink}>See all</Text>
        </View>

        <FlatList
          data={featuredAuctions}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <View style={styles.cardRow}>
                  <View>
                    <Text style={styles.cardLabel}>Current bid</Text>
                    <Text style={styles.cardValue}>{item.currentBid}</Text>
                  </View>
                  <View style={styles.cardRight}>
                    <Text style={styles.cardLabel}>Ends in</Text>
                    <Text style={styles.cardValue}>{item.endsIn}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
          scrollEnabled={false}
          contentContainerStyle={styles.listContent}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
