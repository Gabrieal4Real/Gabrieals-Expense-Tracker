
import { Colors } from '@/constants/Colors';
import { StyleSheet } from 'react-native';

export const baseStyles = StyleSheet.create({
  baseBackground: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    paddingTop: 18,
    paddingHorizontal: 18,
  },
  baseRoundedBox: {
    backgroundColor: Colors.navigationBar,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    elevation: 2,
    shadowColor: Colors.black,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  input: {
    color: Colors.textPrimary,
    borderColor: Colors.textPrimary,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 16,
    marginBottom: 16,
  },
  button: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  categoryButton: {
    backgroundColor: Colors.navigationBar,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.borderStroke,
  },
  selectedCategoryButton: {
    backgroundColor: Colors.textSecondary,
    borderColor: 'transparent',
  },
  pressed: {
    opacity: 0.7,
  },
});