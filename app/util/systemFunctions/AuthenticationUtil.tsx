import * as LocalAuthentication from 'expo-local-authentication';

export const authenticate = async (onSuccess: () => void) => {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Authenticate to view your data',
    fallbackLabel: 'Enter Passcode',
  });

  if (result.success) {
    onSuccess();
  }
};