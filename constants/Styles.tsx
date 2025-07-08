import { Colors } from '@/constants/Colors';
import { SCREEN_WIDTH } from '@gorhom/bottom-sheet';
import { StyleSheet } from 'react-native';

const shadow = {
  elevation: 5,
  shadowColor: Colors.black,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 3,
};

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
    overflow: 'hidden',
  },
  
  iconButton: {
    position: 'absolute',
    right: 16,
    top: '50%',
  },

  input: {
    color: Colors.textPrimary,
    borderColor: Colors.textPrimary,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 0,
    marginBottom: 16,
  },

  textInput: {
    flex: 1,
    fontFamily: 'PoppinsRegular',
    color: Colors.textPrimary,
    textAlign: 'left',
    fontSize: 14,
    paddingVertical: 16,
    includeFontPadding: false,
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

  categoryDisplay: {
    backgroundColor: Colors.navigationBar,
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: Colors.borderStroke,
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

  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: Colors.textSecondary,
    width: 48,
    height: 48,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadow,
  },

  cancelDelete: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
});