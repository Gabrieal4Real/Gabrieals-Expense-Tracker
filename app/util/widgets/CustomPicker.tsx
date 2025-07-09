import React, { useState } from 'react';
import { MultiSelect } from 'react-native-element-dropdown';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { baseStyles } from '@/constants/Styles';
import { textStyles } from './CustomText';

type Option = {
    label: string;
    value: string;
  };

type CustomPickerProps = {
    options: Option[];
    onChangeSelection?: (value: string[]) => void;
    autoSelected?: string[] ;
  };

export default function CustomPicker({
    options,
    onChangeSelection,
    autoSelected = []
  }: CustomPickerProps) {
    const [selected, setSelected] = useState<string[]>(autoSelected);
  
    const handleChange = (items: string[]) => {
      setSelected(items);
      onChangeSelection?.(items);
    };
  
    return (
        <MultiSelect
            data={options}
            itemTextStyle={[textStyles.tinyText, {color: Colors.white}]}
            selectedTextStyle={[textStyles.tinyText, {color: Colors.black}]}
            activeColor={Colors.textSecondary}
            containerStyle={[baseStyles.baseRoundedBox, {paddingHorizontal: 0, paddingVertical: 0, borderColor: Colors.borderStroke, borderWidth: 1}]}
            renderRightIcon={() => <Ionicons name="filter" size={24} color={Colors.textPrimary} />}
            visibleSelectedItem={false}
            labelField="label"
            valueField="value"
            placeholder=""
            value={selected}
            onChange={handleChange}
          />
      );
    };