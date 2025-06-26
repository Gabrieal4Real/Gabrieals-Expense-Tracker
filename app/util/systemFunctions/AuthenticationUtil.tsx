import * as LocalAuthentication from 'expo-local-authentication';

export const authenticate = async (onSuccess: () => void) => {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();

  if (!hasHardware || !isEnrolled) {
    console.warn('Biometric authentication not available or not enrolled');
    onSuccess();
    return;
  }

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Authenticate to view your data',
    fallbackLabel: 'Enter Passcode',
  });

  if (result.success) {
    onSuccess();
  }
};