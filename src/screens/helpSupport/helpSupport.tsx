import React, { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import {
  Button,
  Dropdown,
  ImagePickerField,
  Input,
  LoadingModal,
  Header,
} from '../../components';
import { styles } from './styles';
import screenNames from '../../routes/routes';
import { useNavigation } from '@react-navigation/native';
import type { RootNavigationProp } from '../../utils/types';
import { useImagePicker } from '../../hooks/useImagePicker';
import {
  createSupportTicket,
  type CreateSupportTicketPayload,
} from '../../api/support';
import { showErrorToast, showSuccessToast } from '../../utils/methods';
import { useI18n } from '../../i18n';

const SUPPORT_EMAIL = 'therevolutiontechnologies@gmail.com';

export default function HelpSupport() {
  const navigation = useNavigation<RootNavigationProp>();
  const { t } = useI18n();

  const [isTicketSheetVisible, setIsTicketSheetVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const { images, pickImages, removeImage, clearImages } = useImagePicker({
    maxImages: 3,
  });

  const categoryOptions = useMemo(
    () => [
      { label: t('category.technical'), value: 'technical' },
      { label: t('category.billing'), value: 'billing' },
      { label: t('category.account'), value: 'account' },
      { label: t('category.auction'), value: 'auction' },
      { label: t('category.other'), value: 'other' },
    ],
    [t],
  );

  const priorityOptions = useMemo(
    () => [
      { label: t('priority.low'), value: 'low' },
      { label: t('priority.medium'), value: 'medium' },
      { label: t('priority.high'), value: 'high' },
      { label: t('priority.urgent'), value: 'urgent' },
    ],
    [t],
  );

  const handleFAQ = () => {
    navigation.navigate(screenNames.faqs);
  };

  const handleChatbot = () => {
    Alert.alert(t('helpSupport.chatbot'), t('helpSupport.chatbotComing'));
  };

  const resetTicketForm = () => {
    setCategory('');
    setPriority('');
    setSubject('');
    setDescription('');
    clearImages();
  };

  const handleOpenTicket = () => {
    setIsTicketSheetVisible(true);
  };

  const handleCloseTicket = () => {
    if (submitting) return;
    setIsTicketSheetVisible(false);
  };

  const handleSubmitTicket = async () => {
    if (submitting) return;

    if (!category) {
      showErrorToast(t('ticket.missingCategoryTitle'), t('ticket.missingCategoryMsg'));
      return;
    }

    if (!priority) {
      showErrorToast(t('ticket.missingPriorityTitle'), t('ticket.missingPriorityMsg'));
      return;
    }

    const payload: CreateSupportTicketPayload = {
      subject: subject.trim() || 'Support Ticket',
      category,
      priority,
      description: description.trim() || '-',
    };

    try {
      setSubmitting(true);
      await createSupportTicket(payload, images);
      showSuccessToast(t('ticket.successTitle'), t('ticket.successMsg'));
      setIsTicketSheetVisible(false);
      resetTicketForm();
    } catch (e) {
      const message =
        e instanceof Error
          ? e.message
          : t('ticket.failedMsg');
      showErrorToast(t('ticket.failedTitle'), message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEmailUs = async () => {
    const mailtoUrl = `mailto:${SUPPORT_EMAIL}`;
    try {
      const canOpen = await Linking.canOpenURL(mailtoUrl);
      if (!canOpen) {
        Alert.alert(
          t('helpSupport.emailTitle'),
          `${t('helpSupport.emailFallback')} ${SUPPORT_EMAIL}`,
        );
        return;
      }
      await Linking.openURL(mailtoUrl);
    } catch (e) {
      Alert.alert(
        t('helpSupport.emailTitle'),
        `${t('helpSupport.emailFallback')} ${SUPPORT_EMAIL}`,
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header titleKey="helpSupport.title" />

      <View style={styles.container}>
        <View style={styles.introCard}>
          <Text style={styles.title}>{t('helpSupport.howCanHelp')}</Text>
          <Text style={styles.subtitle}>{t('helpSupport.subtitle')}</Text>
        </View>

        <View style={styles.actionsContainer}>
          <Button
            label={t('helpSupport.faq')}
            onPress={handleFAQ}
            variant="secondary"
            buttonStyle={styles.actionButton}
          />
          {/* <Button
            label="Chat With Us (Chatbot)"
            onPress={handleChatbot}
            variant="secondary"
            buttonStyle={styles.actionButton}
          /> */}
          <Button
            label={t('helpSupport.submitTicket')}
            onPress={handleOpenTicket}
            variant="secondary"
            buttonStyle={styles.actionButton}
          />
          <Button
            label={t('helpSupport.emailUs')}
            onPress={handleEmailUs}
            variant="secondary"
            buttonStyle={styles.actionButton}
          />
        </View>
      </View>

      <Modal
        isVisible={isTicketSheetVisible}
        onBackdropPress={handleCloseTicket}
        onBackButtonPress={handleCloseTicket}
        swipeDirection={submitting ? undefined : 'down'}
        onSwipeComplete={handleCloseTicket}
        style={styles.sheetModal}
        backdropOpacity={0.6}
        avoidKeyboard
        propagateSwipe
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>{t('ticket.title')}</Text>
            <Text style={styles.sheetSubtitle}>{t('ticket.subtitle')}</Text>

            <ScrollView
              style={styles.sheetScroll}
              contentContainerStyle={styles.sheetContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Input
                label={t('ticket.subjectOptional')}
                value={subject}
                onChangeText={setSubject}
                placeholder={t('ticket.subjectPlaceholder')}
              />

              <Dropdown
                label={t('ticket.category')}
                options={categoryOptions}
                value={category}
                onChange={val => setCategory(String(val))}
                placeholder={t('ticket.categoryPlaceholder')}
              />

              <Dropdown
                label={t('ticket.priority')}
                options={priorityOptions}
                value={priority}
                onChange={val => setPriority(String(val))}
                placeholder={t('ticket.priorityPlaceholder')}
              />

              <Input
                label={t('ticket.descriptionOptional')}
                value={description}
                onChangeText={setDescription}
                placeholder={t('ticket.descriptionPlaceholder')}
                multiline
                style={styles.descriptionInput}
                textAlignVertical="top"
              />

              <ImagePickerField
                label={t('ticket.attachmentsOptional')}
                helperText={t('ticket.attachmentsHelper')}
                images={images}
                maxImages={3}
                onAddPress={pickImages}
                onRemoveImage={uri => removeImage(uri)}
              />

              <Button
                label={submitting ? t('ticket.submitting') : t('ticket.submit')}
                onPress={handleSubmitTicket}
                buttonStyle={styles.submitButton}
                disabled={submitting}
                loading={submitting}
              />

              <View style={styles.sheetBottomSpace} />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <LoadingModal visible={submitting} message={t('ticket.submittingModal')} />
    </SafeAreaView>
  );
}
