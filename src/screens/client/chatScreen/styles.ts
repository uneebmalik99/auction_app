import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F0F0F',
  },

  // ─── Header ───────────────────────────────────────────────────────────────
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
    backgroundColor: '#1A1A1A',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  headerIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(239,68,68,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    flexShrink: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 5,
  },
  statusText: {
    color: '#94a3b8',
    fontSize: 11,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 8,
  },
  iconBtn: {
    padding: 8,
    borderRadius: 10,
  },

  // ─── Message List ─────────────────────────────────────────────────────────
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 10,
  },
  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 14,
    marginTop: 10,
  },
  emptySubText: {
    color: '#475569',
    fontSize: 12,
    marginTop: 4,
  },

  // ─── Message Bubble ───────────────────────────────────────────────────────
  messageWrapper: {
    marginBottom: 10,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  rowReverse: {
    justifyContent: 'flex-end',
  },
  rowDirect: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 18,
  },
  customerBubble: {
    backgroundColor: '#2563eb',
    borderBottomRightRadius: 4,
  },
  adminBubble: {
    backgroundColor: '#262626',
    borderBottomLeftRadius: 4,
  },
  deletedBubble: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  msgText: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 21,
  },
  deletedText: {
    color: '#94a3b8',
    fontSize: 14,
    fontStyle: 'italic',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    gap: 4,
  },
  metaRowRight: {
    justifyContent: 'flex-end',
  },
  metaRowLeft: {
    justifyContent: 'flex-start',
  },
  timestamp: {
    fontSize: 10,
    color: '#64748b',
  },
  readTick: {
    fontSize: 10,
  },

  // ─── File Message ─────────────────────────────────────────────────────────
  imageAttachment: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginTop: 6,
  },
  docAttachment: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: 10,
    borderRadius: 10,
    marginTop: 6,
    gap: 8,
  },
  docFileName: {
    color: '#e2e8f0',
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  docFileSize: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 2,
  },

  // ─── Delete Swipe Button ──────────────────────────────────────────────────
  deleteBtn: {
    padding: 8,
    backgroundColor: 'rgba(51,65,85,0.8)',
    borderRadius: 20,
    marginRight: 6,
    marginBottom: 4,
  },

  // ─── Typing Indicator ─────────────────────────────────────────────────────
  typingText: {
    paddingHorizontal: 16,
    paddingBottom: 6,
    fontSize: 12,
    color: '#64748b',
    fontStyle: 'italic',
  },

  // ─── Input Area ───────────────────────────────────────────────────────────
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#1A1A1A',
    borderTopWidth: 1,
    borderTopColor: '#262626',
    alignItems: 'flex-end',
    paddingBottom: Platform.OS === 'ios' ? 30 : 12,
  },
  attachBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#262626',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#262626',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 16,
    maxHeight: 100,
    marginRight: 8,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledBtn: {
    opacity: 0.4,
  },

  // ─── Upload Progress ──────────────────────────────────────────────────────
  uploadingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#1A1A1A',
    gap: 8,
  },
  uploadingText: {
    color: '#94a3b8',
    fontSize: 13,
  },
});
