import React from 'react';
import { View } from 'react-native';
import CheckBox from '../checkBox/checkBox';
import { styles } from './styles';
import { FeatureOption } from '../../utils/types';



interface MultiCheckBoxProps {
  options: FeatureOption[];
  selectedIds: string[];
  multiple?: boolean;
  onChange: (selectedIds: string[]) => void;
}

export default function MultiCheckBox({
  options,
  selectedIds,
  multiple = true,
  onChange,
}: MultiCheckBoxProps) {
  const columns = 2;
  const rows: FeatureOption[][] = [];

  for (let i = 0; i < options.length; i += columns) {
    rows.push(options.slice(i, i + columns));
  }

  const handleToggle = (id: string) => {
    const isSelected = selectedIds.includes(id);

    if (multiple) {
      if (isSelected) {
        onChange(selectedIds.filter(itemId => itemId !== id));
      } else {
        onChange([...selectedIds, id]);
      }
    } else {
      // Single selection behaves like radio buttons – always one selected
      if (!isSelected) {
        onChange([id]);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.optionRow}>
            {row.map(option => (
              <CheckBox
                key={option.id}
                checked={selectedIds.includes(option.id)}
                onToggle={() => handleToggle(option.id)}
                label={option.label}
                containerStyle={styles.optionItem}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}
