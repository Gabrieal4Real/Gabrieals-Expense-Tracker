import { NativeModules } from 'react-native';

type OpenFlutterOptions = {
  route?: string;
  params?: Record<string, any>;
};

export async function openFlutter(options: OpenFlutterOptions = {}) {
  const mod = (NativeModules as any).FlutterBridgeModule;

  if (!mod?.openFlutter) {
    throw new Error(
      'FlutterBridge native module not found. Run `expo prebuild` and use a dev client (expo-dev-client).'
    );
  }
  return mod.openFlutter(options.route ?? '', options.params ?? {});
}