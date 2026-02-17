import React, { useState } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { styles } from './styles';

export type DropdownOption = {
  label: string;
  value: string;
};

export type DropdownValue = string | string[];

export interface DropdownProps {
  /** Label shown above the dropdown (e.g. "Role") */
  label?: string;
  /** Options to render in the dropdown */
  options: DropdownOption[];
  /** Selected value(s). String for single, string[] for multi. */
  value?: DropdownValue;
  /** If true, allows selecting multiple options. */
  multiple?: boolean;
  /** Called when selection changes. Receives string or string[] based on `multiple`. */
  onChange: (value: DropdownValue) => void;
  /** Optional container style override. */
  containerStyle?: StyleProp<ViewStyle>;
  /** Placeholder text when nothing is selected (single-select only). */
  placeholder?: string;
}

export default function Dropdown({
  label,
  options,
  value,
  multiple = false,
  onChange,
  containerStyle,
  placeholder = 'Select',
}: DropdownProps) {
  const [open, setOpen] = useState(false);

  const isSelected = (val: string) => {
    if (multiple) {
      return Array.isArray(value) && value.includes(val);
    }
    return value === val;
  };

  const handleSelect = (val: string) => {
    if (multiple) {
      const current = Array.isArray(value) ? value : [];
      const exists = current.includes(val);
      const next = exists ? current.filter(v => v !== val) : [...current, val];
      onChange(next);
    } else {
      onChange(val);
      setOpen(false);
    }
  };

  const selectedLabel = (() => {
    if (multiple) {
      if (!Array.isArray(value) || value.length === 0) return placeholder;
      const selectedOptions = options.filter(o => value.includes(o.value));
      if (!selectedOptions.length) return placeholder;
      return selectedOptions.map(o => o.label).join(', ');
    }
    const selected = options.find(o => o.value === value);
    return selected?.label ?? placeholder;
  })();

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <TouchableOpacity
        style={styles.trigger}
        activeOpacity={0.8}
        onPress={() => setOpen(prev => !prev)}
      >
        <Text style={styles.valueText}>{selectedLabel}</Text>
        <ChevronDown size={16} color={styles.icon.color as string} />
      </TouchableOpacity>

      {open && (
        <View style={styles.dropdown}>
          {options.map(option => {
            const selected = isSelected(option.value);
            return (
              <TouchableOpacity
                key={option.value}
                style={[styles.option, selected && styles.optionSelected]}
                onPress={() => handleSelect(option.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selected && styles.optionTextSelected,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}
