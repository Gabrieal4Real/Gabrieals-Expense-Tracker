
// flutterBridge.ts
import { NativeModules } from 'react-native';

type OpenFlutterOptions = {
  route?: string;
  params?: Record<string, any>;
};

export async function openFlutter(options: OpenFlutterOptions = {}) {
  console.log(NativeModules);

  const mod = (NativeModules as any).FlutterBridgeModule;
  console.log(mod);

  const mod2 = NativeModules.FlutterBridgeModule;
  console.log(mod2);

  if (!mod?.openFlutter) {
    console.log('FlutterBridge native module not found. Run `expo prebuild` and use a dev client (expo-dev-client)');
    throw new Error(
      'FlutterBridge native module not found. Run `expo prebuild` and use a dev client (expo-dev-client).'
    );
  }

  console.log('Opening Flutter with options:', options);
  return mod.openFlutter(options.route ?? '', options.params ?? {});
}
