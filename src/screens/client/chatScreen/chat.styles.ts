import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F', // Matches your app's dark background
  },
  // Header styles if you aren't using your custom Header component
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // List and Bubbles
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 10,
  },
  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 20,
    marginBottom: 8,
  },
  customerBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF', // Standard Blue for user
    borderBottomRightRadius: 4,
  },
  adminBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#262626', // Dark Grey for admin
    borderBottomLeftRadius: 4,
  },
  msgText: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 10,
    color: '#888',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  // Input Area
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#1A1A1A',
    borderTopWidth: 1,
    borderTopColor: '#262626',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 30 : 12, // Handle home indicator
  },
  input: {
    flex: 1,
    backgroundColor: '#262626',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
    color: '#FFFFFF',
    fontSize: 16,
    maxHeight: 100,
  },
  sendBtn: {
    backgroundColor: '#007AFF',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  // Utilities
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F0F0F',
  },
});