import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Header, Input } from '../../components';
import { fetchFaqs, type FaqItem } from '../../api/support';
import { styles } from './styles';
import { appColors } from '../../utils/appColors';
import { showErrorToast } from '../../utils/methods';
import { useI18n } from '../../i18n';

function getFaqId(item: FaqItem, index: number) {
  const raw = item?._id ?? item?.id;
  if (raw == null) return `idx-${index}`;
  return String(raw);
}

function getFaqQuestion(item: FaqItem) {
  return item?.question ?? item?.title ?? '—';
}

function getFaqAnswer(item: FaqItem) {
  return item?.answer ?? item?.description ?? '';
}

export default function Faqs() {
  const { t } = useI18n();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const load = useCallback(async () => {
    setError(null);
    try {
      const data = await fetchFaqs();
      setFaqs(Array.isArray(data) ? data : []);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : 'Failed to load FAQs. Please try again.';
      setError(message);
      showErrorToast('Failed to load FAQs', message);
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await load();
      } finally {
        setLoading(false);
      }
    })();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await load();
    } finally {
      setRefreshing(false);
    }
  }, [load]);

  const filteredFaqs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return faqs;
    return faqs.filter(item => {
      const haystack = `${getFaqQuestion(item)} ${getFaqAnswer(item)}`
        .toLowerCase()
        .trim();
      return haystack.includes(q);
    });
  }, [faqs, query]);

  const emptyText = useMemo(() => {
    if (loading) return '';
    if (error) return t('faqs.emptyError');
    if (query.trim()) return `${t('faqs.noResults')} "${query.trim()}".`;
    return t('faqs.empty');
  }, [error, loading, query, t]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header titleKey="faqs.title" />

      <View style={styles.container}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="small" color={appColors.textPrimary} />
            <Text style={styles.loadingText}>{t('faqs.loading')}</Text>
          </View>
        ) : (
          <>
            <Input
              value={query}
              onChangeText={setQuery}
              placeholder={t('faqs.searchPlaceholder')}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
              clearButtonMode="while-editing"
            />

            <FlatList
              data={filteredFaqs}
              keyExtractor={(item, index) => getFaqId(item, index)}
              contentContainerStyle={[
                styles.listContent,
                filteredFaqs.length === 0 && styles.centerGrow,
              ]}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={appColors.textPrimary}
                />
              }
              ListEmptyComponent={
                <View style={styles.center}>
                  <Text style={styles.emptyText}>{emptyText}</Text>
                </View>
              }
              renderItem={({ item, index }) => {
                const id = getFaqId(item, index);
                const isExpanded = expandedId === id;
                const q = getFaqQuestion(item);
                const a = getFaqAnswer(item);

                return (
                  <View style={styles.card}>
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => setExpandedId(isExpanded ? null : id)}
                      style={styles.cardHeader}
                    >
                      <Text style={styles.question} numberOfLines={2}>
                        {q}
                      </Text>
                      <Text style={styles.chevron}>
                        {isExpanded ? '−' : '+'}
                      </Text>
                    </TouchableOpacity>

                    {isExpanded ? (
                      <View style={styles.cardBody}>
                        <Text style={styles.answer}>{a || '—'}</Text>
                      </View>
                    ) : null}
                  </View>
                );
              }}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

