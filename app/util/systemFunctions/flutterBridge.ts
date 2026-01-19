import { NativeModules, Platform } from 'react-native';

type OpenFlutterOptions = {
  route?: string;
  params?: Record<string, any>;
};

export async function openFlutter(options: OpenFlutterOptions = {}) {
  console.log('[FlutterBridge] Attempting to open Flutter...', { 
    platform: Platform.OS, 
    route: options.route 
  });
  
  const mod = (NativeModules as any).FlutterBridgeModule;

  if (!mod?.openFlutter) {
    const error = 'FlutterBridge native module not found. Run `expo prebuild` and use a dev client (expo-dev-client).';
    console.error('[FlutterBridge]', error);
    throw new Error(error);
  }

  try {
    const result = await mod.openFlutter(options.route ?? '', options.params ?? {});
    console.log('[FlutterBridge] Successfully opened Flutter', result);
    return result;
  } catch (error) {
    console.error('[FlutterBridge] Error opening Flutter:', error);
    throw error;
  }
}