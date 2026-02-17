import React, { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  Modal,
  Pressable,
} from 'react-native';

const { width } = Dimensions.get('window');
const IMAGE_WIDTH = width - 40;
const IMAGE_HEIGHT = 320;

// Pick a clean outline (e.g., from image:0)
const CAR_IMAGE_URI =
  'https://thumbs.dreamstime.com/b/sedan-car-outline-business-sedan-vehicle-template-vector-isolated-white-view-front-rear-side-top-all-sedan-car-outline-103055165.jpg';

type IssueType = 'damage' | 'dent' | 'scratch' | 'repaint' | 'repair';

interface Mark {
  id: string;
  x: number;
  y: number;
  type: IssueType;
  label: string;
}

const issueOptions = [
  { type: 'damage' as IssueType, label: 'General Damage', color: '#F44336' }, // Red
  { type: 'dent' as IssueType, label: 'Dent', color: '#FF9800' }, // Orange
  { type: 'scratch' as IssueType, label: 'Scratch', color: '#2196F3' }, // Blue
  { type: 'repaint' as IssueType, label: 'Repainted Area', color: '#4CAF50' }, // Green
  { type: 'repair' as IssueType, label: 'Previous Repair', color: '#9C27B0' }, // Purple
];

export default function DamageMarkerWithType() {
  const [marks, setMarks] = useState<Mark[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [pendingPos, setPendingPos] = useState<{ x: number; y: number } | null>(
    null,
  );

  const handleTap = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    setPendingPos({ x: locationX, y: locationY });
    setModalVisible(true);
  };

  const addMark = (type: IssueType) => {
    if (!pendingPos) return;
    const option = issueOptions.find(o => o.type === type);
    const newMark: Mark = {
      id: Date.now().toString(),
      x: pendingPos.x,
      y: pendingPos.y,
      type,
      label: option?.label || 'Unknown',
    };
    setMarks([...marks, newMark]);
    setModalVisible(false);
    setPendingPos(null);
  };

  const undoLast = () => setMarks(marks.slice(0, -1));

  const grouped = issueOptions.map(opt => ({
    ...opt,
    items: marks.filter(m => m.type === opt.type),
  }));

  const renderDot = (mark: Mark) => {
    const color =
      issueOptions.find(o => o.type === mark.type)?.color || '#F44336';
    return (
      <View
        key={mark.id}
        style={[
          styles.dot,
          {
            left: mark.x - 12,
            top: mark.y - 12,
            backgroundColor: color,
          },
        ]}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mark Vehicle Issues</Text>
      <Text style={styles.instruction}>
        Tap on the car → a dot will be placed and you'll select the issue type
      </Text>

      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: CAR_IMAGE_URI }}
          style={styles.carImage}
          resizeMode="contain"
        />
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={handleTap}>
          {marks.map(renderDot)}
        </TouchableOpacity>
      </View>

      <Pressable
        style={styles.undoBtn}
        onPress={undoLast}
        disabled={marks.length === 0}
      >
        <Text style={styles.undoText}>Undo Last ({marks.length} dots)</Text>
      </Pressable>

      <Text style={styles.summary}>Issue Summary</Text>
      {grouped
        .filter(g => g.items.length > 0)
        .map(group => (
          <View key={group.type} style={styles.group}>
            <Text style={[styles.groupTitle, { color: group.color }]}>
              {group.label} ({group.items.length})
            </Text>
            {group.items.map((item, i) => (
              <Text key={item.id} style={styles.itemText}>
                • #{i + 1} at ({Math.round(item.x)}, {Math.round(item.y)})
              </Text>
            ))}
          </View>
        ))}

      {marks.length === 0 && (
        <Text style={styles.empty}>
          No issues marked yet. Tap the car to start!
        </Text>
      )}

      {/* Issue Type Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Select Issue Type</Text>
            {issueOptions.map(opt => (
              <Pressable
                key={opt.type}
                style={[styles.optionBtn, { borderLeftColor: opt.color }]}
                onPress={() => addMark(opt.type)}
              >
                <Text style={styles.optionText}>{opt.label}</Text>
              </Pressable>
            ))}
            <Pressable
              style={styles.cancelBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  instruction: {
    fontSize: 15,
    textAlign: 'center',
    color: '#555',
    marginBottom: 20,
  },
  imageWrapper: {
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 6,
  },
  carImage: { width: '100%', height: '100%' },
  dot: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  undoBtn: {
    backgroundColor: '#333',
    padding: 14,
    borderRadius: 12,
    alignSelf: 'center',
    marginVertical: 20,
  },
  undoText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  summary: { fontSize: 19, fontWeight: 'bold', marginVertical: 12 },
  group: { marginBottom: 16 },
  groupTitle: { fontSize: 17, fontWeight: '600', marginBottom: 6 },
  itemText: { fontSize: 14, marginLeft: 12, color: '#333' },
  empty: {
    textAlign: 'center',
    color: '#888',
    fontStyle: 'italic',
    marginTop: 30,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    width: '85%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  optionBtn: {
    padding: 16,
    borderLeftWidth: 8,
    backgroundColor: '#f9f9f9',
    marginVertical: 6,
    borderRadius: 10,
  },
  optionText: { fontSize: 16, fontWeight: '500' },
  cancelBtn: { marginTop: 16, padding: 12 },
  cancelText: {
    textAlign: 'center',
    color: '#D32F2F',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
