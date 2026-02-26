import React, { useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Share,
  Alert,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { X, Share2, Download } from 'lucide-react-native';
import { appColors } from '../../../../utils/appColors';

interface InvoiceViewModalProps {
  visible: boolean;
  htmlContent: string;
  onClose: () => void;
}

export default function InvoiceViewModal({
  visible,
  htmlContent,
  onClose,
}: InvoiceViewModalProps) {
  const webViewRef = useRef<WebView>(null);

  const handleShare = async () => {
    try {
      // Create a data URI for the HTML content
      const dataUri = `data:text/html;charset=utf-8,${encodeURIComponent(htmlContent)}`;
      
      if (Platform.OS === 'ios') {
        // For iOS, use WebView's print/share functionality
        webViewRef.current?.injectJavaScript(`
          window.print();
          true;
        `);
      } else {
        // For Android, share the HTML content
        await Share.share({
          message: 'Invoice Document',
          title: 'Share Invoice',
        });
      }
    } catch (error: any) {
      Alert.alert('Error', 'Failed to share invoice');
    }
  };

  const handleDownload = () => {
    // Inject JavaScript to trigger print dialog which allows saving as PDF
    webViewRef.current?.injectJavaScript(`
      window.print();
      true;
    `);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Invoice</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={handleShare}
              style={styles.actionButton}
              activeOpacity={0.7}
            >
              <Share2 size={20} color={appColors.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDownload}
              style={[styles.actionButton, { marginLeft: 12 }]}
              activeOpacity={0.7}
            >
              <Download size={20} color={appColors.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onClose} style={[styles.closeButton, { marginLeft: 12 }]}>
              <X size={24} color={appColors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>
        <WebView
          ref={webViewRef}
          source={{ html: htmlContent }}
          style={styles.webview}
          startInLoadingState
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={appColors.primary} />
            </View>
          )}
          onMessage={(event) => {
            // Handle messages from WebView if needed
          }}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: appColors.inputBorder,
    backgroundColor: appColors.surface,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: appColors.textPrimary,
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 4,
  },
  closeButton: {
    padding: 4,
  },
  webview: {
    flex: 1,
    backgroundColor: appColors.background,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: appColors.background,
  },
});
