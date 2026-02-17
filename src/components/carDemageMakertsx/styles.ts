import { StyleSheet } from 'react-native';
import { height, width } from '../../utils/dimensions';

const styles = StyleSheet.create({
  // ... (previous styles + new ones)
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
    marginBottom: 16,
  },
  imageContainer: {
    position: 'relative',
    width: width(100),
    height: height(25),
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 6,
  },
  carImage: { width: '100%', height: '100%' },
  marker: { position: 'absolute', width: 24, height: 24, borderRadius: 12 },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
  },
  undoButton: { backgroundColor: '#6200EE', padding: 12, borderRadius: 8 },
  undoText: { color: '#fff', fontWeight: 'bold' },
  summaryTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 16 },
  damageGroup: { marginBottom: 16 },
  groupTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  damageItem: { fontSize: 14, color: '#333', marginLeft: 8, marginVertical: 2 },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontStyle: 'italic',
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '80%',
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  optionButton: {
    padding: 16,
    borderLeftWidth: 6,
    marginVertical: 4,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  optionText: { fontSize: 16, fontWeight: '500' },
  cancelButton: { marginTop: 12, padding: 12 },
  cancelText: { textAlign: 'center', color: '#F44336', fontWeight: 'bold' },
});

export default styles;
