
import { Colors } from '@/constants/Colors';
import { StyleSheet } from 'react-native';

export const baseStyles = StyleSheet.create({
  baseBackground: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    padding: 16,
  },
  baseRoundedBox: {
    backgroundColor: Colors.navigationBar,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    elevation: 2,
    shadowColor: Colors.black,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
});